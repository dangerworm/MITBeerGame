using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.HubClients
{
    public interface IGameplayClient
    {
        Task StartGame(string gameId);
        Task UpdateGameTimes(IEnumerable<GameTime> gameTimes);
        Task UpdateHistory(IEnumerable<PlayerState> history);
    }
}
