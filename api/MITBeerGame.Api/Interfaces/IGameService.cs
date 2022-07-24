using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameService
    {
        Game Create(string gameName);
        IEnumerable<Game> ReadAll();
        Game Read(string id);
        void Delete(string id);
        bool IsRoleFilled(string gameId, RoleType roleType);
        (Game game, bool beginGame) StartGame(string gameId, string playerId, int roundLengthSeconds);
        void AddEvent(GameEvent gameEvent);
        void StartNextRound(string gameId);
    }
}