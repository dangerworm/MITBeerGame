using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.Hubs;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Stores;

namespace MITBeerGame.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlayController
    {
        private readonly IHubContext<GameHub, IGameClient> _gameHub;

        private readonly IGameStore _gameStore;
        private readonly ITeamStore _teamStore;

        public PlayController(IHubContext<GameHub, IGameClient> gameHub, IGameStore gameStore, ITeamStore teamStore)
        {
            _gameHub = gameHub;

            _gameStore = gameStore;
            _teamStore = teamStore;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string gameId)
        {
            var game = _gameStore.Read(gameId);

            return new JsonResult(game);
        }
    }
}
