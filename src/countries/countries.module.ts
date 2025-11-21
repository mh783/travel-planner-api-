import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteCountryGuard } from './guards/delete-country.guard';
import { TravelPlan } from '../travel-plans/entities/travel-plan.entity';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';
import { RestCountriesProvider } from './providers/restcountries.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country,TravelPlan]),
    HttpModule,
  ],
  controllers: [CountriesController],
  providers: [
    CountriesService,DeleteCountryGuard,
    {
      provide: 'ExternalCountryService',
      useClass: RestCountriesProvider,
    },
  ],
  exports: [CountriesService], // lo usa TravelPlansService
})
export class CountriesModule {}
