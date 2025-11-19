import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private service: CountriesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.service.findOne(code);
  }
}
