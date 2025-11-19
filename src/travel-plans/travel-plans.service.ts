import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TravelPlan } from './entities/travel-plan.entity';
import { CountriesService } from '../countries/countries.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';

@Injectable()
export class TravelPlansService {
  constructor(
    @InjectRepository(TravelPlan)
    private repo: Repository<TravelPlan>,
    private countriesService: CountriesService,
  ) {}

  async create(dto: CreateTravelPlanDto) {
    await this.countriesService.findOne(dto.countryCode); // asegura país en caché

    const plan = this.repo.create(dto);
    return this.repo.save(plan);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
