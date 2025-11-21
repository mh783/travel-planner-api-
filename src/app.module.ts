import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from './countries/countries.module';
import { TravelPlansModule } from './travel-plans/travel-plans.module';
import { LoggingMiddleware } from './common/logging.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'travel.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CountriesModule,
    TravelPlansModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes(
        // countries
        { path: 'countries', method: RequestMethod.ALL },
        { path: 'countries/:code', method: RequestMethod.ALL },
        // travel plans (en tu app es 'plans')
        { path: 'plans', method: RequestMethod.ALL },
        { path: 'plans/:id', method: RequestMethod.ALL },
      );
  }
}
