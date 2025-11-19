import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';
import { RestCountriesProvider } from './providers/restcountries.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    HttpModule,
  ],
  controllers: [CountriesController],
  providers: [
    CountriesService,
    {
      provide: 'ExternalCountryService',
      useClass: RestCountriesProvider,
    },
  ],
  exports: [CountriesService], // lo usa TravelPlansService
})
export class CountriesModule {}
