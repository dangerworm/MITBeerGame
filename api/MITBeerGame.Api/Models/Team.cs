namespace MITBeerGame.Api.Models
{
    public class Team
    {
        public Team(string name)
        {
            Id = Guid.NewGuid().ToString()[..6];

            Name = name;

            Players = new List<Player>();
        }

        public string Id { get; }

        public string Name { get; }

        public List<Player> Players { get; }
        
        public IEnumerable<string> PlayerNames => Players.Select(x => x.PlayerName);
    }
}
