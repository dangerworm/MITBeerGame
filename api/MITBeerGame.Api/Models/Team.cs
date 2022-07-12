namespace MITBeerGame.Api.Models
{
    public class Team
    {
        public Team(string gameId, string name)
        {
            Id = Guid.NewGuid().ToString()[..6];

            GameId = gameId;

            Name = name;

            Players = new List<Player>();
        }

        public string Id { get; }

        public string GameId { get; }

        public string Name { get; }

        public List<Player> Players { get; }
        
        public IEnumerable<string> PlayerNames => Players.Select(x => x.PlayerName);
    }
}
