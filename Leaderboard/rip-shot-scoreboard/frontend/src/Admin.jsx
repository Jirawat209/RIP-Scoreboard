import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Admin() {
    const [countries, setCountries] = useState([]);
    const [availableCountries, setAvailableCountries] = useState([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const [historyCountryCode, setHistoryCountryCode] = useState('');
    const [historyScore, setHistoryScore] = useState(0);

    const fetchLeaderboard = async () => {
        const { data } = await supabase
            .from('countries')
            .select('*')
            .order('position', { ascending: true })
            .order('id', { ascending: true });
        if (data) setCountries(data);
    };

    useEffect(() => {
        if (isAuthenticated) {
            let ignore = false;

            const initLeaderboard = async () => {
                const { data } = await supabase
                    .from('countries')
                    .select('*')
                    .order('position', { ascending: true })
                    .order('id', { ascending: true });
                if (data && !ignore) setCountries(data);
            };
            initLeaderboard();

            Promise.all([
                fetch('https://restcountries.com/v3.1/all?fields=name,cca2').then(res => res.json()),
                supabase.from('settings').select('value').eq('key', 'last_month_winner').single()
            ])
                .then(([countriesData, settingsResponse]) => {
                    if (!countriesData || !Array.isArray(countriesData)) {
                        console.error('Invalid countries API response:', countriesData);
                        return;
                    }
                    console.log(`Loaded ${countriesData.length} countries from API`);

                    const sorted = countriesData.sort((a, b) => a.name.common.localeCompare(b.name.common));
                    setAvailableCountries(sorted);
                    if (sorted.length > 0) {
                        setSelectedCountryCode(sorted[0].cca2);
                        setHistoryCountryCode(sorted[0].cca2);
                    }

                    const settingsData = settingsResponse?.data?.value;
                    if (settingsData) {
                        setHistoryScore(settingsData.score);
                        const matched = sorted.find(c => c.name.common === settingsData.name);
                        if (matched) {
                            setHistoryCountryCode(matched.cca2);
                        }
                    }
                })
                .catch(err => console.error('Error fetching admin data:', err));

            return () => { ignore = true; };
        }
    }, [isAuthenticated]);

    const updateScore = async (country_id, new_score) => {
        await supabase
            .from('countries')
            .update({ score: Math.max(0, new_score), updated_at: new Date().toISOString() })
            .eq('id', country_id);
        fetchLeaderboard();
    };

    const moveCountry = async (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === countries.length - 1) return;

        const newOrder = [...countries];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newOrder[index];
        newOrder[index] = newOrder[swapIndex];
        newOrder[swapIndex] = temp;

        setCountries(newOrder);

        for (let i = 0; i < newOrder.length; i++) {
            await supabase.from('countries').update({ position: i }).eq('id', newOrder[i].id);
        }
        fetchLeaderboard();
    };

    const addCountry = async (e) => {
        e.preventDefault();
        const countryObj = availableCountries.find(c => c.cca2 === selectedCountryCode);
        if (!countryObj) return;

        const name = countryObj.name.common;
        const flag_url = `https://flagcdn.com/w80/${countryObj.cca2.toLowerCase()}.png`;

        await supabase.from('countries').insert([{ name, flag_url, score: 0, position: 999 }]);
        fetchLeaderboard();
    };

    const updateHistorySettings = async (e) => {
        e.preventDefault();
        const countryObj = availableCountries.find(c => c.cca2 === historyCountryCode);
        if (!countryObj) return;

        const name = countryObj.name.common;
        const flag_url = `https://flagcdn.com/w80/${countryObj.cca2.toLowerCase()}.png`;

        await supabase.from('settings').upsert({
            key: 'last_month_winner',
            value: { name, flag_url, score: Number(historyScore) }
        });
        alert('Settings updated successfully!');
    };

    const deleteCountry = async (id) => {
        if (confirm('Are you sure you want to delete this country?')) {
            await supabase.from('countries').delete().eq('id', id);
            fetchLeaderboard();
        }
    };

    const resetAll = async () => {
        if (confirm('Are you sure you want to reset all scores?')) {
            await supabase.from('countries').update({ score: 0, updated_at: new Date().toISOString() }).neq('id', 0);
            fetchLeaderboard();
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <form onSubmit={(e) => { e.preventDefault(); if (password === 'admin123') setIsAuthenticated(true); }} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
                    <h2 className="text-2xl text-white mb-6 text-center font-bold">Admin Login</h2>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded p-3 mb-4 focus:ring-2 focus:ring-blue-500"
                        placeholder="Password (admin123)"
                    />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors">
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Leaderboard Admin</h1>
                    <button onClick={resetAll} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors">
                        Reset All Scores
                    </button>
                </div>

                {/* Add Country Form */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Select Country to Add</h2>
                    <form onSubmit={addCountry} className="flex gap-4 items-end flex-wrap">
                        <div className="flex-1 min-w-[300px]">
                            <label className="block text-sm text-gray-400 mb-1">Country</label>
                            <select
                                required
                                value={selectedCountryCode}
                                onChange={e => setSelectedCountryCode(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 appearance-auto"
                            >
                                {availableCountries.length > 0 ? (
                                    availableCountries.map(c => (
                                        <option key={c.cca2} value={c.cca2} className="bg-gray-800 text-white p-2">
                                            {c.name.common}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>Loading countries...</option>
                                )}
                            </select>
                        </div>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition-colors mt-6 md:mt-0">
                            Add
                        </button>
                    </form>
                </div>

                {/* History Settings Form */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Last Month Winner Settings</h2>
                    <form onSubmit={updateHistorySettings} className="flex gap-4 items-end flex-wrap">
                        <div className="flex-1 min-w-[250px]">
                            <label className="block text-sm text-gray-400 mb-1">Country</label>
                            <select
                                required
                                value={historyCountryCode}
                                onChange={e => setHistoryCountryCode(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 appearance-auto"
                            >
                                {availableCountries.length > 0 ? (
                                    availableCountries.map(c => (
                                        <option key={c.cca2} value={c.cca2} className="bg-gray-800 text-white p-2">
                                            {c.name.common}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>Loading countries...</option>
                                )}
                            </select>
                        </div>
                        <div className="w-[120px]">
                            <label className="block text-sm text-gray-400 mb-1">Score</label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={historyScore}
                                onChange={e => setHistoryScore(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition-colors mt-6 md:mt-0">
                            Save Winner
                        </button>
                    </form>
                </div>

                {/* Manage Scores */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-6 text-gray-200">Manage Scores</h2>
                    <div className="space-y-4">
                        {countries.map((country, idx) => (
                            <div key={country.id} className="flex flex-col md:flex-row items-center justify-between bg-gray-700 p-4 rounded border border-gray-600 gap-4">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="flex flex-col gap-1 items-center justify-center pr-2 border-r border-gray-600">
                                        <button onClick={() => moveCountry(idx, 'up')} disabled={idx === 0} className="text-gray-400 hover:text-white disabled:opacity-30">▲</button>
                                        <button onClick={() => moveCountry(idx, 'down')} disabled={idx === countries.length - 1} className="text-gray-400 hover:text-white disabled:opacity-30">▼</button>
                                    </div>
                                    <img src={country.flag_url} alt={country.name} className="w-12 h-8 object-cover rounded shadow" />
                                    <div>
                                        <h3 className="font-bold text-lg">{country.name}</h3>
                                        <p className="text-gray-400 text-sm">Score: <span className="text-white font-mono text-lg">{country.score}</span></p>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                                    <button onClick={() => updateScore(country.id, country.score + 1)} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-mono shrink-0">
                                        +1
                                    </button>
                                    <button onClick={() => updateScore(country.id, country.score + 5)} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-mono shrink-0">
                                        +5
                                    </button>
                                    <button onClick={() => updateScore(country.id, country.score - 1)} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded font-mono shrink-0">
                                        -1
                                    </button>
                                    <button onClick={() => updateScore(country.id, 0)} className="bg-red-800 hover:bg-red-700 px-4 py-2 rounded text-sm shrink-0">
                                        Reset
                                    </button>
                                    <button onClick={() => deleteCountry(country.id)} className="bg-orange-800 hover:bg-orange-700 px-4 py-2 rounded text-sm shrink-0">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}

                        {countries.length === 0 && (
                            <div className="text-center text-gray-500 py-8">No countries added yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
