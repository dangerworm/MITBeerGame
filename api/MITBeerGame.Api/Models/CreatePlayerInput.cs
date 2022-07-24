namespace MITBeerGame.Api.Models
{
    public class CreatePlayerInput
    {
        public string GameId{ get; set; }
        public string PlayerName { get; set; }
        public string PlayerRole { get; set; }
    }
}
