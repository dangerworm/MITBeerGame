using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameStore
    {
        Game Create(string gameName);
        Game Read(string id);
        IEnumerable<Game> ReadAll();
        void Delete(string id);
        
        void AddTeam(string gameId, string teamId);
    }
}