export const Connected = 'Connected';

export const HostName = 'https://localhost:7046/';

export const CreateNewGame = 'CreateNewGame';
export const CreateNewPlayer = 'CreateNewPlayer';

export const ReceiveMessage = 'ReceiveMessage';
export const SendMessage = 'SendMessage';

export const UpdateGames = 'UpdateGames';
export const UpdateTeams = 'UpdateTeams';

export const UpdateRoundNumber = 'UpdateRoundNumber';
export const UpdateEvents = 'UpdateEvents';

export const GetHeaders = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

export const PostHeaders = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};
