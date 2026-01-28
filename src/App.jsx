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
  Globe,
  Star
} from 'lucide-react';

// --- CONFIGURATION ---
// Based on your CPT UI dump:
const WP_API_BASE = 'https://cruisytravel.com/wp-json/wp/v2';
const ENDPOINTS = {
  CRUISES: `${WP_API_BASE}/cruises?_embed&per_page=100`, // Plural slug usually
  ACTIVITIES: `${WP_API_BASE}/itineraries?_embed&per_page=100`,
  ESSENTIALS: `${WP_API_BASE}/amazon_essential?_embed&per_page=100` // Singular slug based on "Edit Amazon Essential"
};

const BRAND_COLOR = '#34a4b8';

// --- STATIC DATA ---
const CRUISE_LINES = [
  { id: 'virgin', name: 'Virgin Voyages', color: '#E10A1D', logo: 'V' },
  { id: 'royal', name: 'Royal Caribbean', color: '#005DAA', logo: 'R' },
  { id: 'carnival', name: 'Carnival', color: '#E31D2B', logo: 'C' },
  { id: 'celebrity', name: 'Celebrity', color: '#1A1F71', logo: 'X' },
  { id: 'norwegian', name: 'Norwegian', color: '#00A3E0', logo: 'N' },
  { id: 'disney', name: 'Disney', color: '#192C5E', logo: 'D' },
  { id: 'msc', name: 'MSC Cruises', color: '#003366', logo: 'M' },
  { id: 'viking', name: 'Viking', color: '#9d8b70', logo: 'Vk' },
  { id: 'princess', name: 'Princess', color: '#005696', logo: 'P' }
];

// --- HELPER FUNCTIONS ---
const getLineId = (name) => {
  if (!name) return 'other';
  const lower = name.toLowerCase();
  if (lower.includes('virgin')) return 'virgin';
  if (lower.includes('royal')) return 'royal';
  if (lower.includes('carnival')) return 'carnival';
  if (lower.includes('celebrity')) return 'celebrity';
  if (lower.includes('norwegian') || lower.includes('ncl')) return 'norwegian';
  if (lower.includes('disney')) return 'disney';
  if (lower.includes('msc')) return 'msc';
  if (lower.includes('viking')) return 'viking';
  if (lower.includes('princess')) return 'princess';
  return 'other';
};

const formatPrice = (price) => {
  if (!price) return '0';
  // Remove $ if user entered it in ACF, ensure it's a number string
  return price.toString().replace('$', '');
};

// --- COMPONENTS ---

