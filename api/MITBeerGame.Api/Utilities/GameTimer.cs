namespace MITBeerGame.Api.Utilities
{
    public class GameTimer
    {
        private readonly TimeSpan _roundLength;

        private readonly DateTime _startTime;

        public GameTimer(int roundLengthSeconds, DateTime? startTime = null)
        {
            _roundLength = TimeSpan.FromSeconds(roundLengthSeconds);
            
            _startTime = startTime ?? DateTime.UtcNow;
        }

        public int GetRoundNumber()
        {
            var duration = DateTime.UtcNow - _startTime;

            var roundNumber = (int)Math.Floor(duration / _roundLength); 
            return roundNumber + 1;
        }

        public TimeSpan GetTimeRemaining()
        {
            var roundEnd = _startTime + (GetRoundNumber() * _roundLength);

            return roundEnd - DateTime.UtcNow;
        }
    }
}
