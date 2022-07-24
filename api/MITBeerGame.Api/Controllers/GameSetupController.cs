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
    public class GameSetupController : ControllerBase
    {
        private readonly IHubContext<GameSetupHub, IGameSetupClient> _gameSetupHub;

        private readonly IGameService _gameService;
        private readonly IPlayerService _playerService;

        public GameSetupController(IHubContext<GameSetupHub, IGameSetupClient> gameSetupHub, IGameService gameService, IPlayerService playerService)
        {
            _gameSetupHub = gameSetupHub;
            _gameService = gameService;
            _playerService = playerService;
        }

        [HttpGet("GetGames")]
        public async Task<IActionResult> GetGames()
        {
            var games = _gameService.ReadAll();

            await _gameSetupHub.Clients.All.UpdateGames(games);

            return new JsonResult(games);
        }

        [HttpPost("CreateGame")]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameInput input)
        {
            var game = _gameService .Create(input.GameName);

            var games = _gameService .ReadAll();
            await _gameSetupHub.Clients.All.UpdateGames(games);

            return new JsonResult(game);
        }

        [HttpPost("CreatePlayer")]
        public async Task<IActionResult> CreatePlayer([FromBody] CreatePlayerInput input)
        {
            var team = _gameService .Read(input.GameId);
            var roleType = Helpers.GetRoleType(input.PlayerRole);
            if (_gameService.IsRoleFilled(input.GameId, roleType))
            {
                return new JsonResult(new { Error = $"There is already a player in that role for {team.Name}" });
            }

            var player = new Player(input.GameId, input.PlayerName, roleType);
            _playerService.Create(player);

            var games = _gameService.ReadAll();
            await _gameSetupHub.Clients.All.UpdateGames(games);

            return new JsonResult(team);
        }

        [HttpPost("DeletePlayer")]
        public async Task<IActionResult> DeletePlayer([FromBody] DeletePlayerInput input)
        {
            _playerService.Delete(input.PlayerId);

            var games = _gameService.ReadAll();
            await _gameSetupHub.Clients.All.UpdateGames(games);

            return new JsonResult(input.PlayerId);
        }
    }
}
