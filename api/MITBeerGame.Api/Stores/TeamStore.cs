using System.Globalization;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Stores
{
    public class TeamStore : ITeamStore
    {
        private readonly IDictionary<string, Team> _teams;

        public TeamStore()
        {
            _teams = new Dictionary<string, Team>();
        }

        public Team Create(string teamName)
        {
            var team = new Team(teamName);

            _teams.Add(team.Id, team);

            return team;
        }

        public Team Read(string id)
        {
            return _teams[id];
        }

        public IEnumerable<Team> Read(IEnumerable<string> ids)
        {
            return _teams.Values.Where(x => ids.Contains(x.Id));
        }

        public void AddPlayer(string teamId, Role role)
        {
            _teams[teamId].Roles.Add(role);
        }

        public bool TeamExists(string teamName, IEnumerable<string>? teamIds = null)
        {
            return teamIds == null
                ? _teams.Values.Any(x => string.Equals(x.Name, teamName, StringComparison.OrdinalIgnoreCase))
                : _teams.Values.Any(x => string.Equals(x.Name, teamName, StringComparison.OrdinalIgnoreCase) && teamIds.Contains(x.Id));
        }

        public bool RoleFilled(string role, string teamId)
        {
            var roleType = Helpers.GetRoleType(role);

            return _teams[teamId].Roles.Any(p => p.RoleType == roleType);
        }
    }
}
