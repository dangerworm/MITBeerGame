namespace MITBeerGame.Api.Models
{
    public class Team
    {
        public Team(string name)
        {
            Id = Guid.NewGuid().ToString();

            Name = name;

            Roles = new List<Role>();
        }

        public string Id { get; }

        public string Name { get; }

        public List<Role> Roles { get; }
        
        public IEnumerable<string> PlayerNames => Roles.Select(x => x.PlayerName);
    }
}
