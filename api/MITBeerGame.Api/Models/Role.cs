using MITBeerGame.Api.Enums;

namespace MITBeerGame.Api.Models
{
    public class Role
    {
        public Role(string name, RoleType role)
        {
            Id = Guid.NewGuid().ToString();

            PlayerName = name;
            RoleType = role;
        }

        public string Id { get; }

        public string PlayerName { get; }
        
        public RoleType RoleType { get; }
    }
}
