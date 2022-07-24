using MITBeerGame.Api.Enums;

namespace MITBeerGame.Api.Models
{
    public class PlayerState
    {
        public PlayerState(int roundNumber, RoleType roleType, int stockLevel, int totalOut, int onBackOrder, Dictionary<int, int> inTransit)
        {
            RoundNumber = roundNumber;
            RoleType = roleType;
            StockLevel = stockLevel;
            TotalOut = totalOut;
            OnBackOrder = onBackOrder;
            InTransit = inTransit;
        }

        public int RoundNumber { get; set; }
        public RoleType RoleType { get; set; }
        public int StockLevel { get; set; }
        public int TotalOut { get; set; }
        public int OnBackOrder { get; set; }
        public int Ordered { get; set; }

        // Keyed by number of weeks away
        public Dictionary<int, int> InTransit { get; set; }
        public int TotalIn => InTransit[0];
    }
}
