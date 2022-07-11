using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.Hubs;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;
using MITBeerGame.Api.Stores;
using System.Linq;

namespace MITBeerGame.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameController : ControllerBase
    {
        private readonly IHubContext<GameHub, IGameClient> _gameHub;

        private readonly IGameStore _gameStore;
        private readonly ITeamStore _teamStore;

        public GameController(IHubContext<GameHub, IGameClient> gameHub, IGameStore gameStore, ITeamStore teamStore)
        {
            _gameHub = gameHub;

            _gameStore = gameStore;
            _teamStore = teamStore;
        }

        [HttpGet("GetGames")]
        public async Task<IActionResult> GetGames()
        {
            var games = _gameStore.ReadAll();

            return new JsonResult(games);
        }

        [HttpPost("CreateGame")]
        public async Task<IActionResult> CreateGame(GameInput gameInput)
        {
            var game = _gameStore.Create(gameInput.GameName);

            var games = _gameStore.ReadAll();
            await _gameHub.Clients.All.UpdateGames(games);

            return new JsonResult(game);
        }

        [HttpGet("GetTeams")]
        public async Task<IActionResult> GetTeams(string gameId)
        {
            var game = _gameStore.Read(gameId);
            var teams = _teamStore.Read(game.TeamIds);

            return new JsonResult(teams);
        }

        [HttpPost("CreateTeam")]
        public async Task<IActionResult> CreateTeam(string gameId, string teamName)
        {
            var game = _gameStore.Read(gameId);
            if (_teamStore.TeamExists(teamName, game.TeamIds))
            {
                return new JsonResult(new { Error = $"That team already exists in game {game.Id}." });
            }

            var team = _teamStore.Create(teamName);
            _gameStore.AddTeam(gameId, team.Id);

            var teams = _teamStore.Read(game.TeamIds.Union(new[] { team.Id }));

            await _gameHub.Clients.All.UpdateTeams(teams);

            return new JsonResult(team);
        }

        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRoles(string teamId)
        {
            var team = _teamStore.Read(teamId);
            var roles = team.Roles;

            return new JsonResult(roles);
        }

        [HttpPost("AddPlayer")]
        public async Task<IActionResult> AddPlayer(string teamId, string playerName, string playerRole)
        {
            var team = _teamStore.Read(teamId);
            if (_teamStore.RoleFilled(playerRole, teamId))
            {
                return new JsonResult(new { Error = $"There is already a player in that role for team {team.Name}." });
            }

            var player = new Role(playerName, Helpers.GetRoleType(playerRole));
            _teamStore.AddPlayer(teamId, player);
            
            team = _teamStore.Read(teamId);

            await _gameHub.Clients.All.UpdateTeam(team);

            return new JsonResult(team);
        }
    }
}
