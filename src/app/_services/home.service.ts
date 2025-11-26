import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment/environment';
import {CONSTANTS} from '../../environment/constants';
import {Observable} from 'rxjs';
import {GeocodingResponse} from '../_models/_types/geocodingResponse';
import {WeatherResponse} from '../_models/_types/weather.response.model';

@Injectable({
  providedIn: "root"
})
export class HomeService {

  constructor(private http: HttpClient) {
  }

  getPosition(address: string): Observable<GeocodingResponse>{
    const url = environment.apiHostGeocoding + CONSTANTS.geoCodingSearch + '?name=' + address;
    return this.http.get<GeocodingResponse>(url);
  }

  getWeather(lat: number, long: number, startDate?: string, endDate?: string ): Observable<WeatherResponse>{
    if (!startDate || !endDate) {
      ({ startDate, endDate } = this.getDateRangeOneWeek());
    }
    const url = `${environment.apiHostWeather}${CONSTANTS.weatherArchive}?latitude=${lat}&longitude=${long}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=Europe/Rome`;
    return this.http.get<WeatherResponse>(url);
  }

  getDateRangeOneWeek(): { startDate: string, endDate: string } {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    const startDateObj = new Date();
    startDateObj.setDate(today.getDate() - 7);
    const start = startDateObj.toISOString().split('T')[0];

    return { startDate: start, endDate: end };
  }

}
