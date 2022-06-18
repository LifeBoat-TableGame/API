
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
'register';

# change username
'rename', newName: string

# create new room
'createRoom', name: string

# join existing room
'joinRoom', roomId: number

# leave room
'leaveRoom', roomId: number;

# get room list
'getRooms';

# start a game
'create';

# get game object of current game
'getGameInfo';

# get player object of yourself
'getPlayerInfo';
```

## Websocket client events

```
# token registered
'registered', token: string;

# username changed
'UserUpdated';

# room list updated
'updateRooms', rooms: Room[];
# room list info
'Rooms', rooms: Room[];
Room {
  id: number;
  name: string;
  usersCount: number;
  limit: number;
}

# game started
'gameStarted';

# game information
'gameInfo', game: Game;
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
'playerInfo', player: Player;
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
'toChoose', supplies: Supply[];
```

