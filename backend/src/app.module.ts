import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import {
  Event,
  Category,
  Participant,
  EventNotification,
  RecurrenceRule,
} from './entities';

// Services
import { EventsService } from './services/events.service';
import { CategoriesService } from './services/categories.service';
import { ParticipantsService } from './services/participants.service';

// Controllers
import { EventsController } from './controllers/events.controller';
import { CategoriesController } from './controllers/categories.controller';
import { ParticipantsController } from './controllers/participants.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'schedular',
      entities: [Event, Category, Participant, EventNotification, RecurrenceRule],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in development
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([
      Event,
      Category,
      Participant,
      EventNotification,
      RecurrenceRule,
    ]),
  ],
  controllers: [
    AppController,
    EventsController,
    CategoriesController,
    ParticipantsController,
  ],
  providers: [
    AppService,
    EventsService,
    CategoriesService,
    ParticipantsService,
  ],
})
export class AppModule {}
