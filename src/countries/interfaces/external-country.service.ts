import type { Country } from '../entities/country.entity';

export interface ExternalCountryService {
  getCountry(code: string): Promise<Country>;
}
