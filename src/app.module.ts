import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from './countries/countries.module';
import { TravelPlansModule } from './travel-plans/travel-plans.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'travel.db',
      autoLoadEntities: true, // carga todas las entidades *.entity.ts
      synchronize: true,
    }),
    CountriesModule,
    TravelPlansModule,
  ],
})
export class AppModule {}
