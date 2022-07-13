using MITBeerGame.Api.Enums;

namespace MITBeerGame.Api.Models
{
    public class GameEvent
    {
        public GameEvent(string gameId, string teamId, Player player, int orderAmount)
        {
            Id = Guid.NewGuid().ToString();
            DateTime = DateTime.Now;
            GameId = gameId;
            TeamId = teamId;
            Player = player;
            OrderAmount = orderAmount;
        }

        public string Id { get; }
        public DateTime DateTime { get; }
        public string GameId { get; }
        public string TeamId { get; }
        public Player Player { get; }

        public int OrderAmount { get; }

    }
}
