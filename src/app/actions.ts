
'use server';

import { stationData } from '@/lib/station-data';

export interface Station {
  id: string; // Primary station code, used as unique key
  mrt_station_english: string;
  mrt_station_pinyin: string;
  mrt_station_chinese: string;
  mrt_station_codes: string[]; // All codes for this station (for interchanges)
  abbreviation?: string; // 3-letter code
}

export async function getStations(): Promise<Station[]> {
  try {
    // Map the local station data to the Station interface
    const stations: Station[] = stationData.map(s => ({
      id: s.stn_code, // Use station code as a unique ID
      mrt_station_english: s.mrt_station_english,
      mrt_station_pinyin: s.mrt_station_pinyin,
      mrt_station_chinese: s.mrt_station_chinese,
      // Initially, the codes array just has the one code
      mrt_station_codes: [s.stn_code],
      abbreviation: s.abbreviation,
    }));

    return stations;
  } catch (error) {
    console.error('Error reading station data:', error);
    // In case of error, return an empty array to prevent app crash
    return [];
  }
}
