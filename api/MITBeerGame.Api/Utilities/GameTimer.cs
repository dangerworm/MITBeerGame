namespace MITBeerGame.Api.Services
{
    public class GameTimer
    {
        private readonly TimeSpan _roundLength;

        private readonly DateTime _startTime;

        public GameTimer(int roundLengthSeconds)
        {
            _roundLength = TimeSpan.FromSeconds(roundLengthSeconds);
            
            _startTime = DateTime.UtcNow;
        }

        public int GetRoundNumber()
        {
            var duration = DateTime.UtcNow - _startTime;

            return (int)Math.Floor(duration / _roundLength);
        }

        public TimeSpan GetTimeRemaining()
        {
            var roundEnd = _startTime + ((GetRoundNumber() + 1) * _roundLength);

            return roundEnd - DateTime.UtcNow;
        }
    }
}
