
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

##Websocket client commands

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
```

##Websocket client events

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

```

