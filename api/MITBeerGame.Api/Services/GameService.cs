using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Models;

namespace MITBeerGame.Api.Services
{
    public class GameService : IGameService
    {
        private readonly IGameStore _gameStore;

        public GameService(IGameStore gameStore)
        {
            _gameStore = gameStore;
        }

        public Game Create(string gameName)
        {
            return _gameStore.Create(gameName);
        }

        public IEnumerable<Game> ReadAll()
        {
            return _gameStore.ReadAll();
        }

        public Game Read(string id)
        {
            return _gameStore.Read(id);
        }

        public void Delete(string id)
        {
            _gameStore.Delete(id);
        }

        public bool IsRoleFilled(string gameId, RoleType roleType)
        {
            return Read(gameId).Players.Any(p => p.RoleType == roleType);
        }

        public (Game game, bool beginGame) StartGame(string gameId, string playerId, int roundLengthSeconds)
        {
            _gameStore.SetPlayerReady(playerId);

            var game = _gameStore.Read(gameId);

            var allPlayersReady = game.Players.All(p => p.IsReady);
            if (allPlayersReady)
            {
                _gameStore.StartGame(gameId, roundLengthSeconds);
            }

            return (game, allPlayersReady);
        }

        public void AddEvent(GameEvent gameEvent)
        {
            _gameStore.AddEvent(gameEvent);
        }

        public void StartNextRound(string gameId)
        {
            var game = _gameStore.Read(gameId);
            var gameEvents = game.Events;

            var newRoundNumber = game.RoundNumber + 1;
            var inTransit = new Dictionary<int, int>();

            var newPlayerStates = new List<PlayerState>();

            foreach (RoleType roleType in Enum.GetValues(typeof(RoleType)))
            {
                var player = game.Players.Single(p => p.RoleType == roleType);

                if (game.RoundNumber == 0)
                {
                    for (var week = 0; week <= game.DeliveryTimeWeeks; week++)
                    {
                        inTransit.Add(week, game.InitialInOut);
                    }

                    newPlayerStates.Add(new PlayerState(newRoundNumber, roleType, game.InitialStock, game.InitialInOut, 0, inTransit));
                    continue;
                }

                var playerEvent = gameEvents.Last(p => p.Player != null && p.Player.Id == player.Id);
                var playerLastState = player.History.Last();
                
                var dependentPlayer = game.Players.Single(p => p.RoleType == player.RoleType - 1);
                var dependentPlayerEvent = gameEvents.Last(p => p.Player != null && p.Player.Id == dependentPlayer.Id);
                var dependentLastState = dependentPlayer.History.Last();

                int stockOut;
                int onBackOrder;
                if (playerLastState.StockLevel >= dependentPlayerEvent.OrderAmount)
                {
                    stockOut = dependentPlayerEvent.OrderAmount;
                    onBackOrder = 0;
                }
                else
                {
                    stockOut = playerLastState.StockLevel;
                    onBackOrder = dependentPlayerEvent.OrderAmount - playerLastState.StockLevel;
                }

                for (var week = 0; week < game.DeliveryTimeWeeks; week++)
                {
                    inTransit.Add(week, playerLastState.InTransit[week + 1]);
                }

                if (roleType == RoleType.Brewer)
                {
                    inTransit.Add(game.DeliveryTimeWeeks, playerEvent.OrderAmount);
                }
                else
                {
                    var dependentNewState = newPlayerStates.Single(ps => ps.RoleType == roleType - 1);
                    inTransit.Add(game.DeliveryTimeWeeks, dependentNewState.TotalOut);
                }

                newPlayerStates.Add(new PlayerState(
                    newRoundNumber,
                    roleType,
                    playerLastState.StockLevel - stockOut,
                    stockOut,
                    onBackOrder,
                    inTransit
                ));
            }
        }
    }
}
