using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.Hubs;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameplayController
    {
        private readonly IHubContext<GameHub, IGameClient> _gameHub;

        private readonly IGameStore _gameStore;
        private readonly ITeamStore _teamStore;
        private readonly IGameEventStore _gameEventStore;

        public GameplayController(IHubContext<GameHub, IGameClient> gameHub, IGameStore gameStore, ITeamStore teamStore, IGameEventStore gameEventStore)
        {
            _gameHub = gameHub;

            _gameStore = gameStore;
            _teamStore = teamStore;
            _gameEventStore = gameEventStore;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string gameId)
        {
            var game = _gameStore.Read(gameId);

            return new JsonResult(game);
        }


        [HttpGet("GetEvents")]
        public async Task<IActionResult> GetEvents()
        {
            var teams = _gameEventStore.ReadAll();

            return new JsonResult(teams);
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

            var gameEvent = new GameEvent(input.GameId, input.TeamId, player, input.OrderAmount);
            _gameEventStore.Create(gameEvent);

            var gameEvents = _gameEventStore.ReadAll();
            await _gameHub.Clients.All.UpdateEvents(gameEvents);

            return new JsonResult(gameEvent);
        }
    }
}
