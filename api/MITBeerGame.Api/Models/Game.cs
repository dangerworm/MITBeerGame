namespace MITBeerGame.Api.Models
{
    public class Game
    {
        public Game(string name)
        {
            Id = Guid.NewGuid().ToString()[..6];
            Name = name;

            TeamIds = new List<string>();
            GameEvents = new List<GameEvent>();
        }

        public string Id { get; }

        public string Name { get; }

        public List<string> TeamIds { get; }

        public List<GameEvent> GameEvents { get; }
    }
}
