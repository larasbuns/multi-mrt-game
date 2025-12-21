
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Station } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Clock, Play, Pause, RefreshCcw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

/* =========================
   UTILITIES
========================= */

type Language = 'english' | 'pinyin' | 'chinese' | 'abbreviation';

const normalize = (str: string) =>
  str.toLowerCase().replace(/[\s\W_'-]+/g, '');

const normalizeChinese = (str: string) =>
  str.replace(/\s+/g, '');

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/* =========================
   LINE METADATA
========================= */

const lineColors: Record<string, string> = {
  EW: '#009645', // green
  NS: '#DA291C', // red
  DT: '#005ec4', // blue
  CC: '#fa9e0d', // orange
  NE: '#9900aa', // purple
  TE: '#9D5B25', // brown
  BP: '#778899', // grey
  SK: '#778899', // grey
  PG: '#778899', // grey
  CG: '#009645', // green
  CE: '#fa9e0d', // orange, same as CC
};

const lineNames: Record<string, string> = {
  EW: 'East West Line',
  NS: 'North South Line',
  DT: 'Downtown Line',
  CC: 'Circle Line',
  NE: 'North East Line',
  TE: 'Thomson-East Coast Line',
  BP: 'Bukit Panjang LRT',
  SK: 'Sengkang LRT',
  PG: 'Punggol LRT',
  CG: 'Changi Airport Branch Line',
};

const LINE_ORDER = ['EW', 'CG', 'NS', 'NE', 'CC', 'TE', 'DT'];

const getLineCode = (code: string) => {
  const match = code.match(/^[A-Z]+/);
  return match ? match[0] : '';
};


/* =========================
   Sigma Screen
========================= */

const SigmaScreen = ({ onPlayAgain }: { onPlayAgain: () => void }) => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-9xl font-bold tracking-widest">sigma.</h1>
       <Button onClick={onPlayAgain} variant="outline" size="lg" className="mt-12 bg-transparent text-white hover:bg-white hover:text-black">
         <RefreshCcw className="mr-2" /> Play Again
      </Button>
    </div>
);


/* =========================
   GRID ITEM
========================= */
const StationCodePill = ({ stationCode }: { stationCode: string }) => {
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


const StationGridItem = ({
  station,
  isFound,
  interchangeCodes,
}: {
  station: Station;
  isFound: boolean;
  interchangeCodes: string[];
}) => {
  const isInterchange = interchangeCodes.length > 1;

  return (
    <div
      className="p-2 border rounded-lg flex items-center gap-2 bg-card text-card-foreground/70"
      style={{ minHeight: '60px' }}
    >
      <div className="flex flex-wrap gap-1 shrink-0">
        {isInterchange ? (
          // For interchanges, show all codes in small pills
          interchangeCodes.map(code => (
            <StationCodePill key={code} stationCode={code} />
          ))
        ) : (
          // For regular stations, show one larger pill
          <StationCodePill stationCode={station.id} />
        )}
      </div>

      <div className="flex-grow">
        {isFound ? (
          <div className="text-foreground">
            <div className="font-bold text-base leading-tight">
              {station.mrt_station_english}
            </div>
            <div className="text-sm font-light leading-tight">
              {station.mrt_station_chinese}
            </div>
            <div className="text-xs text-muted-foreground pt-1">
              {station.mrt_station_pinyin}
            </div>
             {station.abbreviation && (
              <div className="text-xs text-muted-foreground pt-1">
                ({station.abbreviation})
              </div>
            )}
          </div>
        ) : (
          <div className="h-[36px]" />
        )}
      </div>
    </div>
  );
};


/* =========================
   MAIN COMPONENT
========================= */

export default function MrtChallengeGame({
  stations,
  totalStations,
}: {
  stations: Station[];
  totalStations: number;
}) {
  const [userInput, setUserInput] = useState('');
  const [foundStationNames, setFoundStationNames] = useState<Set<string>>(new Set());
  const [lastGuess, setLastGuess] = useState<{
    stationName: string | null;
    correct: boolean;
  } | null>(null);
  const [language, setLanguage] = useState<Language>('english');
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Timer effect
  useEffect(() => {
    if (!mounted || gameOver || !timerActive) return;

    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameOver(true);
          toast({
            title: "Time's up!",
            description: 'All remaining stations have been revealed.',
            variant: 'destructive',
          });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, mounted, toast, timerActive]);

  const resetGame = (newLanguage: Language = language) => {
    setLanguage(newLanguage);
    setFoundStationNames(new Set());
    setLastGuess(null);
    setUserInput('');
    setGameOver(false);
    setGameWon(false);
    setTimeRemaining(15 * 60);
    setGameStarted(false);
    setTimerActive(false);
  };
  
  const handleLanguageChange = (newLanguage: Language) => {
    resetGame(newLanguage);
  };

  /* =========================
     LOOKUP MAPS (FOR GUESSING)
  ========================= */

  const stationGuessMaps = useMemo(() => {
    const maps: Record<Language, Map<string, Station>> = {
      english: new Map(),
      pinyin: new Map(),
      chinese: new Map(),
      abbreviation: new Map(),
    };

    for (const s of stations) {
      const normalizedEnglish = normalize(s.mrt_station_english);
      if (!maps.english.has(normalizedEnglish)) maps.english.set(normalizedEnglish, s);

      const normalizedPinyin = normalize(s.mrt_station_pinyin);
      if (!maps.pinyin.has(normalizedPinyin)) maps.pinyin.set(normalizedPinyin, s);

      const normalizedChinese = normalizeChinese(s.mrt_station_chinese);
      if (!maps.chinese.has(normalizedChinese)) maps.chinese.set(normalizedChinese, s);
      
      if (s.abbreviation) {
        const normalizedAbbr = normalize(s.abbreviation);
        if (!maps.abbreviation.has(normalizedAbbr)) maps.abbreviation.set(normalizedAbbr, s);
      }
    }
    return maps;
  }, [stations]);

  /* =========================
     SUBMIT HANDLER
  ========================= */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput || gameOver || !timerActive) return;

    const currentMap = stationGuessMaps[language];
    const normalizer = language === 'chinese' ? normalizeChinese : normalize;
    const normalizedInput = normalizer(userInput);

    const station = currentMap.get(normalizedInput);

    if (!station) {
      setLastGuess({ stationName: null, correct: false });
      setUserInput('');
      return;
    }
    
    const stationName = station.mrt_station_english;

    if (foundStationNames.has(stationName)) {
      toast({
        title: 'Already found',
        description: stationName,
      });
    } else {
      const newFoundStationNames = new Set(foundStationNames).add(stationName);
      setFoundStationNames(newFoundStationNames);
      setLastGuess({ stationName, correct: true });

      if (newFoundStationNames.size === totalStations) {
        setGameOver(true);
        setTimerActive(false);
        setGameWon(true);
        toast({
          title: 'Congratulations!',
          description: `You've named all ${totalStations} stations!`,
          variant: 'default',
        });
      }
    }

    setUserInput('');
  };
  
  const handleGiveUp = () => {
    setGameOver(true);
    setTimerActive(false);
    toast({
      title: 'Game Over',
      description: 'All stations have been revealed.',
    });
  };

  /* =========================
     GROUP + SORT
  ========================= */

  const groupedStations = useMemo(() => {
    const groups: Record<string, Station[]> = {};

    for (const s of stations) {
      let primaryLine = getLineCode(s.id);
      // Treat CE line stations as part of the CC line for grouping
      if (primaryLine === 'CE') {
        primaryLine = 'CC';
      }
      
      if (!groups[primaryLine]) groups[primaryLine] = [];
      groups[primaryLine].push(s);
    }

    for (const line in groups) {
      groups[line].sort((a, b) => {
          const aNum = parseInt(a.id.replace(/^[A-Z]+/, ''), 10);
          const bNum = parseInt(b.id.replace(/^[A-Z]+/, ''), 10);
          return aNum - bNum;
        }
      );
    }

    return LINE_ORDER.map(line => ({
      line,
      name: lineNames[line],
      stations: groups[line] ?? [],
    })).filter(g => g.stations.length > 0);
  }, [stations]);

  const progress =
    totalStations > 0
      ? Math.round((foundStationNames.size / totalStations) * 100)
      : 0;

  if (!mounted) return null;

  if (gameWon) {
    return <SigmaScreen onPlayAgain={() => resetGame()} />;
  }

  const startGame = () => {
    setGameStarted(true);
    setTimerActive(true);
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="space-y-6">
      <Card className="sticky top-4 z-10 shadow-lg bg-card/95 backdrop-blur-sm">
        <CardContent className="space-y-4 p-4">
          <RadioGroup
            value={language}
            onValueChange={v => handleLanguageChange(v as Language)}
            className="flex justify-center flex-wrap gap-x-6 gap-y-2"
            disabled={gameStarted}
          >
            <Label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="english" /> English
            </Label>
            <Label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="pinyin" /> Pinyin
            </Label>
            <Label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="chinese" /> 中文
            </Label>
             <Label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="abbreviation" /> Abbreviation
            </Label>
          </RadioGroup>
          
          {!gameStarted ? (
            <Button onClick={startGame} size="lg" className="w-full">
              <Play className="mr-2" /> Start Game
            </Button>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder={
                  !timerActive
                    ? 'Timer paused. Press Resume to continue.'
                    : language === 'english'
                    ? 'Type an English station name...'
                    : language === 'pinyin'
                    ? 'Type a Pinyin station name...'
                    : language === 'abbreviation'
                    ? 'Type a 3-letter station code...'
                    : '输入中文站名...'
                }
                className="text-lg p-6 text-center"
                autoFocus
                disabled={gameOver || !timerActive}
              />
            </form>
          )}


          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 font-mono text-lg">
              <Clock className="w-5 h-5 text-muted-foreground"/>
              <span className={timeRemaining < 60 ? 'text-destructive font-bold' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Progress value={progress} />
            <div className="text-right">
              <div className="text-lg font-bold">
                {foundStationNames.size} / {totalStations}
              </div>
              <div className="text-xs text-muted-foreground">
                Stations Found
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center min-h-[40px]">
            {lastGuess && (
              <Badge
                variant={lastGuess.correct ? 'default' : 'destructive'}
                className="bg-opacity-20 text-current"
              >
                {lastGuess.correct ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {lastGuess.stationName}
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Incorrect
                  </>
                )}
              </Badge>
            )}

            {gameStarted && !gameOver && (
              <div className="flex gap-2 ml-auto">
                {timerActive ? (
                  <Button onClick={() => setTimerActive(false)} variant="outline" size="sm">
                    <Pause /> Pause
                  </Button>
                ) : (
                  <Button onClick={() => setTimerActive(true)} variant="outline" size="sm">
                    <Play /> Resume
                  </Button>
                )}
                <Button onClick={handleGiveUp} variant="destructive" size="sm">
                  Give Up
                </Button>
              </div>
            )}
             {gameOver && !gameWon && (
               <Button onClick={() => resetGame()} variant="default" size="sm" className="ml-auto">
                 <RefreshCcw /> Play Again
               </Button>
            )}
          </div>

        </CardContent>
      </Card>

      {groupedStations.map(group => (
        <section key={group.line}>
          <h2 className="text-2xl font-bold mb-3 text-foreground tracking-wide">{group.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {group.stations.map(station => (
              <StationGridItem
                key={station.id}
                station={station}
                isFound={foundStationNames.has(station.mrt_station_english) || gameOver}
                interchangeCodes={station.mrt_station_codes}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
