using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameClient
    {
        Task UpdateGames(IEnumerable<Game> games);
        Task UpdateTeams(IEnumerable<Team> teams);
        Task UpdateEvents(IEnumerable<GameEvent> gameEvents);
    }
}
