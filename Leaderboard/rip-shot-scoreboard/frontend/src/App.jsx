import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Flame, Maximize, Minimize } from 'lucide-react';
import './App.css';

const CountryCell = ({ country, isHighest }) => {
  if (!country) {
    return (
      <div className="w-full h-full border-[0.5px] border-white/60 bg-black/40"></div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full h-full border-[0.5px] border-white/60 p-2 lg:p-4 bg-black/40 overflow-hidden">
      <div className="flex items-center justify-center shrink-0">
        <img
          src={country.flag_url}
          alt={country.name}
          className="w-[42px] h-[28px] lg:w-[72px] lg:h-[48px] object-cover shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        />
      </div>

      <div className="flex items-center justify-end h-full relative shrink-0">
        {isHighest && (
          <img
            src="/fire-custom-transparent.gif"
            alt="Highest Score Fire"
            className="w-10 h-10 lg:w-14 lg:h-14 object-contain absolute opacity-80 pointer-events-none right-[100%] mr-1 lg:mr-2"
          />
        )}
        <span className="text-[#d0e00d] text-3xl lg:text-[40px] font-roboto font-black tracking-tight drop-shadow-glow z-10 w-[2ch] text-right">
          {country.score}
        </span>
      </div>
    </div>
  );
};

const TopBanner = ({ highestCountry }) => {
  if (!highestCountry) return null;

  return (
    <div className="flex items-center justify-center mb-1 px-2 w-full shrink-0">
      <div className="flex items-center bg-black border-[1.5px] border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] rounded-full h-[8vh] min-h-[50px] max-h-[96px] overflow-hidden mx-auto pr-4 lg:pr-10">
        <div className="h-full flex items-center justify-center px-4 md:px-8 shrink-0 border-r border-white/30 bg-black/40">
          <img
            src={highestCountry.flag_url}
            alt={highestCountry.name}
            className="w-[50px] h-[34px] md:w-[100px] md:h-[66px] object-cover rounded shadow"
          />
        </div>
        <div className="flex items-center pl-4 lg:pl-8 h-full">
          <span className="text-white text-sm md:text-[28px] font-roboto font-bold tracking-wider mr-2 lg:mr-6 uppercase truncate">
            Highest Score of the Month
          </span>
          <img
            src="/fire-custom-transparent.gif"
            alt="Highest Score Fire"
            className="w-6 h-6 md:w-14 md:h-14 object-contain mr-1 lg:mr-2 relative bottom-1"
          />
          <span className="text-[#d0e00d] text-2xl md:text-[56px] font-roboto font-black tracking-tighter drop-shadow-glow mt-[2px] lg:mt-[4px]">
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
    <div className="flex items-center justify-center mt-1 lg:mt-4 pt-1 lg:pt-2 px-2 w-full shrink-0">
      <div className="flex items-center bg-black border-[1.5px] border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] rounded-full h-[7vh] min-h-[46px] max-h-[86px] overflow-hidden mx-auto pr-4 lg:pr-8">
        <div className="h-full flex items-center justify-center px-4 lg:px-6 shrink-0 border-r border-white/30 bg-black/40">
          <img
            src={historicalWinner.flag_url}
            alt={historicalWinner.name}
            className="w-[45px] h-[30px] md:w-[90px] md:h-[60px] object-cover rounded shadow"
          />
        </div>
        <div className="flex items-center pl-4 lg:pl-6 h-full">
          <span className="text-white text-xs md:text-[24px] font-roboto font-bold tracking-wider mr-2 lg:mr-4 uppercase truncate">
            Highest Score of Last Month
          </span>
          <img
            src="/fire-custom-transparent.gif"
            alt="Highest Score Fire"
            className="w-5 h-5 md:w-12 md:h-12 object-contain mr-1 lg:mr-2 relative bottom-1"
          />
          <span className="text-[#d0e00d] text-xl md:text-[48px] font-roboto font-black tracking-tighter drop-shadow-glow mt-[1px] lg:mt-[2px]">
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Forcefully suppress all scrollbars ONLY on the TV Scoreboard component mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from('countries')
        .select('*')
        .order('position', { ascending: true })
        .order('id', { ascending: true });
      if (data) setCountries(data);
    };

    const fetchSettings = async () => {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'last_month_winner')
        .single();
      if (data && data.value) setLastMonthWinner(data.value);
    };

    fetchLeaderboard();
    fetchSettings();

    const intervalId = setInterval(() => {
      fetchLeaderboard();
      fetchSettings();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const highestScorer = countries.length > 0 ? [...countries].sort((a, b) => b.score - a.score)[0] : null;

  return (
    <div className="relative w-full h-screen max-h-screen overflow-hidden bg-black font-roboto flex flex-col pt-2 pb-2 items-center justify-center">
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

      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullScreen}
        className="absolute bottom-8 right-4 z-50 p-3 bg-black/40 hover:bg-black/80 border border-white/20 text-white/50 hover:text-white rounded-full transition-all duration-300 backdrop-blur-sm shadow-xl cursor-pointer"
        title="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
      </button>

      <div className="relative z-20 flex flex-col h-full flex-1 w-full max-w-[1920px] max-h-screen overflow-hidden mx-auto justify-between pt-1 pb-2">

        {/* Main Title */}
        <h1 className="text-[5vw] lg:text-[72px] text-center text-white font-black tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-1 mt-0 shrink-0 leading-none">
          R.I.P.SHOT SCOREBOARD
        </h1>

        {/* Highest Score Top Banner */}
        {highestScorer && <TopBanner highestCountry={highestScorer} />}

        {/* Static Matrix */}
        <div className="flex-1 flex items-center justify-center w-full px-4 md:px-12 my-2 overflow-hidden">
          <div className="grid grid-cols-5 grid-rows-4 w-full h-full max-h-[600px] max-w-[1700px] mx-auto border-[0.5px] border-white/60 bg-black/40">
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
