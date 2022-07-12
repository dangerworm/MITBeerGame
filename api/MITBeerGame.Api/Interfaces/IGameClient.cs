using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameClient
    {
        Task UpdateGames(IEnumerable<Game> teams);
        Task UpdateTeams(IEnumerable<Team> teams);
        Task UpdatePlayers(Team team);
    }
}
