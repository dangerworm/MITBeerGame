namespace MITBeerGame.Api.Models
{
    public class GetEventsInput
    {
        public string GameId { get; set; }
        public string TeamId { get; set; }
        public string PlayerId { get; set; }
    }
}
