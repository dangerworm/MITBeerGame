using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Services;

namespace MITBeerGame.Api.Models
{
    public class Game
    {
        public Game(string name, int initialStock = 12, int initialInOut = 4, int deliveryTimeRounds = 1)
        {
            Id = Guid.NewGuid().ToString()[..6];
            Name = name;

            var market = new Player(Id, "Market", Enums.RoleType.Market);

            Players = new List<Player>
            {
                market
            };

            Events = new List<GameEvent>
            {
                new GameEvent(Id, 0, Helpers.ReadyAndWaiting(market.Id))
            };

            InitialStock = initialStock;
            
            InitialInOut = initialInOut;

            DeliveryTimeRounds = deliveryTimeRounds;

            RoundNumber = 0;
        }

        public string Id { get; }

        public string Name { get; }

        public List<Player> Players { get; }

        public List<GameEvent> Events { get; }

        public bool IsStarted => GameTimer != null;

        public int RoundNumber { get; }

        public GameTimer? GameTimer { get; set; }

        public IEnumerable<string> PlayerNames => Players.Select(x => x.PlayerName);
        
        private int InitialStock { get; }

        private int InitialInOut { get; }

        private int DeliveryTimeRounds { get; }
        
        public void StartNextRound()
        {
            var newRoundNumber = RoundNumber + 1;
            var previousRoleStockOut = 0;

            foreach (RoleType roleType in Enum.GetValues(typeof(RoleType)))
            {
                var player = Players.Single(p => p.RoleType == roleType);
                var inTransit = new Dictionary<int, int>();

                if (RoundNumber == 0)
                {
                    for (var roundsUntilDelivery = 0; roundsUntilDelivery <= DeliveryTimeRounds; roundsUntilDelivery++)
                    {
                        inTransit.Add(roundsUntilDelivery, InitialInOut);
                    }

                    player.History.Add(new PlayerState(Id, roleType, newRoundNumber, InitialStock, InitialInOut, 0, inTransit));
                    continue;
                }

                var playerEvent = Events.Last(p => p.Player != null && p.Player.Id == player.Id);
                var playerLastState = player.History.Last();
                
                var dependentPlayer = Players.Single(p => p.RoleType == player.RoleType + 1);
                var dependentPlayerEvent = Events.Last(p => p.Player != null && p.Player.Id == dependentPlayer.Id);

                var stockOut = Math.Min(
                    dependentPlayerEvent.OrderAmount + playerLastState.OnBackOrder,
                    playerLastState.StockLevel);

                var onBackOrder = playerLastState.OnBackOrder + dependentPlayerEvent.OrderAmount - stockOut;

                for (var roundsUntilDelivery = 0; roundsUntilDelivery < DeliveryTimeRounds; roundsUntilDelivery++)
                {
                    inTransit.Add(roundsUntilDelivery, playerLastState.InTransit[roundsUntilDelivery]);
                }

                inTransit.Add(DeliveryTimeRounds, roleType == RoleType.Brewer ? playerEvent.OrderAmount : previousRoleStockOut);

                previousRoleStockOut = stockOut;

                player.History.Add(new PlayerState(
                    Id,
                    roleType,
                    newRoundNumber,
                    playerLastState.StockLevel - stockOut,
                    stockOut,
                    onBackOrder,
                    inTransit
                ));
            }
        }
    }
}
