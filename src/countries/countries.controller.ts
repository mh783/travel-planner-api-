import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DeleteCountryGuard } from './guards/delete-country.guard';
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
  @UseGuards(DeleteCountryGuard)
@Delete(':code')
remove(@Param('code') code: string) {
  return this.service.remove(code);
}

}
