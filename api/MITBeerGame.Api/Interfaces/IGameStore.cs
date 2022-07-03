using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameStore
    {
        void AddTeam(string gameId, string teamId);
        Game Create();
        void Delete(string id);
        Game Read(string id);
        IEnumerable<Game> ReadAll();
    }
}