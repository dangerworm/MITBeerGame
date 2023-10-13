
using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Utilities;

namespace MITBeerGame.Api.Models
{
    public class Game
    {
        public Game(string name, int initialStock = 12, int initialInOut = 4, int deliveryTimeInRounds = 2)
        {
            Id = Guid.NewGuid().ToString()[..6];
            Name = name;

            var market = new Player(Id, RoleType.Market.GetRole(), RoleType.Market, initialInOut);
            Players = new List<Player> { market };

            Events = new List<GameEvent>();
            InitialStock = initialStock;
            InitialInOut = initialInOut;
            DeliveryTimeInRounds = deliveryTimeInRounds;
        }

        public string Id { get; }

        public string Name { get; }

        public List<Player> Players { get; }

        public List<GameEvent> Events { get; }

        public bool IsStarted => GameTimer != null;

        public int RoundNumber => GameTimer?.GetRoundNumber() ?? 0;

        public GameTimer? GameTimer { get; set; }

        public IEnumerable<string> PlayerNames => Players.Select(x => x.PlayerName);

        public int InitialInOut { get; }

        private int InitialStock { get; }

        private int DeliveryTimeInRounds { get; }

        public void InitialisePlayer(RoleType roleType)
        {
            var inTransit = Enumerable.Range(0, DeliveryTimeInRounds + 1)
                .ToList()
                .ToDictionary(key => key, value => InitialInOut);

            AddEvent(roleType, 0, InitialStock,  InitialInOut, InitialInOut, InitialInOut, 0, inTransit, $"{roleType.GetRole()} initialised");
        }

        public void StartNextRound()
        {
            var previousRoleStockOut = 0;

            foreach (RoleType roleType in Enum.GetValues(typeof(RoleType)))
            {
                var player = Players.Single(p => p.RoleType == roleType);
                var playerLastState = player.History.Last();

                if (roleType == RoleType.Market)
                {
                    continue;                    
                }

                var dependentPlayer = Players.Single(p => p.RoleType == player.RoleType + 1);
                var dependentPlayerLastEvent = Events.Last(e => e.Player != null && e.Player.Id == dependentPlayer.Id);

                var stockOut = Math.Min(dependentPlayer.NextOrder + playerLastState.OnBackOrder,
                    playerLastState.StockLevel);
                var onBackOrder = playerLastState.OnBackOrder + dependentPlayer.NextOrder - stockOut;
                var inTransit = GetGoodsInTransit(playerLastState, roleType, player.NextOrder, previousRoleStockOut);
                var stockLevel = playerLastState.StockLevel - stockOut + inTransit[0];
                
                AddEvent(
                    roleType,
                    RoundNumber - 1,
                    stockLevel,
                    player.NextOrder,
                    dependentPlayerLastEvent.OrderAmount,
                    stockOut,
                    onBackOrder,
                    inTransit,
                    $"{roleType.GetRole()} updated for round {RoundNumber}");
                
                previousRoleStockOut = stockOut;
                player.NextOrder = 0;
            }
        }

        private Dictionary<int, int> GetGoodsInTransit(
            PlayerState playerLastState,
            RoleType roleType,
            int nextOrderAmount,
            int previousRoleStockOut)
        {
            var inTransit = Enumerable.Range(0, DeliveryTimeInRounds)
                .ToList()
                .ToDictionary(
                    roundsUntilDelivery => roundsUntilDelivery,
                    roundsUntilDelivery => playerLastState.InTransit[roundsUntilDelivery + 1]);

            inTransit[DeliveryTimeInRounds] = roleType == RoleType.Brewer
                ? nextOrderAmount
                : previousRoleStockOut;

            return inTransit;
        }
        
        private void AddEvent(
            RoleType roleType,
            int roundNumber,
            int stockLevel,
            int orderAmount,
            int lastDispatched,
            int totalOut,
            int onBackOrder,
            Dictionary<int, int> inTransit, 
            string description)
        {
            var eventExists = Events.Any(e =>
                e.GameId == Id &&
                e.Player?.RoleType == roleType &&
                e.RoundNumber == roundNumber);

            if (eventExists)
            {
                return;
            }
            
            var player = Players.Single(p => p.RoleType == roleType);
            var eventNumber = Events.Count + 1;
                
            player.History.Add(new PlayerState(Id, eventNumber, roleType, roundNumber, stockLevel, lastDispatched, totalOut, onBackOrder, inTransit));
                
            Events.Add(new GameEvent(Id, eventNumber, player, roundNumber, orderAmount, description));
        }
    }
}