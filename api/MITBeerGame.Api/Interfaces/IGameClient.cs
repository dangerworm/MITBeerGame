using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameClient
    {
        Task UpdateTeams(IEnumerable<Team> teams);
        Task UpdateTeam(Team team);
    }
}
