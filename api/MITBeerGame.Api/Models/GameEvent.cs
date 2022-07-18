using MITBeerGame.Api.Enums;

namespace MITBeerGame.Api.Models
{
    public class GameEvent
    {
        public GameEvent(string gameId, string teamId,  Player player, int roundNumber, int orderAmount)
        {
            Id = Guid.NewGuid().ToString();
            DateTime = DateTime.Now;

            GameId = gameId;
            TeamId = teamId;
            Player = player;

            RoundNumber = roundNumber;
            OrderAmount = orderAmount;
        }

        public string Id { get; }
        public DateTime DateTime { get; }
        public string GameId { get; }
        public string TeamId { get; }
        public Player Player { get; }

        public int RoundNumber { get; }
        public int OrderAmount { get; }

    }
}