// 1. Sidebar Navigation
const Sidebar = ({ activeTab, setActiveTab, cartCount }) => (
  <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col h-full fixed left-0 top-0 z-50 border-r border-slate-800">
    <div className="p-6 flex items-center gap-3">
      <div className="w-10 h-10 bg-[#34a4b8] rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-900/50">
        <Anchor className="w-6 h-6" />
      </div>
      <div>
        <h1 className="font-bold text-lg leading-none tracking-wide">CRUISY</h1>
        <span className="text-[10px] uppercase tracking-widest text-slate-400">Explorer</span>
      </div>
    </div>

    <nav className="flex-1 px-4 space-y-2 mt-4">
      <button onClick={() => setActiveTab('explore')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'explore' ? 'bg-[#34a4b8] text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        <Ship className="w-5 h-5" />
        <span className="font-medium text-sm">Voyages</span>
      </button>
      <button onClick={() => setActiveTab('essentials')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'essentials' ? 'bg-[#34a4b8] text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        <ShoppingBag className="w-5 h-5" />
        <span className="font-medium text-sm">Essentials</span>
      </button>
      <button onClick={() => setActiveTab('list')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'list' ? 'bg-[#34a4b8] text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        <div className="relative">
          <ListPlus className="w-5 h-5" />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>}
        </div>
        <span className="font-medium text-sm">My List ({cartCount})</span>
      </button>
    </nav>

    <div className="p-4 border-t border-slate-800">
      <a href="https://cruisytravel.com" className="flex items-center gap-2 text-xs text-slate-400 hover:text-[#34a4b8] transition-colors">
        <ArrowLeft className="w-3 h-3" /> Back to CruisyTravel.com
      </a>
    </div>
  </aside>
);

// 2. Mobile Navigation
const MobileNav = ({ activeTab, setActiveTab, cartCount }) => (
  <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 z-50 flex justify-around p-2 pb-safe">
    <button onClick={() => setActiveTab('explore')} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'explore' ? 'text-[#34a4b8]' : 'text-slate-500'}`}>
      <Ship className="w-6 h-6" />
      <span className="text-[10px] mt-1">Voyages</span>
    </button>
    <button onClick={() => setActiveTab('essentials')} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'essentials' ? 'text-[#34a4b8]' : 'text-slate-500'}`}>
      <ShoppingBag className="w-6 h-6" />
      <span className="text-[10px] mt-1">Shop</span>
    </button>
    <button onClick={() => setActiveTab('list')} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'list' ? 'text-[#34a4b8]' : 'text-slate-500'}`}>
      <div className="relative">
        <ListPlus className="w-6 h-6" />
        {cartCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>}
      </div>
      <span className="text-[10px] mt-1">List</span>
    </button>
  </div>
);

// 3. Detail Modal
const DetailModal = ({ item, type, onClose, onSave, isSaved, activities }) => {
  if (!item) return null;

  // Find Brand Color
  const brand = type === 'cruise' ? CRUISE_LINES.find(b => b.id === item.lineId) : null;
  const accentColor = brand ? brand.color : BRAND_COLOR;

  // Filter relevant activities for this cruise (Port Matching)
  const relevantActivities = type === 'cruise' && activities 
    ? activities.filter(act => {
        // Check if activity port matches any port in cruise itinerary
        // Note: Itinerary in WP comes as "ports_of_call" string usually
        if (!item.itinerary || !act.port) return false;
        const portString = Array.isArray(item.itinerary) ? item.itinerary.join(' ') : item.itinerary;
        return portString.toLowerCase().includes(act.port.toLowerCase());
      })
    : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-slate-50 w-full max-w-5xl h-[85vh] md:h-[90vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative" onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"><X className="w-5 h-5" /></button>

        {/* Media Column */}
        <div className="w-full md:w-5/12 h-64 md:h-auto relative bg-slate-200">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-slate-400">📷</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            {type === 'cruise' && <span className="px-2 py-1 rounded bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-white/10">{item.ship}</span>}
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">{item.title}</h2>
            
            <div className="flex gap-3 mt-4">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-white text-slate-900 rounded-xl font-bold text-center text-sm hover:bg-slate-100 transition-colors shadow-lg">
                View Deal <ExternalLink className="w-3 h-3 inline ml-1" />
              </a>
              <button onClick={() => onSave(item)} className={`px-4 rounded-xl border border-white/30 hover:bg-white/10 flex items-center justify-center text-white transition-colors ${isSaved ? 'bg-teal-500/50 border-teal-500' : ''}`}>
                {isSaved ? <Check className="w-5 h-5" /> : <ListPlus className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="w-full md:w-7/12 flex flex-col bg-white h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            
            {/* Cruise Specific Details */}
            {type === 'cruise' && (
              <>
                <div className="flex items-center gap-6 text-sm border-b border-slate-100 pb-6">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Price</p>
                    <p className="font-bold text-slate-900 text-lg">${item.price}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Duration</p>
                    <p className="font-bold text-slate-900 flex items-center gap-1"><Sun className="w-4 h-4 text-orange-400" /> {item.nights || 7} Nights</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Vibe</p>
                    <p className="font-bold text-slate-900">{item.vibe || 'Relaxing'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-3">About this Voyage</h3>
                  <div className="prose prose-sm text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.description || 'No description available.' }}></div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-4">Itinerary</h3>
                  <div className="space-y-4 relative pl-4 border-l-2 border-slate-100">
                    {Array.isArray(item.itinerary) && item.itinerary.map((port, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: accentColor }}></div>
                        <p className="text-sm font-medium text-slate-800">{port}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experiences Section */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                   <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                      <Palmtree className="w-5 h-5 text-teal-600" /> Experiences in Port
                   </h3>
                   {relevantActivities.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {relevantActivities.map(act => (
                            <a key={act.id} href={act.link} target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-xl border border-slate-200 hover:shadow-md transition-all flex items-center gap-3 group">
                               <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🎟️</div>
                               <div className="min-w-0">
                                  <p className="font-bold text-slate-800 text-xs truncate group-hover:text-teal-600">{act.title}</p>
                                  <p className="text-[10px] text-slate-500 uppercase">{act.port}</p>
                               </div>
                            </a>
                         ))}
                      </div>
                   ) : (
                      <p className="text-sm text-slate-400 italic">No specific shore excursions found for these ports in our database.</p>
                   )}
                </div>
              </>
            )}

            {/* Essential Specific Details */}
            {type === 'essential' && (
               <div>
                  <div className="flex items-center justify-between mb-6">
                     <span className="text-2xl font-bold text-slate-900">${item.price}</span>
                     <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">Amazon Essential</span>
                  </div>
                  <p className="text-slate-600 mb-6">This item has been curated by our travel experts as a must-have for your next cruise vacation.</p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-center transition-colors">
                     Buy on Amazon
                  </a>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function CruiseApp() {
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data
  const [cruises, setCruises] = useState([]);
  const [essentials, setEssentials] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // User State
  const [savedItems, setSavedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // For modal

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Load LocalStorage
    try {
      const saved = localStorage.getItem('cruisy_list_v2');
      if (saved) setSavedItems(JSON.parse(saved));
    } catch (e) { console.error('LS Error', e); }

    // 2. Fetch Data
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cruiseRes, essentialRes, activityRes] = await Promise.all([
          fetch(ENDPOINTS.CRUISES),
          fetch(ENDPOINTS.ESSENTIALS),
          fetch(ENDPOINTS.ACTIVITIES)
        ]);

        if (cruiseRes.ok) {
          const data = await cruiseRes.json();
          setCruises(data.map(p => ({
            id: p.id,
            type: 'cruise',
            title: p.title.rendered,
            lineId: getLineId(p.acf?.cruise_line),
            ship: p.acf?.ship_name || 'Cruise Ship',
            price: formatPrice(p.acf?.price),
            nights: p.acf?.nights || '7',
            itinerary: p.acf?.ports_of_call ? p.acf.ports_of_call.split(',').map(s => s.trim()) : [],
            image: p.acf?.main_image?.url || p.acf?.main_image || p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
            link: p.acf?.affiliate_link || '#',
            description: p.acf?.description || '',
            vibe: p.acf?.travel_vibe,
            rating: p.acf?.rating
          })));
        }

        if (essentialRes.ok) {
          const data = await essentialRes.json();
          setEssentials(data.map(p => ({
            id: p.id,
            type: 'essential',
            title: p.title.rendered,
            price: formatPrice(p.acf?.price),
            link: p.acf?.affiliate_link || '#',
            image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
          })));
        }

        if (activityRes.ok) {
          const data = await activityRes.json();
          setActivities(data.map(p => ({
            id: p.id,
            type: 'activity',
            title: p.title.rendered,
            port: p.acf?.port_name || 'Unknown',
            price: formatPrice(p.acf?.price),
            image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
            link: p.link // Or ACF link if you have one
          })));
        }

      } catch (err) {
        console.error("API Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('cruisy_list_v2', JSON.stringify(savedItems));
  }, [savedItems]);

  // --- ACTIONS ---
  const toggleSave = (item) => {
    const exists = savedItems.find(i => i.id === item.id);
    if (exists) setSavedItems(savedItems.filter(i => i.id !== item.id));
    else setSavedItems([...savedItems, item]);
  };

  const handleEmail = () => {
    const body = savedItems.map(i => `${i.title} - ${i.type === 'cruise' ? i.ship : '$'+i.price}`).join('\n');
    window.location.href = `mailto:?subject=My Cruisy List&body=${encodeURIComponent(body)}`;
  };

  // --- FILTERS ---
  const filteredCruises = cruises.filter(c => {
    if (selectedBrand && c.lineId !== selectedBrand.id) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.ship.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} cartCount={savedItems.length} />

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 ml-0 md:ml-64 relative flex flex-col h-full overflow-hidden">
        
        {/* Header (Desktop Only) */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 hidden md:flex items-center justify-between z-20">
           <h2 className="font-bold text-xl text-slate-800">
              {activeTab === 'explore' && 'Find Your Voyage'}
              {activeTab === 'essentials' && 'Travel Essentials'}
              {activeTab === 'list' && 'Your Suitcase'}
           </h2>
           
           {activeTab === 'explore' && (
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search ships..." 
                  className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#34a4b8]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
           )}
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
           
           {/* --- TAB: EXPLORE --- */}
           {activeTab === 'explore' && (
             <>
                {/* Brand Selector */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar">
                   <button 
                      onClick={() => setSelectedBrand(null)}
                      className={`flex-shrink-0 px-5 py-2 rounded-full font-bold text-sm transition-all border ${!selectedBrand ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                   >
                      All Lines
                   </button>
                   {CRUISE_LINES.map(brand => (
                      <button
                         key={brand.id}
                         onClick={() => setSelectedBrand(selectedBrand?.id === brand.id ? null : brand)}
                         className={`flex-shrink-0 px-5 py-2 rounded-full font-bold text-sm transition-all border ${selectedBrand?.id === brand.id ? 'bg-white shadow-md ring-2 ring-[#34a4b8] border-transparent' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                      >
                         {brand.name}
                      </button>
                   ))}
                </div>

                {/* Loading State */}
                {loading && (
                   <div className="flex flex-col items-center justify-center py-20 opacity-50">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#34a4b8]"></div>
                      <p className="mt-4 text-sm font-medium">Loading voyages...</p>
                   </div>
                )}

                {/* Cruise Grid */}
                {!loading && (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredCruises.length > 0 ? filteredCruises.map(cruise => {
                         const isSaved = savedItems.find(i => i.id === cruise.id);
                         const brand = CRUISE_LINES.find(b => b.id === cruise.lineId);
                         return (
                            <div key={cruise.id} onClick={() => setSelectedItem({ ...cruise, type: 'cruise' })} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full border border-slate-100">
                               <div className="relative h-48 bg-slate-200">
                                  {cruise.image ? (
                                     <img src={cruise.image} alt={cruise.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                  ) : (
                                     <div className="w-full h-full flex items-center justify-center text-4xl">🚢</div>
                                  )}
                                  <div className="absolute top-3 right-3">
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); toggleSave(cruise); }}
                                        className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-colors ${isSaved ? 'bg-[#34a4b8] text-white' : 'bg-white/90 text-slate-400 hover:text-[#34a4b8]'}`}
                                     >
                                        {isSaved ? <Check className="w-4 h-4" /> : <ListPlus className="w-4 h-4" />}
                                     </button>
                                  </div>
                                  {brand && <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase">{brand.name}</div>}
                               </div>
                               <div className="p-4 flex flex-col flex-1">
                                  <h3 className="font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{cruise.title}</h3>
                                  <p className="text-xs text-slate-500 mb-4">{cruise.ship}</p>
                                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                     <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">From</p>
                                        <p className="text-lg font-bold text-slate-800">${cruise.price}</p>
                                     </div>
                                     <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded text-xs font-bold text-slate-600">
                                        <Sun className="w-3 h-3 text-orange-400" /> {cruise.nights} Nights
                                     </div>
                                  </div>
                               </div>
                            </div>
                         );
                      }) : (
                         <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-400">No cruises found.</p>
                         </div>
                      )}
                   </div>
                )}
             </>
           )}

           {/* --- TAB: ESSENTIALS --- */}
           {activeTab === 'essentials' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {essentials.map(item => {
                    const isSaved = savedItems.find(i => i.id === item.id);
                    return (
                       <div key={item.id} onClick={() => setSelectedItem({ ...item, type: 'essential' })} className="bg-white rounded-xl p-4 border border-slate-100 hover:shadow-lg transition-all cursor-pointer group">
                          <div className="aspect-square bg-slate-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                             {item.image ? <img src={item.image} className="w-full h-full object-cover mix-blend-multiply" /> : <span className="text-2xl">🛍️</span>}
                             <button 
                                onClick={(e) => { e.stopPropagation(); toggleSave(item); }}
                                className={`absolute top-2 right-2 p-1.5 rounded-full z-10 transition-colors ${isSaved ? 'bg-[#34a4b8] text-white' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}
                             >
                                {isSaved ? <Check className="w-3 h-3" /> : <ListPlus className="w-3 h-3" />}
                             </button>
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 mb-2 min-h-[2.5em]">{item.title}</h4>
                          <p className="font-bold text-[#34a4b8]">${item.price}</p>
                       </div>
                    );
                 })}
              </div>
           )}

           {/* --- TAB: LIST --- */}
           {activeTab === 'list' && (
              <div className="max-w-3xl mx-auto">
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                       <h3 className="font-bold text-lg text-slate-800">Your Voyage List</h3>
                       <button onClick={handleEmail} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-2">
                          <Mail className="w-3 h-3" /> Email to Me
                       </button>
                    </div>
                    <div className="divide-y divide-slate-100">
                       {savedItems.length === 0 ? (
                          <div className="p-12 text-center text-slate-400">Your list is empty. Go explore!</div>
                       ) : savedItems.map(item => (
                          <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                             <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
                                {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : null}
                             </div>
                             <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 truncate">{item.title}</h4>
                                <p className="text-xs text-slate-500 uppercase">{item.type}</p>
                             </div>
                             <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#34a4b8] hover:underline">View</a>
                             <button onClick={() => toggleSave(item)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           )}

        </div>
      </main>

      {/* --- MOBILE NAV --- */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} cartCount={savedItems.length} />

      {/* --- MODAL --- */}
      <DetailModal 
         item={selectedItem} 
         type={selectedItem?.type} 
         activities={activities}
         isSaved={selectedItem && !!savedItems.find(i => i.id === selectedItem.id)}
         onSave={toggleSave}
         onClose={() => setSelectedItem(null)} 
      />

    </div>
  );
}
