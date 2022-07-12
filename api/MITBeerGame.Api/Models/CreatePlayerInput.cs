namespace MITBeerGame.Api.Models
{
    public class CreatePlayerInput
    {
        public string PlayerName { get; set; }
        public string PlayerRole { get; set; }
        public string TeamId { get; set; }
    }
}
