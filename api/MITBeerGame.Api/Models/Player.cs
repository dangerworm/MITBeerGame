﻿using MITBeerGame.Api.Enums;

namespace MITBeerGame.Api.Models
{
    public class Player
    {
        public Player(string gameId, string name, RoleType roleType, int initialInOut)
        {
            Id = Guid.NewGuid().ToString()[..6];
            GameId = gameId;
            PlayerName = name;
            RoleType = roleType;
            IsReady = false;
            History = new List<PlayerState>();
            NextOrder = initialInOut;
        }

        public string Id { get; }
        
        public string GameId { get; }

        public string PlayerName { get; }
        
        public RoleType RoleType { get; }

        public bool IsReady { get; set; }

        public List<PlayerState> History { get; }
        
        public int NextOrder { get; set;  }

        public string Role => RoleType.GetRole();
    }
}
