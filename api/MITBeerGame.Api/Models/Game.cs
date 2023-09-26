﻿using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Services;

namespace MITBeerGame.Api.Models
{
    public class Game
    {
        public Game(string name, int initialStock = 12, int initialInOut = 4, int deliveryTimeRounds = 2)
        {
            Id = Guid.NewGuid().ToString()[..6];
            Name = name;

            var market = new Player(Id, RoleType.Market.GetRole(), RoleType.Market);
            Players = new List<Player> { market };

            Events = new List<GameEvent>();
            InitialStock = initialStock;
            InitialInOut = initialInOut;
            DeliveryTimeRounds = deliveryTimeRounds;
        }

        public string Id { get; }

        public string Name { get; }

        public List<Player> Players { get; }

        public List<GameEvent> Events { get; }

        public bool IsStarted => GameTimer != null;

        public int RoundNumber => GameTimer?.GetRoundNumber() ?? 0;

        public GameTimer? GameTimer { get; set; }

        public IEnumerable<string> PlayerNames => Players.Select(x => x.PlayerName);

        private int InitialStock { get; }

        private int InitialInOut { get; }

        private int DeliveryTimeRounds { get; }

        public void InitialisePlayer(RoleType roleType)
        {
            var inTransit = Enumerable.Range(0, DeliveryTimeRounds + 1)
                .ToList()
                .ToDictionary(key => key, value => InitialInOut);

            AddEvent(roleType, 0, InitialStock, InitialInOut, 0, inTransit, $"{roleType.GetRole()} initialised");
        }

        public void StartNextRound()
        {
            if (RoundNumber == 0)
            {
                return;
            }
            
            var previousRoleStockOut = 0;

            foreach (RoleType roleType in Enum.GetValues(typeof(RoleType)))
            {
                var player = Players.Single(p => p.RoleType == roleType);
                var playerLastState = player.History.Last();
                var playerEvent = Events.Last(p => p.Player != null && p.Player.Id == player.Id);

                if (roleType == RoleType.Market)
                {
                    continue;                    
                }

                var dependentPlayer = Players.Single(p => p.RoleType == player.RoleType + 1);
                var dependentPlayerEvent = Events.Last(p => p.Player != null && p.Player.Id == dependentPlayer.Id);

                var stockOut = Math.Min(dependentPlayerEvent.OrderAmount + playerLastState.OnBackOrder,
                    playerLastState.StockLevel);
                var onBackOrder = playerLastState.OnBackOrder + dependentPlayerEvent.OrderAmount - stockOut;
                var inTransit = GetGoodsInTransit(playerLastState, roleType, player.NextOrder, previousRoleStockOut);
                var stockLevel = playerLastState.StockLevel - stockOut + inTransit[1];
                
                AddEvent(
                    roleType,
                    RoundNumber - 1,
                    stockLevel,
                    playerEvent.OrderAmount,
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
            var inTransit = Enumerable.Range(0, DeliveryTimeRounds)
                .ToList()
                .ToDictionary(
                    roundsUntilDelivery => roundsUntilDelivery,
                    roundsUntilDelivery => playerLastState.InTransit[roundsUntilDelivery + 1]);

            inTransit[DeliveryTimeRounds] = roleType == RoleType.Brewer
                ? nextOrderAmount
                : previousRoleStockOut;

            return inTransit;
        }
        
        private void AddEvent(
            RoleType roleType,
            int roundNumber,
            int stockLevel,
            int orderAmount,
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
                
            player.History.Add(new PlayerState(Id, eventNumber, roleType, roundNumber, stockLevel, orderAmount, onBackOrder, inTransit));
                
            Events.Add(new GameEvent(Id, eventNumber, player, roundNumber, InitialInOut, description));
        }
    }
}