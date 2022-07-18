namespace MITBeerGame.Api.Models
{
    public class StartGameInput
    {
        public string GameId { get; set; }
        public int RoundLengthSeconds { get; set; } = 60; 
    }
}