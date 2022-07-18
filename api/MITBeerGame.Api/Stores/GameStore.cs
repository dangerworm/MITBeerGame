using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;
using MITBeerGame.Api.Services;

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

        public Game Read(string id)
        {
            return _games[id];
        }

        public IEnumerable<Game> ReadAll()
        {
            return _games.Values;
        }

        public void AddTeam(string gameId, string teamId)
        {
            _games[gameId].TeamIds.Add(teamId);
        }

        public void AddEvent(string gameId, GameEvent @event)
        {
            _games[gameId].GameEvents.Add(@event);
        }

        public void Delete(string id)
        {
            _games.Remove(id);
        }

        public void StartGame(string gameId, int roundLengthSeconds)
        {
            if (_games[gameId].GameTimer == null)
            {
                _games[gameId].GameTimer = new GameTimer(roundLengthSeconds);
            }
        }

        public void AddEvent(GameEvent gameEvent)
        {
            var gameEvents = _games[gameEvent.GameId].GameEvents;
            
            var existingEvent = gameEvents.SingleOrDefault(ge => 
                ge.TeamId == gameEvent.TeamId &&
                ge.Player.Id == gameEvent.Player.Id &&
                ge.RoundNumber == gameEvent.RoundNumber);

            if (existingEvent != null)
            {
                gameEvents.Remove(existingEvent);
            }

            _games[gameEvent.GameId].GameEvents.Add(gameEvent);
        }
    }
}
