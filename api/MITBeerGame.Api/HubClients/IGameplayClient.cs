using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.HubClients
{
    public interface IGameplayClient
    {
        Task StartGame(string gameId);
        Task UpdateRoundNumber(int roundNumber);
        Task UpdateHistory(IEnumerable<PlayerState> history);
    }
}
