import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ExternalCountryService } from '../interfaces/external-country.service';

@Injectable()
export class RestCountriesProvider implements ExternalCountryService {
  constructor(private http: HttpService) {}

  async getCountry(code: string): Promise<any> {
    const url = `https://restcountries.com/v3.1/alpha/${code}`;
    const res = await firstValueFrom(this.http.get(url));
    const c = res.data[0];

    return {
      code: c.cca3,
      name: c.name.common,
      region: c.region,
      subregion: c.subregion,
      capital: c.capital ? c.capital[0] : 'N/A',
      population: c.population,
      flag: c.flags?.png || '',
    };
  }
}
