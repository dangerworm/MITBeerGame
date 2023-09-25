using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.HubClients;
using MITBeerGame.Api.Hubs;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Services;

public class GameTimeWorker : BackgroundService
{
    private IHubContext<GameplayHub, IGameplayClient> _gameplayHub;
    private readonly IGameService _gameService;

    public GameTimeWorker(IHubContext<GameplayHub, IGameplayClient> gameplayHub, IGameService gameService)
    {
        _gameplayHub = gameplayHub;
        _gameService = gameService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var games = _gameService.ReadAll().ToList();

            await _gameplayHub.Clients.All.UpdateGameTimes(games.Select(g => new GameTime
            {
                GameId = g.Id, 
                RoundNumber = g.GameTimer?.GetRoundNumber() ?? 0,
                TimeRemaining = g.GameTimer?.GetTimeRemaining() ?? TimeSpan.Zero
            }));
            
            await Task.Delay(1000, stoppingToken);
        }
    }
}