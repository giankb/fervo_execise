import {GeocodingResult} from './geocodingResults';

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}
