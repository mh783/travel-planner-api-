import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Country } from './entities/country.entity';
import type { ExternalCountryService } from './interfaces/external-country.service';
@Injectable()
export class CountriesService {
  constructor(
    @Inject('ExternalCountryService')
    private external: ExternalCountryService,
    @InjectRepository(Country)
    private repo: Repository<Country>,
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
}
