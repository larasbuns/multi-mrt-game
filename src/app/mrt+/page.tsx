import FutureStationCard from '@/components/future-station-card';
import { futureLineExtensions } from '@/lib/future-station-data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MrtPlusPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-5xl mb-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            MRT+
          </h1>
        </div>
        <p className="text-md md:text-lg text-muted-foreground font-body">
          A look at the future of Singapore's rail network.
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        {futureLineExtensions.map((extension) => (
          <section key={extension.name}>
            <h2 className="text-3xl font-bold mb-4 tracking-wide border-b pb-2">
              {extension.name}
            </h2>
            <div className="space-y-6">
              {extension.stations.map((station) => (
                <FutureStationCard key={station.name} station={station} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="w-full max-w-5xl mt-8 text-center">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft />
            Back to Game
          </Link>
        </Button>
      </footer>
    </div>
  );
}
