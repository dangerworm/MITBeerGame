using Microsoft.AspNetCore.SignalR;
using MITBeerGame.Api.HubClients;

namespace MITBeerGame.Api.Hubs
{
    public class GameSetupHub : Hub<IGameSetupClient>
    {
    }
}
