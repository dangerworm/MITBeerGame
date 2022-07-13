using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IGameEventStore
    {
        GameEvent Create(GameEvent gameEvent);
        IEnumerable<GameEvent> ReadAll();
        IEnumerable<GameEvent> ReadByPlayerId(string playerId);
    }
}