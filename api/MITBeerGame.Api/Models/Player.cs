using MITBeerGame.Api.Enums;

namespace MITBeerGame.Api.Models
{
    public class Player
    {
        public Player(string name, RoleType role)
        {
            Id = Guid.NewGuid().ToString()[..6];

            PlayerName = name;
            RoleType = role;
        }

        public string Id { get; }

        public string PlayerName { get; }
        
        public RoleType RoleType { get; }

        public string Role => RoleType.GetRole();
    }
}
