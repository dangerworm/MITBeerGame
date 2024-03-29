using MITBeerGame.Api;
using MITBeerGame.Api.Hubs;
using MITBeerGame.Api.Interfaces;
using MITBeerGame.Api.Services;
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

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IGameStore, GameStore>();
builder.Services.AddSingleton<IGameService, GameService>();
builder.Services.AddSingleton<IPlayerService, PlayerService>();

builder.Services.AddHostedService<GameTimeWorker>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.UseHttpsRedirection();
app.UseCors(Constants.CorsPolicy);
app.MapControllers();
app.UseRouting();

app.MapHub<GameSetupHub>("/gameSetupHub");
app.MapHub<GameplayHub>("/gameplayHub");

app.Run();
