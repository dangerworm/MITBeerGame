using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api
{
    public static class Helpers
    {
        public static RoleType GetRoleType(string role)
        {
            return role.ToLower() switch
            {
                "vendor" => RoleType.Vendor,
                "wholesaler" => RoleType.Wholesaler,
                "distributor" => RoleType.Distributor,
                "brewer" => RoleType.Brewer,
                _ => throw new ArgumentOutOfRangeException("Not a valid role")
            };
        }

        public static string GetRole(RoleType roleType)
        {
            return roleType switch
            {
                RoleType.Vendor => "Vendor",
                RoleType.Wholesaler => "Wholesaler",
                RoleType.Distributor => "Distributor",
                RoleType.Brewer => "Brewer",
                _ => throw new ArgumentOutOfRangeException("Not a valid role type")
            };
        }
    }
}
