using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.HubClients;
using MITBeerGame.Api.Hubs;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Services;

public class GameTimeWorker : BackgroundService
{
    private readonly IHubContext<GameplayHub, IGameplayClient> _gameplayHub;
    private readonly IGameService _gameService;

    private readonly Dictionary<string, int> _gameRounds;

    public GameTimeWorker(IHubContext<GameplayHub, IGameplayClient> gameplayHub, IGameService gameService)
    {
        _gameplayHub = gameplayHub;
        _gameService = gameService;

        _gameRounds = new Dictionary<string, int>();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var games = _gameService.ReadAll().ToList();
            
            var gameTimes = new List<GameTime>();
            foreach (var game in games)
            {
                var lastRoundNumber = 0;
                var roundNumber = game.GameTimer?.GetRoundNumber() ?? 0;
                var timeRemaining = game.GameTimer?.GetTimeRemaining() ?? TimeSpan.Zero;
                
                
                if (!_gameRounds.TryAdd(game.Id, roundNumber))
                {
                    lastRoundNumber = _gameRounds[game.Id];
                    _gameRounds[game.Id] = roundNumber;
                }

                if (roundNumber > lastRoundNumber)
                {
                    game.StartNextRound();
                    await _gameplayHub.Clients.All.UpdateHistory(_gameService.ReadPlayerHistories());
                }

                gameTimes.Add(new GameTime
                {
                    GameId = game.Id,
                    RoundNumber = roundNumber,
                    TimeRemaining = timeRemaining
                });
                
            }
            
            await _gameplayHub.Clients.All.UpdateGameTimes(gameTimes);
            
            await Task.Delay(1000, stoppingToken);
        }
    }
}