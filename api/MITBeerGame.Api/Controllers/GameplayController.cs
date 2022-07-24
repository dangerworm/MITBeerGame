using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.HubClients;
using MITBeerGame.Api.Hubs;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameplayController
    {
        private readonly IHubContext<GameSetupHub, IGameSetupClient> _gameSetupHub;
        private readonly IHubContext<GameplayHub, IGameplayClient> _gameplayHub;

        private readonly IGameService _gameService;
        private readonly IPlayerService _playerService;

        public GameplayController(
            IHubContext<GameSetupHub, IGameSetupClient> gameSetupHub,
            IHubContext<GameplayHub, IGameplayClient> gameplayHub,
            IGameService gameService,
            IPlayerService playerService
        )
        {
            _gameSetupHub = gameSetupHub;
            _gameplayHub = gameplayHub;

            _gameService = gameService;
            _playerService = playerService;
        }

        [HttpPost("GetRoundNumber")]
        public async Task<IActionResult> GetRoundNumber([FromBody] GetRoundNumberInput input)
        {
            return new JsonResult(GetRoundNumber(input.GameId));
        }

        [HttpPost("CreateOrder")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderInput input)
        {
            // TODO: Validate that the order is expected at this time and
            // won't cause two orders to be created in the same round

            var gameEvent = _playerService.SetPlayerOrderAmount(input.PlayerId, input.OrderAmount);

            var games = _gameService.ReadAll();
            await _gameSetupHub.Clients.All.UpdateGames(games);
            await _gameplayHub.Clients.All.UpdateHistory(games.SelectMany(g => g.Players.SelectMany(p => p.History)));

            return new JsonResult(gameEvent);
        }

        [HttpPost("GetHistory")]
        public async Task<IActionResult> GetHistory([FromBody] GetHistoryInput input)
        {
            var history = _gameService
                .Read(input.GameId)
                .Players
                .Single(p => p.Id == input.PlayerId)
                .History;

            return new JsonResult(history);
        }

        private int GetRoundNumber(string gameId)
        {
            var game = _gameService.Read(gameId);
            
            return game.GameTimer?.GetRoundNumber() 
                ?? game.RoundNumber;
        }
    }
}
