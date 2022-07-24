using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api
{
    public static class Helpers
    {
        public static RoleType GetRoleType(this string role)
        {
            return role.ToLower() switch
            {
                "market" => RoleType.Market,
                "vendor" => RoleType.Vendor,
                "wholesaler" => RoleType.Wholesaler,
                "distributor" => RoleType.Distributor,
                "brewer" => RoleType.Brewer,
                _ => throw new ArgumentOutOfRangeException(nameof(role), "Not a valid role")
            };
        }

        public static string GetRole(this RoleType roleType)
        {
            return roleType switch
            {
                RoleType.Market => "Market",
                RoleType.Vendor => "Vendor",
                RoleType.Wholesaler => "Wholesaler",
                RoleType.Distributor => "Distributor",
                RoleType.Brewer => "Brewer",
                _ => throw new ArgumentOutOfRangeException(nameof(roleType), "Not a valid role type")
            };
        }

        public static string ReadyAndWaiting(string playerId)
        {
            return $"{playerId} ready and waiting";
        }
    }
}
