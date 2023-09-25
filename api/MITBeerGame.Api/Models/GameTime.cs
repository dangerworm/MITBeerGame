namespace MITBeerGame.Api.Models;

public class GameTime
{
    public string GameId { get; set; }
    public int RoundNumber { get; set; }
    public TimeSpan TimeRemaining { get; set; }

    public string TimeRemainingString => TimeRemaining.ToString(@"mm\:ss");
}