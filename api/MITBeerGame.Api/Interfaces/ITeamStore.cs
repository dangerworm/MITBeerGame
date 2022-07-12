using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface ITeamStore
    {
        void AddPlayer(string teamId, Player player);
        Team Create(string teamName);
        IEnumerable<Team> Read(IEnumerable<string> ids);
        Team Read(string id);
        bool RoleFilled(string role, string teamId);
        bool TeamExists(string teamName, IEnumerable<string>? teamIds = null);
    }
}