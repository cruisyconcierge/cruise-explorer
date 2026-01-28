import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Trash2, 
  ExternalLink,
  Ship,
  Sun,
  X,
  CalendarDays,
  ListPlus,
  Check,
  Share2,
  ShoppingBag,
  Anchor,
  ArrowRight,
  Palmtree,
  ArrowLeft,
  Search,
  Menu,
  Mail
} from 'lucide-react';

// --- Configuration ---
const WP_CRUISE_API_URL = 'https://cruisytravel.com/wp-json/wp/v2/cruise?_embed&per_page=100'; 
const WP_ACTIVITY_API_URL = 'https://cruisytravel.com/wp-json/wp/v2/itineraries?_embed&per_page=100'; 
const BRAND_COLOR = '#34a4b8';

// --- Static Data ---
const CRUISE_LINES = [
  { id: 'virgin', name: 'Virgin Voyages', slogan: 'Adults Only • Rebellious Luxury', color: '#E10A1D', image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=600' },
  { id: 'royal', name: 'Royal Caribbean', slogan: 'Innovation at Sea', color: '#005DAA', image: 'https://images.unsplash.com/photo-1559599238-308793637120?auto=format&fit=crop&q=80&w=600' },
  { id: 'carnival', name: 'Carnival', slogan: 'Choose Fun', color: '#E31D2B', image: 'https://images.unsplash.com/photo-1599640845513-26224d7ce400?auto=format&fit=crop&q=80&w=600' },
  { id: 'celebrity', name: 'Celebrity', slogan: 'Exquisite Modern Luxury', color: '#1A1F71', image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe79b9b7?auto=format&fit=crop&q=80&w=600' },
  { id: 'norwegian', name: 'Norwegian', slogan: 'Feel Free', color: '#00A3E0', image: 'https://images.unsplash.com/photo-1621255535314-d830504746d8?auto=format&fit=crop&q=80&w=600' },
  { id: 'disney', name: 'Disney', slogan: 'Magic at Sea', color: '#192C5E', image: 'https://images.unsplash.com/photo-1512101137015-8495a8647565?auto=format&fit=crop&q=80&w=600' }
];

const MOCK_ITINERARIES = [
  { id: 101, lineId: 'virgin', title: 'Dominican Daze', nights: 5, port: 'Miami', season: 'Year Round', price: 1450, ship: 'Scarlet Lady', regions: ['Caribbean'], image: '🌴', description: 'Escape to the Caribbean on an adults-only voyage.', itinerary: ['Miami', 'Sea Day', 'Puerto Plata', 'Sea Day', 'Bimini', 'Miami'], affiliateLink: '#' },
];

const MOCK_ESSENTIALS = [
  { id: 'e1', title: 'Waterproof Phone Pouch', price: '9.99', image: '📱', link: '#' },
  { id: 'e2', title: 'Magnetic Hooks (Heavy Duty)', price: '12.99', image: '🧲', link: '#' },
  { id: 'e3', title: 'Reef Safe Sunscreen', price: '15.50', image: '🧴', link: '#' },
  { id: 'e4', title: 'Power Strip (Non-Surge)', price: '19.99', image: '🔌', link: '#' },
];

const MOCK_ACTIVITIES = [
  { id: 'a1', title: 'Blue Lagoon Island Beach Day', port: 'Nassau', price: 89, image: '🏝️', link: '#' },
  { id: 'a2', title: 'Mayan Ruins Excursion', port: 'Cozumel', price: 120, image: '🏛️', link: '#' },
];

// --- Helper Functions ---
const getLineId = (name) => {
  if (!name) return 'virgin';
  const lower = name.toLowerCase();
  if (lower.includes('virgin')) return 'virgin';
  if (lower.includes('royal')) return 'royal';
  if (lower.includes('carnival')) return 'carnival';
  if (lower.includes('celebrity')) return 'celebrity';
  if (lower.includes('norwegian') || lower.includes('ncl')) return 'norwegian';
  if (lower.includes('disney')) return 'disney';
  return 'virgin';
};

// --- Components ---

const CruiseShipIcon = ({ className, count }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
       <path d="M0 80 Q 25 70 50 80 T 100 80 V 100 H 0 Z" fill="#3b82f6" opacity="0.8" />
       <path d="M0 85 Q 25 75 50 85 T 100 85 V 100 H 0 Z" fill="#2563eb" opacity="0.8" />
       <path d="M15 60 L 25 80 H 90 L 95 60 Z" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
       <path d="M20 65 L 88 65" stroke="#34a4b8" strokeWidth="3" />
       <rect x="30" y="45" width="55" height="15" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
       <rect x="35" y="35" width="40" height="10" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
       <path d="M45 35 L 42 20 H 50 L 53 35 Z" fill="#ef4444" />
       <path d="M65 35 L 62 25 H 70 L 73 35 Z" fill="#ef4444" />
       <circle cx="35" cy="52" r="2" fill="#34a4b8" />
       <circle cx="45" cy="52" r="2" fill="#34a4b8" />
       <circle cx="55" cy="52" r="2" fill="#34a4b8" />
       <circle cx="65" cy="52" r="2" fill="#34a4b8" />
       <circle cx="75" cy="52" r="2" fill="#34a4b8" />
    </svg>
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm z-10 animate-pulse">
        {count}
      </span>
    )}
  </div>
);

