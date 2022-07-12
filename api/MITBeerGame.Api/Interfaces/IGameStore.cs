using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameStore
    {
        Game Create(string gameName);
        IEnumerable<Game> ReadAll();
        Game Read(string id);
        void Delete(string id);
        
        void AddTeam(string gameId, string teamId);
    }
}