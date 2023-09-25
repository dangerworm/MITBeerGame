using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Services
{
    public class GameService : IGameService
    {
        private readonly IGameStore _gameStore;

        public GameService(IGameStore gameStore)
        {
            _gameStore = gameStore;
        }

        public Game Create(string gameName)
        {
            return _gameStore.Create(gameName);
        }

        public IEnumerable<Game> ReadAll()
        {
            return _gameStore.ReadAll();
        }

        public Game Read(string id)
        {
            return _gameStore.Read(id);
        }

        public void Delete(string id)
        {
            _gameStore.Delete(id);
        }

        public bool IsRoleFilled(string gameId, RoleType roleType)
        {
            return Read(gameId).Players.Any(p => p.RoleType == roleType);
        }

        public (Game game, bool beginGame) StartGame(string gameId, string playerId, int roundLengthSeconds)
        {
            var game = _gameStore.Read(gameId);
            var gameWasStarted = game.IsStarted;
            
            _gameStore.SetPlayerReady(playerId);

            var allPlayersReady = game.Players.All(p => p.IsReady);
            
            var beginGame = !gameWasStarted && allPlayersReady;
            if (beginGame)
            {
                _gameStore.StartGame(gameId, roundLengthSeconds);
            }

            return (game, beginGame);
        }

        public void AddEvent(GameEvent gameEvent)
        {
            _gameStore.AddEvent(gameEvent);
        }

        public void StartNextRound(string gameId)
        {
            var game = _gameStore.Read(gameId);

            game.StartNextRound();
        }
    }
}
