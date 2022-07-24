namespace MITBeerGame.Api.Models
{
    public class CreateOrderInput
    {
        public string PlayerId { get; set; }
        public int OrderAmount { get; set; }
    }
}
