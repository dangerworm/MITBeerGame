using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Stores
{
    public class GameStore : IGameStore
    {
        private readonly IDictionary<string, Game> _games;

        public GameStore()
        {
            _games = new Dictionary<string, Game>();
        }

        public Game Create()
        {
            var game = new Game();

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
    }
}
