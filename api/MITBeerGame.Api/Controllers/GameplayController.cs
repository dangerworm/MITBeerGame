using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.Hubs;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;
using MITBeerGame.Api.Services;

namespace MITBeerGame.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameplayController
    {
        private readonly IHubContext<GameSetupHub, IGameSetupClient> _gameSetupHub;
        private readonly IHubContext<GameplayHub, IGameplayClient> _gameplayHub;

        private readonly IGameStore _gameStore;
        private readonly ITeamStore _teamStore;

        public GameplayController(IHubContext<GameSetupHub, IGameSetupClient> gameSetupHub, IHubContext<GameplayHub, IGameplayClient> gameplayHub, IGameStore gameStore, ITeamStore teamStore)
        {
            _gameSetupHub = gameSetupHub;
            _gameplayHub = gameplayHub;

            _gameStore = gameStore;
            _teamStore = teamStore;
        }

        [HttpPost("GetRoundNumber")]
        public async Task<IActionResult> GetRoundNumber([FromBody] GetRoundNumberInput input)
        {
            return new JsonResult(GetRoundNumber(input.GameId));
        }

        [HttpGet("GetEvents")]
        public async Task<IActionResult> GetEvents([FromBody] GetEventsInput input)
        {
            var gameEvents = _gameStore
                .Read(input.GameId)
                .GameEvents
                .Where(ge => ge.TeamId == input.TeamId && ge.Player.Id == input.PlayerId);

            return new JsonResult(gameEvents);
        }

        [HttpPost("CreateOrder")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderInput input)
        {
            // TODO: Validate that the order is expected at this time and
            // won't cause two orders to be created in the same round

            var player = _teamStore
                .Read(input.TeamId)
                .Players
                .First(p => p.Id == input.PlayerId);

            var gameEvent = new GameEvent(input.GameId, input.TeamId, player, GetRoundNumber(input.GameId), input.OrderAmount);
            _gameStore.AddEvent(gameEvent);

            var games = _gameStore.ReadAll();
            await _gameSetupHub.Clients.All.UpdateGames(games);
            await _gameplayHub.Clients.All.UpdateEvents(games.SelectMany(g => g.GameEvents));

            return new JsonResult(gameEvent);
        }

        private int GetRoundNumber(string gameId)
        {
            return _gameStore
             .Read(gameId)
             .GameTimer?
             .GetRoundNumber() ?? 1;
        }
    }
}
