using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.Interfaces;

namespace MITBeerGame.Api.Hubs
{
    public class GameHub : Hub<IGameClient>
    {
    }
}
