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
  Mail,
  Map,
  Info
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

const DetailModal = ({ cruise, brand, activities, onClose, onSave, isSaved, onSaveActivity, savedActivityIds }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, itinerary, experiences, gear

  if (!cruise || !brand) return null;

  // Filter unique ports
  const uniquePorts = [...new Set(cruise.itinerary.filter(stop => 
    !stop.toLowerCase().includes('sea day') && 
    !stop.toLowerCase().includes('embark') &&
    !stop.toLowerCase().includes('disembark')
  ))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-5xl h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"><X className="w-6 h-6 text-slate-800" /></button>
        
        {/* Left Side: Visuals & Pricing (Fixed) */}
        <div className="w-full md:w-1/3 bg-slate-100 relative flex flex-col">
          <div className="relative flex-grow">
            <div className="absolute inset-0">
               {cruise.realImage ? <img src={cruise.realImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-9xl">{cruise.image}</div>}
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-6 left-6 text-white pr-6">
              <h2 className="font-russo text-3xl leading-none mb-1 shadow-black drop-shadow-md">{cruise.title}</h2>
              <p className="text-lg opacity-90">{cruise.ship}</p>
            </div>
          </div>
          <div className="bg-slate-900 text-white p-6">
             <div className="flex justify-between items-center mb-4">
               <div>
                 <p className="text-[10px] uppercase font-bold text-slate-400">Starting From</p>
                 <p className="text-3xl font-russo">${cruise.price}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                 <p className="font-bold flex items-center justify-end gap-1"><Sun className="w-4 h-4 text-orange-400" /> {cruise.nights} Nights</p>
               </div>
             </div>
             <div className="flex flex-col gap-2">
                <a href={cruise.affiliateLink} target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl font-bold text-white text-center shadow-lg hover:brightness-110 transition-all" style={{ backgroundColor: brand.color }}>
                  View Deal <ExternalLink className="w-4 h-4 inline ml-1" />
                </a>
                <button onClick={() => onSave(cruise)} className={`w-full py-3 rounded-xl font-bold border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm`}>
                  {isSaved ? <><Check className="w-4 h-4" /> Saved</> : <><ListPlus className="w-4 h-4" /> Save to List</>}
                </button>
             </div>
          </div>
        </div>

        {/* Right Side: Tabbed Content */}
        <div className="w-full md:w-2/3 flex flex-col bg-white">
          {/* Internal Navigation */}
          <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar">
             {[
               { id: 'overview', label: 'Overview', icon: Info },
               { id: 'itinerary', label: 'Itinerary', icon: Map },
               { id: 'experiences', label: 'Port Experiences', icon: Palmtree },
               { id: 'gear', label: 'Gear', icon: ShoppingBag }
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-teal-500 text-teal-600 bg-teal-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
               >
                 <tab.icon className="w-4 h-4" /> {tab.label}
               </button>
             ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8">
             {activeTab === 'overview' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-wrap gap-3">
                     <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {cruise.season}</div>
                     <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1"><MapPin className="w-3 h-3" /> {cruise.port}</div>
                  </div>
                  <div className="prose prose-sm text-slate-600">
                     <h3 className="font-russo text-lg text-slate-800 mb-2">About this Voyage</h3>
                     <p dangerouslySetInnerHTML={{ __html: cruise.description }}></p>
                  </div>
               </div>
             )}

             {activeTab === 'itinerary' && (
               <div className="space-y-6 animate-fade-in">
                  <h3 className="font-russo text-lg text-slate-800">Daily Schedule</h3>
                  <div className="relative pl-6 border-l-2 border-slate-100 space-y-8">
                    {cruise.itinerary.map((stop, i) => (
                      <div key={i} className="relative">
                         <div className="absolute -left-[29px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: brand.color }}></div>
                         <p className="text-xs font-bold text-slate-400 uppercase mb-1">Day {i + 1}</p>
                         <p className="text-slate-800 font-bold text-lg">{stop}</p>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {activeTab === 'experiences' && (
               <div className="space-y-8 animate-fade-in">
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 text-sm text-teal-800 mb-6">
                     Discover things to do in each port of call. Add them to your list to plan your perfect shore day.
                  </div>
                  
                  {uniquePorts.map(port => {
                     // Filter activities for this specific port
                     const portActivities = activities.filter(a => a.port && a.port.toLowerCase().includes(port.toLowerCase()));
                     
                     return (
                        <div key={port} className="border-b border-slate-100 pb-6 last:border-0">
                           <h4 className="font-russo text-lg text-slate-800 mb-4 flex items-center gap-2"><Anchor className="w-4 h-4 text-slate-400" /> {port}</h4>
                           {portActivities.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 {portActivities.map(act => {
                                    const isActSaved = savedActivityIds.includes(act.id);
                                    return (
                                       <div key={act.id} className="bg-white border border-slate-200 rounded-xl p-3 hover:shadow-md transition-all group">
                                          <div className="flex justify-between items-start mb-2">
                                             <div className="text-2xl bg-slate-50 w-10 h-10 rounded-lg flex items-center justify-center">{act.image}</div>
                                             <button onClick={() => onSaveActivity(act)} className={`p-1.5 rounded-full transition-colors ${isActSaved ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-teal-100 hover:text-teal-600'}`}>
                                                {isActSaved ? <Check className="w-4 h-4" /> : <ListPlus className="w-4 h-4" />}
                                             </button>
                                          </div>
                                          <h5 className="font-bold text-slate-800 text-sm leading-tight mb-2 line-clamp-2">{act.title}</h5>
                                          <div className="flex justify-between items-center text-xs">
                                             <span className="font-bold text-slate-500">${act.price}</span>
                                             <a href={act.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-bold hover:underline">Book &rarr;</a>
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           ) : (
                              <p className="text-sm text-slate-400 italic">No specific activities listed for this port yet.</p>
                           )}
                        </div>
                     );
                  })}
               </div>
             )}

             {activeTab === 'gear' && (
               <div className="animate-fade-in">
                  <h3 className="font-russo text-lg text-slate-800 mb-4">Packing Essentials</h3>
                  <div className="grid grid-cols-2 gap-4">
                     {cruise.amazonJson && cruise.amazonJson.map((item, idx) => (
                        <a key={idx} href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all flex items-center gap-3">
                           <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-2xl">🛍️</div>
                           <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-700 truncate">{item.title || 'Travel Item'}</p>
                              <p className="text-[10px] text-orange-500 font-bold mt-0.5">Amazon</p>
                           </div>
                        </a>
                     ))}
                     {(!cruise.amazonJson || cruise.amazonJson.length === 0) && (
                        <p className="col-span-2 text-sm text-slate-400">Check the main Essentials tab for general packing lists.</p>
                     )}
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CruiseExplorer() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [internalTab, setInternalTab] = useState('voyages'); // voyages, essentials
  const [showList, setShowList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data
  const [cruises, setCruises] = useState(MOCK_ITINERARIES);
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [essentials, setEssentials] = useState(MOCK_ESSENTIALS);
  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [viewingCruise, setViewingCruise] = useState(null);

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
            rating: post.acf?.rating,
            season: post.acf?.sailing_season || 'Year Round'
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
    setInternalTab('voyages');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedBrand(null);
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
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Russo+One&display=swap');
        .font-russo { font-family: 'Russo One', sans-serif; }
        .font-roboto { font-family: 'Roboto', sans-serif; }
        .bg-ocean-gradient { background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%); }
        .glass-panel { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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
             {selectedBrand && (
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
        {!selectedBrand && (
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

        {/* --- VIEW: LINE DETAILS (Condensing: Tabs for Voyages / Essentials) --- */}
        {selectedBrand && (
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
              </div>

              {/* Tabs for Condensing View */}
              <div className="flex gap-4 mb-6 border-b border-white/10">
                 <button 
                    onClick={() => setInternalTab('voyages')}
                    className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${internalTab === 'voyages' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                 >
                    Voyages
                 </button>
                 <button 
                    onClick={() => setInternalTab('essentials')}
                    className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${internalTab === 'essentials' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                 >
                    Essentials
                 </button>
              </div>

              {/* Tab Content: VOYAGES */}
              {internalTab === 'voyages' && (
                 <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-russo text-xl text-white flex items-center gap-2"><Ship className="w-5 h-5 text-teal-400" /> Available Voyages</h3>
                       <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <input 
                             type="text" 
                             placeholder="Search..." 
                             className="bg-black/30 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                          />
                       </div>
                    </div>
                    
                    {isLoading ? (
                       <div className="text-center py-12 text-slate-500">Loading voyages...</div>
                    ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                          {filteredCruises.length > 0 ? filteredCruises.map(cruise => {
                             const isSaved = savedItems.find(i => i.id === cruise.id);
                             return (
                                <div key={cruise.id} className="glass-panel rounded-2xl overflow-hidden hover:border-teal-500/50 transition-all duration-300 group flex flex-col">
                                   <div className="h-40 relative overflow-hidden bg-slate-800">
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
                                         <button 
                                            onClick={() => setViewingCruise(cruise)}
                                            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-teal-900/20"
                                         >
                                            View & Plan
                                         </button>
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
              )}

              {/* Tab Content: ESSENTIALS */}
              {internalTab === 'essentials' && (
                 <div className="animate-fade-in">
                    <h3 className="font-russo text-xl text-white mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-orange-400" /> Voyage Essentials</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
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
              )}
           </div>
        )}

      </main>

      {/* --- Drawers --- */}
      <ListDrawer isOpen={showList} onClose={() => setShowList(false)} savedItems={savedItems} onRemove={(id) => setSavedItems(savedItems.filter(i => i.id !== id))} onEmail={handleEmail} />
      
      {/* --- Detail Modal --- */}
      {viewingCruise && <DetailModal cruise={viewingCruise} brand={CRUISE_LINES.find(b => b.id === viewingCruise.lineId)} activities={activities} onClose={() => setViewingCruise(null)} onSave={toggleSave} isSaved={!!savedItems.find(c => c.id === viewingCruise.id)} onSaveActivity={toggleSave} savedActivityIds={savedItems.map(i => i.id)} />}

    </div>
  );
}
