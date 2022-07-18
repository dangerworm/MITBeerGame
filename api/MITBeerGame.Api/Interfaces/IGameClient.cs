using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameSetupClient
    {
        Task UpdateGames(IEnumerable<Game> games);
        Task UpdateTeams(IEnumerable<Team> teams);
    }
}
