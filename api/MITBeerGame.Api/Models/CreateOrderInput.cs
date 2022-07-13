namespace MITBeerGame.Api.Models
{
    public class CreateOrderInput
    {
        public string GameId { get; set; }
        public string TeamId { get; set; }
        public string PlayerId { get; set; }
        public int OrderAmount { get; set; }
    }
}
