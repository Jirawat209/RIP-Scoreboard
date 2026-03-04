import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Flame } from 'lucide-react';
import './App.css';

const CountryCell = ({ country, isHighest }) => {
  if (!country) {
    return (
      <div className="w-full h-full border-[0.5px] border-white/60 bg-black/40"></div>
    );
  }

  return (
    <div className="flex items-center w-full h-full border-[0.5px] border-white/60 p-2 lg:p-4 bg-black/40">
      <div className="flex items-center justify-center shrink-0">
        <img
          src={country.flag_url}
          alt={country.name}
          className="w-[84px] h-[56px] object-cover"
        />
      </div>

      <div className="flex-1 flex items-center justify-end px-2 h-full relative">
        {isHighest && (
          <img
            src="/fire-custom-transparent.gif"
            alt="Highest Score Fire"
            className="w-12 h-12 object-contain absolute opacity-80 pointer-events-none -translate-x-[4.5rem]"
          />
        )}
        <span className="text-[#d0e00d] text-4xl lg:text-[48px] font-roboto font-black tracking-tight drop-shadow-glow z-10">
          {country.score}
        </span>
      </div>
    </div>
  );
};

const TopBanner = ({ highestCountry }) => {
  if (!highestCountry) return null;

  return (
    <div className="flex items-center justify-center mb-4">
      <div className="flex items-center bg-black border-[1.5px] border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] rounded-full h-[80px] md:h-[96px] overflow-hidden mx-auto pr-10">
        <div className="h-full flex items-center justify-center px-6 md:px-8 shrink-0 border-r border-white/30 bg-black/40">
          <img
            src={highestCountry.flag_url}
            alt={highestCountry.name}
            className="w-[80px] h-[54px] md:w-[100px] md:h-[66px] object-cover rounded shadow"
          />
        </div>
        <div className="flex items-center pl-8 h-full">
          <span className="text-white text-xl md:text-[28px] font-roboto font-bold tracking-wider mr-6 uppercase">
            Highest Score of the Month
          </span>
          <img
            src="/fire-custom-transparent.gif"
            alt="Highest Score Fire"
            className="w-12 h-12 md:w-14 md:h-14 object-contain mr-2 relative bottom-1"
          />
          <span className="text-[#d0e00d] text-4xl md:text-[56px] font-roboto font-black tracking-tighter drop-shadow-glow mt-[4px]">
            {highestCountry.score}
          </span>
        </div>
      </div>
    </div>
  );
};

const BottomBanner = ({ historicalWinner }) => {
  if (!historicalWinner) return null;

  return (
    <div className="flex items-center justify-center mt-4 pt-2">
      <div className="flex items-center bg-black border-[1.5px] border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] rounded-full h-[70px] md:h-[86px] overflow-hidden mx-auto pr-8">
        <div className="h-full flex items-center justify-center px-6 shrink-0 border-r border-white/30 bg-black/40">
          <img
            src={historicalWinner.flag_url}
            alt={historicalWinner.name}
            className="w-[70px] h-[46px] md:w-[90px] md:h-[60px] object-cover rounded shadow"
          />
        </div>
        <div className="flex items-center pl-6 h-full">
          <span className="text-white text-lg md:text-[24px] font-roboto font-bold tracking-wider mr-4 uppercase">
            Highest Score of Last Month
          </span>
          <img
            src="/fire-custom-transparent.gif"
            alt="Highest Score Fire"
            className="w-10 h-10 md:w-12 md:h-12 object-contain mr-2 relative bottom-1"
          />
          <span className="text-[#d0e00d] text-3xl md:text-[48px] font-roboto font-black tracking-tighter drop-shadow-glow mt-[2px]">
            {historicalWinner.score}
          </span>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [countries, setCountries] = useState([]);
  const [lastMonthWinner, setLastMonthWinner] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/leaderboard`)
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error('Failed to fetch leaderboard:', err));

    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.last_month_winner) {
          setLastMonthWinner(data.last_month_winner);
        }
      })
      .catch(console.error);

    const socket = io(SOCKET_URL);
    socket.on('score_update', (data) => {
      setCountries(data);
    });

    socket.on('settings_update', (data) => {
      if (data.last_month_winner) {
        setLastMonthWinner(data.last_month_winner);
      }
    });

    return () => socket.disconnect();
  }, []);

  const highestScorer = countries.length > 0 ? [...countries].sort((a, b) => b.score - a.score)[0] : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-roboto flex flex-col pt-6 pb-6 items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen pointer-events-none"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/fire-loop.mp4" type="video/mp4" />
      </video>

      <div className="relative z-20 flex flex-col h-full flex-1 w-full max-w-[1920px] max-h-[1080px] mx-auto justify-center">

        {/* Main Title */}
        <h1 className="text-5xl md:text-[76px] text-center text-white font-black tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-6 mt-4">
          R.I.P.SHOT SCOREBOARD
        </h1>

        {/* Highest Score Top Banner */}
        {highestScorer && <TopBanner highestCountry={highestScorer} />}

        {/* Static Matrix */}
        <div className="flex-1 flex items-center justify-center w-full px-4 md:px-12 my-2">
          <div className="grid grid-cols-5 grid-rows-4 w-full h-[520px] max-w-[1700px] mx-auto border-[0.5px] border-white/60 bg-black/40">
            {Array.from({ length: 20 }).map((_, i) => {
              const country = countries[i];
              return (
                <CountryCell
                  key={country ? country.id : `empty-${i}`}
                  country={country}
                  isHighest={country && country.id === highestScorer?.id && country.score > 0}
                />
              );
            })}
          </div>
        </div>

        {/* Placeholder Bottom Banner */}
        <BottomBanner historicalWinner={lastMonthWinner} />

      </div>
    </div>
  );
}

export default App;
