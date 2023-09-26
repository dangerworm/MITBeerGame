using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.HubClients;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Hubs
{
    public class GameplayHub : Hub<IGameplayClient>
    {
        private readonly IHubContext<GameSetupHub, IGameSetupClient> _gameSetupHub;
        private readonly IHubContext<GameplayHub, IGameplayClient> _gameplayHub;
        private readonly IGameService _gameService;

        public GameplayHub(
            IHubContext<GameSetupHub, IGameSetupClient> gameSetupHub,
            IHubContext<GameplayHub, IGameplayClient> gameplayHub,
            IGameService gameService
        )
        {
            _gameSetupHub = gameSetupHub;
            _gameplayHub = gameplayHub;
            _gameService = gameService;
        }

        public async Task StartGame(string gameId, string playerId, int roundLengthSeconds = 30)
        {
            var beginGame = _gameService.StartGame(gameId, playerId, roundLengthSeconds);
            if (beginGame)
            {
                await _gameplayHub.Clients.All.StartGame(gameId);
            }

            var games = _gameService.ReadAll().ToList();
            await _gameSetupHub.Clients.All.UpdateGames(games);
            await _gameplayHub.Clients.All.UpdateHistory(_gameService.ReadPlayerHistories());
        }
    }
}
