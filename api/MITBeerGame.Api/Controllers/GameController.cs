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
        public async Task<IActionResult> CreateGame([FromBody] CreateGameInput input)
        {
            var game = _gameStore.Create(input.GameName);

            var games = _gameStore.ReadAll();
            await _gameHub.Clients.All.UpdateGames(games);

            return new JsonResult(game);
        }

        [HttpGet("GetTeams/{gameId}")]
        public async Task<IActionResult> GetTeams([FromRoute] string gameId)
        {
            var game = _gameStore.Read(gameId);
            var teams = _teamStore.Read(game.TeamIds);

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

            var team = _teamStore.Create(input.TeamName);
            _gameStore.AddTeam(input.GameId, team.Id);

            var teams = _teamStore.Read(game.TeamIds.Union(new[] { team.Id }));

            await _gameHub.Clients.All.UpdateTeams(teams);

            return new JsonResult(team);
        }

        [HttpGet("GetPlayers/{teamId}")]
        public async Task<IActionResult> GetPlayers([FromRoute] string teamId)
        {
            var team = _teamStore.Read(teamId);
            var roles = team.Players;

            return new JsonResult(roles);
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
            _teamStore.AddPlayer(input.TeamId, player);
            
            team = _teamStore.Read(input.TeamId);

            await _gameHub.Clients.All.UpdatePlayers(team);

            return new JsonResult(team);
        }
    }
}
