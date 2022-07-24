namespace MITBeerGame.Api.Models
{
    public class GameEvent
    {
        public GameEvent(string gameId, int roundNumber, string description)
        {
            Id = Guid.NewGuid().ToString();
            DateTime = DateTime.Now;

            GameId = gameId;

            RoundNumber = roundNumber;

            Description = description;
        }

        public GameEvent(string gameId, Player player, int roundNumber, int orderAmount, string description = "")
            :this (gameId, roundNumber, description)
        {
            Player = player;

            OrderAmount = orderAmount;
        }

        public string Id { get; }
        public DateTime DateTime { get; }
        public string GameId { get; }
        public Player? Player { get; }

        public int RoundNumber { get; }
        public int OrderAmount { get; }
        
        public string Description { get; }

    }
}
