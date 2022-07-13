using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Stores
{
    public class GameEventStore : IGameEventStore
    {
        private readonly IDictionary<string, List<GameEvent>> _gameEventsByPlayerId;

        public GameEventStore()
        {
            _gameEventsByPlayerId = new Dictionary<string, List<GameEvent>>();
        }

        public GameEvent Create(GameEvent gameEvent)
        {
            if (!_gameEventsByPlayerId.ContainsKey(gameEvent.Player.Id))
            {
                _gameEventsByPlayerId.Add(gameEvent.Player.Id, new List<GameEvent>());
            }

            _gameEventsByPlayerId[gameEvent.Player.Id].Add(gameEvent);

            return gameEvent;
        }

        public IEnumerable<GameEvent> ReadByPlayerId(string playerId)
        {
            return _gameEventsByPlayerId[playerId];
        }

        public IEnumerable<GameEvent> ReadAll()
        {
            return _gameEventsByPlayerId.Values.SelectMany(x => x);
        }
    }
}
