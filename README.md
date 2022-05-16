
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Websocket client commands

```
# get token
socket.emit('register');

# change username
socket.emit('rename', newName);

# create new room
socket.emit('createRoom', name: string);

# join existing room
socket.emit('joinRoom', roomId, password);
socket.emit('joinRoom', roomId);

# leave room
socket.emit('leaveRoom', roomId);

# get room list
socket.emit('getRooms');

# start a game
socket.emit('create');

# get game object of current game
socket.emit('getGameInfo');

# get player object of yourself
socket.emit('getPlayerInfo');
```

## Websocket client events

```
# token registered
socket.on('registered', (token: string) => {});

# username changed
socket.on('UserUpdated', () => {});

# room list updated
socket.on('updateRooms', (rooms: Room[]) => {});

Room {
  id: number;
  name: string;
  usersCount: number;
  limit: number;
}

# room list info
socket.on('Rooms', (rooms: Room[]) => {});

# game started
socket.on('gameStarted', () => {});

# game information
socket.on('gameInfo', (game: Game) => {});

Game {
  players: Player[];
  queue: CharacterQueue[];
  state: GameState;
  chosenNavigationCount: number;
  currentCharacterIndex: number;
  seagulls: number;
}

CharacterQueue {
  gameId: number;
  characterName: string;
  order: number;
}
GameState {
    Supplies = 1,
    Regular = 2,
    Dispute = 3,
    Fight = 4,
    Picking = 5
}

# player information
socket.on('playerInfo', (player: Player) => {});

#self
Player {
  id: number;
  character: Character;
  friendship: Character;
  enemy: Character;
  closedCards: Supply[];
  openCards: Supply[];
  damage: number;
  rowed: boolean;
  fought: boolean;
  thirst: boolean;
}
#other
Player {
  id: number;
  character: Character;
  closedAmount: number;
  openCards: Supply[];
  damage: number;
  rowed: boolean;
  fought: boolean;
  thirst: boolean;
}

Character {
  name: string;
  strengh: number;
  survival: number;
  description: string;
  defaultOrder: number;
}

Supply {
  name: string;
  strength: number | null;
  bonus: number | null;
  description: string;
  amount: number;
}
# supplies to pick one from
socket.on('toChoose', (supplies: Supply[]) => {});
```

