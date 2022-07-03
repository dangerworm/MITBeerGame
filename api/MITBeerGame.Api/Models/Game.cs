namespace MITBeerGame.Api.Models
{
    public class Game
    {
        public Game()
        {
            Id = Guid.NewGuid().ToString()[..6];

            TeamIds = new List<string>();
            GameEvents = new List<GameEvent>();
        }

        public string Id { get; }

        public List<string> TeamIds { get; }

        public List<GameEvent> GameEvents { get; }
    }
}
