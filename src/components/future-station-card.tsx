import type { FutureStation } from '@/lib/future-station-data';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { HardHat, Info, CheckCircle, Clock } from 'lucide-react';

const getLineCode = (code: string) => {
  const match = code.match(/^[A-Z]+/);
  return match ? match[0] : '';
};

const lineColors: Record<string, string> = {
  EW: '#009645',
  NS: '#DA291C',
  DT: '#005ec4',
  CC: '#fa9e0d',
  NE: '#9900aa',
  TE: '#9D5B25',
  BP: '#778899',
  SK: '#778899',
  PG: '#778899',
  CG: '#009645',
  CE: '#fa9e0d',
};

const LinePill = ({ stationCode }: { stationCode: string }) => {
  const line = getLineCode(stationCode);
  const color = lineColors[line] || '#778899';
  return (
    <div
      className="px-2 py-1 rounded text-center font-bold text-sm text-white"
      style={{ backgroundColor: color }}
    >
      {stationCode}
    </div>
  );
};

const StatusIndicator = ({ status }: { status: string }) => {
  if (status === 'Under Construction') {
    return (
      <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded">
        U/C
      </div>
    );
  }

  let icon: React.ReactNode;
  let text = status;
  switch (status) {
    case 'Completed but not open':
      icon = <Clock className="w-3 h-3" />;
      break;
    case 'Reserved (Shell station)':
      icon = <Info className="w-3 h-3" />;
      break;
    case 'Non-existent / Reserved Code':
        icon = <Info className="w-3 h-3" />;
        break;
    default:
      icon = <CheckCircle className="w-3 h-3" />;
      break;
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1.5">
      {icon}
      <span>{text}</span>
    </Badge>
  );
};

export default function FutureStationCard({ station }: { station: FutureStation }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl font-bold tracking-tight">{station.name}</CardTitle>
            <div className="flex flex-wrap gap-1 shrink-0">
                {station.lines.map(line => (
                    <LinePill key={line} stationCode={line} />
                ))}
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold w-20">Status:</span>
          <StatusIndicator status={station.status} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold w-20">Opening:</span>
          <span className="text-muted-foreground">{station.opening}</span>
        </div>
        <div>
          <p className="font-semibold mb-1">Role:</p>
          <p className="text-muted-foreground">{station.locationRole}</p>
        </div>
        {station.features && (
           <div>
             <p className="font-semibold mb-1">Features:</p>
             <p className="text-muted-foreground">{station.features}</p>
           </div>
        )}
        {station.interestingFact && (
            <div>
                <p className="font-semibold mb-1">Interesting Fact:</p>
                <p className="text-muted-foreground">{station.interestingFact}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
