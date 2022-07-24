using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Interfaces
{
    public interface IPlayerService
    {
        void Create(Player player);
        Player Read(string playerId);
        void SetReady(string playerId);
        GameEvent SetPlayerOrderAmount(string playerId, int orderAmount);
        void Delete(string playerId);
    }
}