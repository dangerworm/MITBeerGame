using MITBeerGame.Api;
using MITBeerGame.Api.Hubs;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Stores;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy(Constants.CorsPolicy, policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:3000")
            .AllowCredentials();
    });
});

builder.Services.AddSingleton<IGameStore, GameStore>();
builder.Services.AddSingleton<ITeamStore, TeamStore>();

var app = builder.Build();

app.UseAuthorization();
app.UseHttpsRedirection();
app.UseCors(Constants.CorsPolicy);
app.UseRouting();

app.MapHub<GameHub>("/playerHub");

app.Run();