const ListDrawer = ({ isOpen, onClose, savedItems, onRemove, onEmail }) => {
  const cruises = savedItems.filter(i => i.type === 'cruise');
  const activities = savedItems.filter(i => i.type === 'activity');
  const essentials = savedItems.filter(i => i.type === 'essential');

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h2 className="font-russo text-2xl">My Voyage List</h2>
          <p className="text-xs text-slate-400">Save now, book later.</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {savedItems.length === 0 && (
          <div className="text-center py-10 opacity-50 flex flex-col items-center">
            <Anchor className="w-12 h-12 mb-2 text-teal-500" />
            <p>Your list is empty.</p>
            <p className="text-sm">Start exploring to add items!</p>
          </div>
        )}

        {cruises.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider flex items-center gap-2"><Ship className="w-4 h-4" /> Voyages</h3>
            <div className="space-y-3">
              {cruises.map(item => (
                <div key={item.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative group">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm overflow-hidden">
                       {item.realImage ? <img src={item.realImage} className="w-full h-full object-cover" /> : item.image}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.ship}</p>
                      <a href={item.affiliateLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-teal-600 hover:underline mt-1 block">Book Now &rarr;</a>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activities.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider flex items-center gap-2"><Palmtree className="w-4 h-4" /> Experiences</h3>
            <div className="space-y-3">
              {activities.map(item => (
                <div key={item.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative group flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">{item.image}</div>
                   <div className="flex-grow">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.port} • ${item.price}</p>
                   </div>
                   <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {essentials.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Essentials</h3>
            <div className="space-y-3">
              {essentials.map(item => (
                <div key={item.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative group flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">{item.image}</div>
                   <div className="flex-grow">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.title}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs font-bold text-slate-500">${item.price}</span>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase font-bold text-orange-500 hover:underline">Buy on Amazon</a>
                      </div>
                   </div>
                   <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <button onClick={onEmail} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
           <Mail className="w-4 h-4" /> Email My List
        </button>
      </div>
    </div>
  );
};

export default function CruiseExplorer() {
  const [view, setView] = useState('home'); // home, line_view
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showList, setShowList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data
  const [cruises, setCruises] = useState(MOCK_ITINERARIES);
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Init ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cruisy_voyage_list');
      if (saved) setSavedItems(JSON.parse(saved));
    } catch(e) {}

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Cruises
        const cRes = await fetch(WP_CRUISE_API_URL);
        if (cRes.ok) {
          const data = await cRes.json();
          const mapped = data.map(post => ({
            id: post.id,
            type: 'cruise',
            lineId: getLineId(post.acf?.cruise_line),
            title: post.title.rendered,
            ship: post.acf?.ship_name || 'Cruise Ship',
            nights: post.acf?.nights || 7,
            port: post.acf?.departure_port || 'Miami',
            price: post.acf?.price || 0,
            image: '🚢',
            realImage: post.acf?.main_image?.url || post.acf?.main_image || post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
            description: post.acf?.description || '',
            itinerary: post.acf?.ports_of_call ? post.acf.ports_of_call.split(',').map(s => s.trim()) : [],
            affiliateLink: post.acf?.affiliate_link || '#',
            amazonJson: post.acf?.amazon_json ? JSON.parse(post.acf.amazon_json) : [],
            rating: post.acf?.rating
          }));
          setCruises(mapped);
        }
        // Fetch Activities
        const aRes = await fetch(WP_ACTIVITY_API_URL);
        if (aRes.ok) {
          const data = await aRes.json();
          const mapped = data.map(post => ({
            id: post.id,
            type: 'activity',
            title: post.title.rendered,
            port: post.acf?.port_name || 'Destination',
            price: post.acf?.price || 50,
            image: '🌴',
            link: post.link
          }));
          setActivities(mapped);
        }
      } catch (err) {
        console.warn('API Error', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cruisy_voyage_list', JSON.stringify(savedItems));
  }, [savedItems]);

  // --- Handlers ---
  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
    setView('line_view');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedBrand(null);
    setView('home');
  };

  const toggleSave = (item) => {
    const exists = savedItems.find(i => i.id === item.id);
    if (exists) {
      setSavedItems(savedItems.filter(i => i.id !== item.id));
    } else {
      setSavedItems([...savedItems, { ...item, savedAt: new Date() }]);
    }
  };

  const handleEmail = () => {
    const subject = "My Cruise Explorer List";
    const body = JSON.stringify(savedItems, null, 2); 
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Here is my saved cruise list.")}`;
  };

  // --- Filters ---
  const filteredCruises = cruises.filter(c => {
    if (selectedBrand && c.lineId !== selectedBrand.id) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-900 font-roboto text-slate-100 overflow-x-hidden selection:bg-teal-500 selection:text-white">
      
      {/* Styles & Animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Russo+One&display=swap');
        .font-russo { font-family: 'Russo One', sans-serif; }
        .font-roboto { font-family: 'Roboto', sans-serif; }
        
        .bg-ocean-gradient {
          background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%);
        }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* --- Header --- */}
      <header className="fixed top-0 w-full z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBack}>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-teal-500 shadow-lg shadow-teal-500/20">
                <img src="https://cruisytravel.com/wp-content/uploads/2024/01/cropped-20240120_025955_0000.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-russo text-xl tracking-wide uppercase text-white">Cruise <span style={{ color: BRAND_COLOR }}>Explorer</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {view === 'line_view' && (
                <button onClick={handleBack} className="hidden md:flex items-center gap-1 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                   <ArrowLeft className="w-4 h-4" /> All Lines
                </button>
             )}
             <button onClick={() => setShowList(true)} className="relative p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors group border border-slate-700">
               <CruiseShipIcon className="w-8 h-8 text-teal-400" count={savedItems.length} />
             </button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-10 min-h-screen bg-ocean-gradient">
        
        {/* --- VIEW: HOME (Brand Selection) --- */}
        {view === 'home' && (
          <div className="max-w-7xl mx-auto px-4 animate-fade-in">
             <div className="text-center py-10">
                <h2 className="font-russo text-4xl md:text-5xl text-white mb-4 drop-shadow-lg">Find Your Perfect Voyage</h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">Select a cruise line to start exploring ships, itineraries, and exclusive experiences.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CRUISE_LINES.map((brand) => (
                   <button 
                      key={brand.id}
                      onClick={() => handleSelectBrand(brand)}
                      className="group relative h-48 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-teal-500/20 text-left w-full"
                   >
                      <div className="absolute inset-0">
                         <img src={brand.image} alt={brand.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-6">
                         <div className="flex items-center justify-between mb-1">
                            <h3 className="font-russo text-2xl text-white">{brand.name}</h3>
                            <div className="p-2 bg-white/10 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                               <ArrowRight className="w-5 h-5 text-white" />
                            </div>
                         </div>
                         <p className="text-slate-300 text-sm font-medium border-l-2 border-teal-500 pl-2">{brand.slogan}</p>
                      </div>
                   </button>
                ))}
             </div>
          </div>
        )}

        {/* --- VIEW: LINE DETAILS (Voyages & Essentials) --- */}
        {view === 'line_view' && selectedBrand && (
           <div className="max-w-7xl mx-auto px-4 animate-fade-in">
              
              {/* Brand Header */}
              <div className="glass-panel rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                 <div className="z-10 text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                       <h2 className="font-russo text-3xl text-white">{selectedBrand.name}</h2>
                       <span className="px-2 py-0.5 rounded border border-white/20 text-xs text-white/70 bg-black/20">Selected</span>
                    </div>
                    <p className="text-slate-300 text-sm">{selectedBrand.slogan}</p>
                 </div>
                 <div className="z-10 w-full md:w-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                       type="text" 
                       placeholder="Search itineraries..." 
                       className="w-full md:w-64 bg-black/30 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
              </div>

              {/* Section: Voyages */}
              <div className="mb-12">
                 <h3 className="font-russo text-xl text-white mb-4 flex items-center gap-2"><Ship className="w-5 h-5 text-teal-400" /> Available Voyages</h3>
                 
                 {/* Horizontal Scroll on Mobile */}
                 <div className="flex flex-col gap-4">
                    {isLoading ? (
                       <div className="text-center py-12 text-slate-500">Loading voyages...</div>
                    ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredCruises.length > 0 ? filteredCruises.map(cruise => {
                             const isSaved = savedItems.find(i => i.id === cruise.id);
                             return (
                                <div key={cruise.id} className="glass-panel rounded-2xl overflow-hidden hover:border-teal-500/50 transition-all duration-300 group flex flex-col">
                                   <div className="h-48 relative overflow-hidden bg-slate-800">
                                      {cruise.realImage ? (
                                         <img src={cruise.realImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cruise.title} />
                                      ) : (
                                         <div className="w-full h-full flex items-center justify-center text-4xl">{cruise.image}</div>
                                      )}
                                      <button 
                                         onClick={() => toggleSave({ ...cruise, type: 'cruise' })}
                                         className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${isSaved ? 'bg-teal-500 text-white' : 'bg-black/30 text-white hover:bg-white hover:text-slate-900'}`}
                                      >
                                         {isSaved ? <Check className="w-4 h-4" /> : <ListPlus className="w-4 h-4" />}
                                      </button>
                                      <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-slate-900 to-transparent">
                                         <p className="text-white font-bold text-lg leading-none shadow-black drop-shadow-md">{cruise.title}</p>
                                      </div>
                                   </div>
                                   
                                   <div className="p-4 flex-grow flex flex-col">
                                      <div className="flex justify-between items-center mb-4">
                                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{cruise.ship}</span>
                                         <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-xs text-white">
                                            <Sun className="w-3 h-3 text-orange-400" /> {cruise.nights} Nights
                                         </div>
                                      </div>
                                      
                                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                         <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Starting From</p>
                                            <p className="text-xl font-russo text-white">${cruise.price}</p>
                                         </div>
                                         <a 
                                            href={cruise.affiliateLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-teal-900/20"
                                         >
                                            View Deal
                                         </a>
                                      </div>
                                   </div>
                                </div>
                             );
                          }) : (
                             <div className="col-span-full py-10 text-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
                                No voyages found matching criteria.
                             </div>
                          )}
                       </div>
                    )}
                 </div>
              </div>

              {/* Section: Experiences & Essentials Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                 
                 {/* Essentials */}
                 <div>
                    <h3 className="font-russo text-xl text-white mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-orange-400" /> Voyage Essentials</h3>
                    <div className="grid grid-cols-2 gap-4">
                       {MOCK_ESSENTIALS.map(item => {
                          const isSaved = savedItems.find(i => i.id === item.id);
                          return (
                             <div key={item.id} className="glass-panel p-3 rounded-xl flex items-center gap-3 relative group hover:bg-white/5 transition-colors">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl flex-shrink-0">{item.image}</div>
                                <div className="min-w-0 flex-grow">
                                   <p className="text-xs font-bold text-white truncate">{item.title}</p>
                                   <p className="text-[10px] text-slate-400">${item.price}</p>
                                </div>
                                <button 
                                   onClick={() => toggleSave({...item, type: 'essential'})}
                                   className={`p-1.5 rounded-full transition-colors ${isSaved ? 'text-teal-400' : 'text-slate-500 hover:text-white'}`}
                                >
                                   {isSaved ? <Check className="w-4 h-4" /> : <ListPlus className="w-4 h-4" />}
                                </button>
                             </div>
                          );
                       })}
                    </div>
                 </div>

                 {/* Experiences */}
                 <div>
                    <h3 className="font-russo text-xl text-white mb-4 flex items-center gap-2"><Palmtree className="w-5 h-5 text-green-400" /> Top Experiences</h3>
                    <div className="space-y-3">
                       {activities.slice(0, 3).map(activity => {
                          const isSaved = savedItems.find(i => i.id === activity.id);
                          return (
                             <div key={activity.id} className="glass-panel p-3 rounded-xl flex items-center gap-4 relative group hover:bg-white/5 transition-colors">
                                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-xl flex-shrink-0">{activity.image}</div>
                                <div className="flex-grow">
                                   <p className="text-sm font-bold text-white">{activity.title}</p>
                                   <p className="text-xs text-slate-400">{activity.port} • ${activity.price}</p>
                                </div>
                                <button 
                                   onClick={() => toggleSave({...activity, type: 'activity'})}
                                   className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${isSaved ? 'bg-teal-500/20 border-teal-500 text-teal-400' : 'border-slate-600 text-slate-400 hover:border-white hover:text-white'}`}
                                >
                                   {isSaved ? 'Added' : 'Add'}
                                </button>
                             </div>
                          );
                       })}
                    </div>
                 </div>

              </div>
           </div>
        )}

      </main>

      {/* --- Drawers --- */}
      <ListDrawer isOpen={showList} onClose={() => setShowList(false)} savedItems={savedItems} onRemove={(id) => setSavedItems(savedItems.filter(i => i.id !== id))} onEmail={handleEmail} />

    </div>
  );
}
