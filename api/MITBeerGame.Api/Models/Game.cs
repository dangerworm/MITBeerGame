using MITBeerGame.Api.Enums;
using MITBeerGame.Api.Services;

namespace MITBeerGame.Api.Models
{
    public class Game
    {
        public Game(string name)
        {
            Id = Guid.NewGuid().ToString()[..6];
            Name = name;

            var market = new Player(Id, "Market", Enums.RoleType.Market);

            Players = new List<Player>
            {
                market
            };

            Events = new List<GameEvent>
            {
                new GameEvent(Id, 0, Helpers.ReadyAndWaiting(market.Id))
            };

            InitialStock = 12;
            
            InitialInOut = 4;

            DeliveryTimeWeeks = 2;
        }

        public string Id { get; }

        public string Name { get; }

        public List<Player> Players { get; }

        public List<GameEvent> Events { get; }

        public int InitialStock { get; }

        public int InitialInOut { get; }

        public int DeliveryTimeWeeks { get; }

        public bool IsStarted => GameTimer != null;

        public int RoundNumber { get; }

        public GameTimer? GameTimer { get; set; }

        public IEnumerable<string> PlayerNames => Players.Select(x => x.PlayerName);
    }
}
