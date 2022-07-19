using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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

        private readonly IGameStore _gameStore;
        private readonly ITeamStore _teamStore;

        public GameSetupController(IHubContext<GameSetupHub, IGameSetupClient> gameSetupHub, IGameStore gameStore, ITeamStore teamStore)
        {
            _gameSetupHub = gameSetupHub;

            _gameStore = gameStore;
            _teamStore = teamStore;
        }

        [HttpGet("GetGames")]
        public async Task<IActionResult> GetGames()
        {
            var games = _gameStore.ReadAll();

            await _gameSetupHub.Clients.All.UpdateGames(games);

            return new JsonResult(games);
        }

        [HttpPost("CreateGame")]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameInput input)
        {
            var game = _gameStore.Create(input.GameName);

            var games = _gameStore.ReadAll();
            await _gameSetupHub.Clients.All.UpdateGames(games);

            return new JsonResult(game);
        }

        [HttpGet("GetTeams")]
        public async Task<IActionResult> GetTeams()
        {
            var teams = _teamStore.ReadAll();

            await _gameSetupHub.Clients.All.UpdateTeams(teams);

            return new JsonResult(teams);
        }

        [HttpPost("CreateTeam")]
        public async Task<IActionResult> CreateTeam([FromBody] CreateTeamInput input)
        {
            var game = _gameStore.Read(input.GameId);
            if (_teamStore.TeamExists(input.TeamName, game.TeamIds))
            {
                return new JsonResult(new { Error = $"That team already exists in game {game.Id}." });
            }

            var team = _teamStore.Create(input.GameId, input.TeamName);
            _gameStore.AddTeam(input.GameId, team.Id);

            var teams = _teamStore.ReadAll();
            await _gameSetupHub.Clients.All.UpdateTeams(teams);

            return new JsonResult(team);
        }

        [HttpPost("CreatePlayer")]
        public async Task<IActionResult> CreatePlayer([FromBody] CreatePlayerInput input)
        {
            var team = _teamStore.Read(input.TeamId);
            if (_teamStore.RoleFilled(input.PlayerRole, input.TeamId))
            {
                return new JsonResult(new { Error = $"There is already a player in that role for {team.Name}." });
            }

            var player = new Player(input.PlayerName, Helpers.GetRoleType(input.PlayerRole));
            _teamStore.CreatePlayer(input.TeamId, player);

            var teams = _teamStore.ReadAll();
            await _gameSetupHub.Clients.All.UpdateTeams(teams);

            return new JsonResult(team);
        }

        [HttpPost("DeletePlayer")]
        public async Task<IActionResult> DeletePlayer([FromBody] DeletePlayerInput input)
        {
            _teamStore.DeletePlayer(input.TeamId, input.PlayerId);

            var teams = _teamStore.ReadAll();
            await _gameSetupHub.Clients.All.UpdateTeams(teams);

            return new JsonResult(input.PlayerId);
        }
    }
}
