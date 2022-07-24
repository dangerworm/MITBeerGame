using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly IGameStore _gameStore;

        public PlayerService(IGameStore gameStore)
        {
            _gameStore = gameStore;
        }

        public void Create(Player player)
        {
            _gameStore.CreatePlayer(player);
        }

        public Player Read(string playerId)
        {
            return _gameStore.ReadPlayer(playerId);
        }

        public void SetReady(string playerId)
        {
            _gameStore.SetPlayerReady(playerId);
        }

        public GameEvent SetPlayerOrderAmount(string playerId, int orderAmount)
        {
            var game = _gameStore.ReadByPlayerId(playerId);
            var player = game.Players.First(p => p.Id == playerId);

            var gameEvent = new GameEvent(game.Id, player, game.RoundNumber, orderAmount);

            _gameStore.AddEvent(gameEvent);

            return gameEvent;
        }

        public void Delete(string playerId)
        {
            _gameStore.DeletePlayer(playerId);
        }
    }
}
