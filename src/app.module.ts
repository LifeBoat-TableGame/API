import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatController } from './chat/chat.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { CardsModule } from './cards/cards.module';
import { MenuGateway } from './menu/menu.gateway';
import { LobbyModule } from './lobby/lobby.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TableModule } from './table/table.module';
import { TableGateway } from './table/table.gateway';
import { MenuModule } from './menu/menu.module';
import { AppController } from './app.controller';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    AuthenticationModule,
    CardsModule,
    LobbyModule,
    TableModule,
    GameModule,
    UserModule,
    MenuModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client/dist')
    }),
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    GameModule,
  ],
  controllers: [ChatController, AppController],
  providers: [AppService, ChatGateway, MenuGateway, TableGateway],
})
export class AppModule {}
