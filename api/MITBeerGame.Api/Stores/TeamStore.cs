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

        public Team Create(string gameId, string teamName)
        {
            var team = new Team(gameId, teamName);

            _teams.Add(team.Id, team);

            return team;
        }
        public IEnumerable<Team> ReadAll()
        {
            return _teams.Values;
        }

        public IEnumerable<Team> Read(IEnumerable<string> teamIds)
        {
            return _teams.Values.Where(x => teamIds.Contains(x.Id));
        }

        public Team Read(string id)
        {
            return _teams[id];
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

            return _teams[teamId].Players.Any(p => p.RoleType == roleType);
        }

        public void CreatePlayer(string teamId, Player role)
        {
            _teams[teamId].Players.Add(role);
        }

        public void DeletePlayer(string teamId, string playerId)
        {
            var player = _teams[teamId].Players.First(x => x.Id == playerId);

            _teams[teamId].Players.Remove(player);
        }
    }
}
