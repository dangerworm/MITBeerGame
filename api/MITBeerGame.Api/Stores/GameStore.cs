using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;
using MITBeerGame.Api.Utilities;

namespace MITBeerGame.Api.Stores
{
    public class GameStore : IGameStore
    {
        private readonly IDictionary<string, Game> _games;

        public GameStore()
        {
            _games = new Dictionary<string, Game>();
        }

        public Game Create(string gameName)
        {
            var game = new Game(gameName);

            _games.Add(game.Id, game);

            return game;
        }

        public IEnumerable<Game> ReadAll()
        {
            return _games.Values;
        }

        public Game Read(string id)
        {
            return _games[id];
        }

        public Game ReadGameByPlayerId(string playerId)
        {
            return _games.Values.First(g => g.Players.Select(p => p.Id).Contains(playerId));
        }

        public void StartGame(string gameId, int roundLengthSeconds)
        {
            var game = _games[gameId];
            game.GameTimer = new GameTimer(roundLengthSeconds);
        }

        public void Delete(string id)
        {
            _games.Remove(id);
        }

        public bool RoleFilled(string gameId, RoleType roleType)
        {
            return _games[gameId].Players.Any(p => p.RoleType == roleType);
        }

        public void CreatePlayer(Player player)
        {
            _games[player.GameId].Players.Add(player);
        }

        public Player ReadPlayer(string playerId)
        {
            return ReadGameByPlayerId(playerId)
                .Players
                .Single(p => p.Id == playerId);
        }

        public void SetPlayerReady(string playerId)
        {
            ReadPlayer(playerId).IsReady = true;
        }

        public void DeletePlayer(string playerId)
        {
            var game = ReadGameByPlayerId(playerId);
                
            var player = _games[game.Id].Players.First(x => x.Id == playerId);

            _games[game.Id].Players.Remove(player);
        }

        public void AddEvent(GameEvent gameEvent)
        {
            var gameEvents = _games[gameEvent.GameId].Events;

            var existingEvent = gameEvents.SingleOrDefault(ge =>
                ge.Player != null &&
                gameEvent.Player != null &&
                ge.GameId == gameEvent.GameId &&
                ge.Player.Id == gameEvent.Player.Id &&
                ge.RoundNumber == gameEvent.RoundNumber);

            if (existingEvent != null)
            {
                gameEvents.Remove(existingEvent);
            }

            _games[gameEvent.GameId].Events.Add(gameEvent);
        }
    }
}
