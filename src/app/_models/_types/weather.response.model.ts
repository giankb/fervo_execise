import {WeatherDailyUnits} from './daily.units.model';
import {WeatherDaily} from './daily.model';

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: WeatherDailyUnits;
  daily: WeatherDaily;
}
