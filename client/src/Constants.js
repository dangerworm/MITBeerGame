export const Connected = 'Connected';

export const HostName = 'https://localhost:7046/';

export const CreateNewGame = 'CreateNewGame';
export const CreateNewPlayer = 'CreateNewPlayer';

export const ReceiveMessage = 'ReceiveMessage';
export const SendMessage = 'SendMessage';

export const UpdateGames = 'UpdateGames';
export const UpdateTeams = 'UpdateTeams';

export const RoundLengthSeconds = 30;
export const StartGame = 'StartGame';
export const UpdateGameTimes = 'UpdateGameTimes';
export const UpdateHistory = 'UpdateHistory';
export const UpdateRoundNumber = 'UpdateRoundNumber';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export const GetHeaders = {
  method: 'GET',
  headers: headers
};

export const PostHeaders = {
  method: 'POST',
  headers: headers
};
