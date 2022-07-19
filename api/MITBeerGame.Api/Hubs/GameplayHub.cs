using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.Interfaces;

namespace MITBeerGame.Api.Hubs
{
    public class GameplayHub : Hub<IGameplayClient>
    {
        private readonly IHubContext<GameSetupHub, IGameSetupClient> _gameSetupHub;
        private readonly IHubContext<GameplayHub, IGameplayClient> _gameplayHub;
        private readonly IGameStore _gameStore;

        public GameplayHub(IHubContext<GameSetupHub, IGameSetupClient> gameSetupHub, IHubContext<GameplayHub, IGameplayClient> gameplayHub, IGameStore gameStore)
        {
            _gameSetupHub = gameSetupHub;
            _gameplayHub = gameplayHub;
            _gameStore = gameStore;
        }

        public async Task StartGame(string gameId, string playerId, int roundLengthSeconds = 30)
        {
            _gameStore.StartGame(gameId, playerId, roundLengthSeconds);

            var games = _gameStore.ReadAll();

            await _gameSetupHub.Clients.All.UpdateGames(games);
            await _gameplayHub.Clients.All.UpdateEvents(games.SelectMany(g => g.GameEvents));
        }
    }
}
