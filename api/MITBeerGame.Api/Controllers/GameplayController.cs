using Microsoft.AspNetCore.Mvc;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameplayController
    {
        private readonly IGameService _gameService;
        private readonly IPlayerService _playerService;

        public GameplayController(
            IGameService gameService,
            IPlayerService playerService
        )
        {
            _gameService = gameService;
            _playerService = playerService;
        }

        [HttpPost("GetRoundNumber")]
        public IActionResult GetRoundNumber([FromBody] GetRoundNumberInput input)
        {
            return new JsonResult(GetRoundNumber(input.GameId));
        }

        [HttpPost("CreateOrder")]
        public IActionResult CreateOrder([FromBody] CreateOrderInput input)
        {
            _playerService.SetPlayerOrderAmount(input.PlayerId, input.OrderAmount);

            return new JsonResult(new { Success = true });
        }

        private int GetRoundNumber(string gameId)
        {
            var game = _gameService.Read(gameId);
            
            return game.GameTimer?.GetRoundNumber() 
                ?? game.RoundNumber;
        }
    }
}
