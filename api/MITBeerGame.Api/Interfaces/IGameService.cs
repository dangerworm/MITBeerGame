using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameService
    {
        Game Create(string gameName);
        IEnumerable<Game> ReadAll();
        Game Read(string id);
        IEnumerable<PlayerState> ReadPlayerHistories();
        void Delete(string id);
        bool IsRoleFilled(string gameId, RoleType roleType);
        bool StartGame(string gameId, string playerId, int roundLengthSeconds);
    }
}