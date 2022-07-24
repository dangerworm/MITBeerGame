using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameStore
    {
        Game Create(string gameName);
        IEnumerable<Game> ReadAll();
        Game Read(string id);
        public Game ReadByPlayerId(string playerId);
        void StartGame(string gameId, int roundLengthSeconds);
        void Delete(string id);

        bool RoleFilled(string gameId, RoleType roleType);

        void CreatePlayer(Player player);
        Player ReadPlayer(string playerId);
        void SetPlayerReady(string playerId);
        void DeletePlayer(string playerId);

        void AddEvent(GameEvent gameEvent);
    }
}