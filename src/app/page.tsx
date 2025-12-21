
import { getStations, Station } from '@/app/actions';
import MrtChallengeGame from '@/components/mrt-challenge-game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Train, PlusCircle } from 'lucide-react';
import Link from 'next/link';

const processStations = (stations: Station[]): Station[] => {
  const stationMap = new Map<string, string[]>();

  // First, group all codes by their English name
  for (const station of stations) {
    const name = station.mrt_station_english;
    if (!stationMap.has(name)) {
      stationMap.set(name, []);
    }
    // Don't add duplicates
    if (!stationMap.get(name)!.includes(station.id)) {
        stationMap.get(name)!.push(station.id);
    }
  }
  
  // Now, create the final station list, adding the interchange codes to each entry
  const processed = stations.map(station => ({
    ...station,
    mrt_station_codes: stationMap.get(station.mrt_station_english) || [station.id],
  }));

  // Filter out any duplicates that arise from multiple entries for the same station (interchanges)
  const uniqueStations = Array.from(new Map(processed.map(s => [s.id, s])).values());
  
  return uniqueStations;
};

export default async function Home() {
  const rawStations = await getStations();
  const stations = processStations(rawStations);

  // The total number of unique stations needs to be calculated by unique English names
  const uniqueStationNames = new Set(stations.map(s => s.mrt_station_english));
  const totalStations = uniqueStationNames.size;

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl">
        <header className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <Train className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
              MRT Challenge
            </h1>
          </div>
          <p className="text-md md:text-lg text-muted-foreground font-body">
            Name all {totalStations} stations on the MRT network!
          </p>
        </header>

        <div className="my-8 text-center">
            <Button asChild variant="secondary" size="lg">
                <Link href="/mrt+">
                    <PlusCircle />
                    MRT+
                </Link>
            </Button>
            <p className="text-muted-foreground mt-2">
                Explore the future of Singapore's rail network.
            </p>
        </div>
      </div>

      <main className="w-full max-w-7xl">
        {stations.length > 0 ? (
          <MrtChallengeGame stations={stations} totalStations={totalStations} />
        ) : (
          <Card className="text-center shadow-lg">
            <CardHeader>
              <CardTitle>Could not load stations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The local station data could not be loaded. Please check the
                file at `src/lib/station-data.ts`.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      <footer className="w-full max-w-5xl mt-8 text-center text-sm text-muted-foreground">
        <p>A game by @larasbuns</p>
      </footer>
    </div>
  );
}
