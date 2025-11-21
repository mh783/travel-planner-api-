import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelPlan } from '../travel-plans/entities/travel-plan.entity';
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { Country } from './entities/country.entity';
import type { ExternalCountryService } from './interfaces/external-country.service';
@Injectable()
export class CountriesService {
  constructor(
    @Inject('ExternalCountryService')
    private external: ExternalCountryService,
    @InjectRepository(Country)
    private repo: Repository<Country>,
    @InjectRepository(TravelPlan)
    private plansRepo: Repository<TravelPlan>,
  ) {}

  async findAll() {
    return this.repo.find();
  }

  async findOne(code: string) {
    code = code.toUpperCase();

    const cached = await this.repo.findOne({ where: { code } });
    if (cached) {
      return { origin: 'cache', data: cached };
    }

    const country = await this.external.getCountry(code);
    await this.repo.save(country);

    return { origin: 'external', data: country };
  }
  async remove(code: string) {
  code = code.toUpperCase();

  const country = await this.repo.findOne({ where: { code } });

  if (!country) {
    throw new NotFoundException(`Country ${code} not found in cache`);
  }

  const plansCount = await this.plansRepo.count({
    where: { countryCode: code },
  });

  if (plansCount > 0) {
    throw new BadRequestException(
      `Cannot delete country ${code} because there are ${plansCount} travel plans associated`,
    );
  }

  await this.repo.remove(country);

  return {
    deleted: true,
    code,
  };
}

}
