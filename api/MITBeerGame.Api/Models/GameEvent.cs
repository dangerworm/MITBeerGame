using MITBeerGame.Api.Enums;

namespace MITBeerGame.Api.Models
{
    public class GameEvent
    {
        public GameEvent(string gameId, string teamId, RoleType roleType, int orderAmount)
        {
            Id = Guid.NewGuid().ToString();
            DateTime = DateTime.Now;
            GameId = gameId;
            TeamId = teamId;
            RoleType = roleType;
            OrderAmount = orderAmount;
        }

        public string Id { get; }
        public DateTime DateTime { get; }
        public string GameId { get; }
        public string TeamId { get; }
        public RoleType RoleType { get; }

        public int OrderAmount { get; }

    }
}
