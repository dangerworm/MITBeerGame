using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameplayClient
    {
        Task StartGame(string gameId);
        Task UpdateRoundNumber(int roundNumber);
        Task UpdateEvents(IEnumerable<GameEvent> gameEvents);
    }
}
