using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.HubClients
{
    public interface IGameSetupClient
    {
        Task UpdateGames(IEnumerable<Game> games);
    }
}
