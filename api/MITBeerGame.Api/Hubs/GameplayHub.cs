using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Hubs
{
    public class GameplayHub : Hub<IGameplayClient>
    {
        private readonly IHubContext<GameSetupHub, IGameSetupClient> _gameSetupHub;
        private readonly IHubContext<GameplayHub, IGameplayClient> _gameplayHub;
        private readonly IGameStore _gameStore;
        private readonly ITeamStore _teamStore;

        private readonly Player _market;

        public GameplayHub(
            IHubContext<GameSetupHub, IGameSetupClient> gameSetupHub,
            IHubContext<GameplayHub, IGameplayClient> gameplayHub,
            IGameStore gameStore,
            ITeamStore teamStore
        )
        {
            _gameSetupHub = gameSetupHub;
            _gameplayHub = gameplayHub;
            _gameStore = gameStore;
            _teamStore = teamStore;

            _market = new Player("Market", Enums.RoleType.Market);
        }

        public async Task StartGame(string gameId, string playerId, int roundLengthSeconds = 30)
        {
            var (game, gameAlreadyStarted) = _gameStore.StartGame(gameId, playerId, roundLengthSeconds);

            if (!gameAlreadyStarted)
            {
                BeginGame(game);
            }
            
            var games = _gameStore.ReadAll();

            await _gameSetupHub.Clients.All.UpdateGames(games);
            await _gameplayHub.Clients.All.UpdateEvents(games.SelectMany(g => g.GameEvents));
        }

        private void BeginGame(Game game)
        {
            var teams = _teamStore.Read(game.TeamIds);

            foreach (var team in teams)
            {
                game.GameEvents.Add(new GameEvent(game.Id, team.Id, _market, 1, 4));

                foreach (var player in team.Players)
                {
                    game.GameEvents.Add(new GameEvent(game.Id, team.Id, player, 1, 4));
                }
            }
        }
    }
}
