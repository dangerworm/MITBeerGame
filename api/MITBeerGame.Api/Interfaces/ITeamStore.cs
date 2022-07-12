using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface ITeamStore
    {
        Team Create(string gameId, string teamName);
        IEnumerable<Team> ReadAll();
        IEnumerable<Team> Read(IEnumerable<string> teamIds);
        Team Read(string id);
        bool RoleFilled(string role, string teamId);
        bool TeamExists(string teamName, IEnumerable<string>? teamIds = null);

        void CreatePlayer(string teamId, Player player);
        void DeletePlayer(string teamId, string playerId);
    }
}