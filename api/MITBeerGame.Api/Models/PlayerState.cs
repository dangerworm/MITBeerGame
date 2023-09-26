using MITBeerGame.Api.Enums;

namespace MITBeerGame.Api.Models
{
    public class PlayerState
    {
        public PlayerState(string gameId, int eventNumber, RoleType roleType, int roundNumber, int stockLevel, int totalOut, int onBackOrder, Dictionary<int, int> inTransit)
        {
            GameId = gameId;
            EventNumber = eventNumber;
            RoleType = roleType;
            RoundNumber = roundNumber;
            StockLevel = stockLevel;
            TotalOut = totalOut;
            OnBackOrder = onBackOrder;
            InTransit = inTransit;
        }

        public string GameId { get; }
        public int EventNumber { get; }
        public RoleType RoleType { get; }
        public int RoundNumber { get; }
        public int StockLevel { get; }
        public int TotalOut { get; }
        public int OnBackOrder { get; }

        // Keyed by number of weeks away
        public Dictionary<int, int> InTransit { get; }
        public int TotalIn => InTransit[0];
    }
}
