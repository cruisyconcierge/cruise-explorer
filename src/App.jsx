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
  Star,
  Play,
  Clock,
  Heart
} from 'lucide-react';

// --- CONFIGURATION ---
const WP_API_BASE = 'https://cruisytravel.com/wp-json/wp/v2';
const ENDPOINTS = {
  CRUISES: `${WP_API_BASE}/cruises?_embed&per_page=100`, 
  ACTIVITIES: `${WP_API_BASE}/itineraries?_embed&per_page=100`,
  ESSENTIALS: `${WP_API_BASE}/amazon_essential?_embed&per_page=100` 
};

const BRAND_COLOR = '#34a4b8';
const LOGO_URL = 'https://cruisytravel.com/wp-content/uploads/2024/01/cropped-20240120_025955_0000.png';

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

// Updated Hero Image
const HERO_IMAGE_URL = "https://images.pexels.com/photos/4092994/pexels-photo-4092994.jpeg?auto=compress&cs=tinysrgb&w=1600";
// Stock Ocean Image for Detail View (High Quality)
const DETAIL_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1200";

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
  return price.toString().replace('$', '');
};

// --- COMPONENTS ---

const ImageHero = () => {
  return (
    <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-b-3xl shadow-lg mb-6 group bg-slate-800">
      <img 
        src={HERO_IMAGE_URL} 
        alt="Luxury liners sailing"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-xl shadow-xl mb-2 transform transition-transform hover:scale-105">
          <h1 className="font-russo text-2xl md:text-3xl text-white tracking-wide drop-shadow-lg uppercase">
            Cruise Explorer
          </h1>
        </div>
        <p className="text-white/90 text-sm md:text-base font-roboto font-medium max-w-lg drop-shadow-md">
          Discover voyages, find experiences, and pack like a pro.
        </p>
      </div>
    </div>
  );
};

// 1. Sidebar Navigation
const Sidebar = ({ activeTab, setActiveTab, cartCount }) => (
  <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col h-full fixed left-0 top-0 z-50 border-r border-slate-800">
    <div className="p-6 flex items-center gap-3">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden border-2 border-[#34a4b8]">
        <img src={LOGO_URL} alt="Cruisy Travel" className="w-full h-full object-cover" />
      </div>
      <div>
        <h1 className="font-russo text-lg leading-none tracking-wide text-white">Cruisy <span style={{ color: BRAND_COLOR }}>Travel</span></h1>
      </div>
    </div>

    <nav className="flex-1 px-4 space-y-2 mt-4 font-roboto">
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

    <div className="p-4 border-t border-slate-800 font-roboto">
      <a href="https://cruisytravel.com" className="flex items-center gap-2 text-xs text-slate-400 hover:text-[#34a4b8] transition-colors">
        <ArrowLeft className="w-3 h-3" /> Back to CruisyTravel.com
      </a>
    </div>
  </aside>
);

// 2. Mobile Navigation
const MobileNav = ({ activeTab, setActiveTab, cartCount }) => (
  <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 z-50 flex justify-around p-2 pb-safe font-roboto">
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
  const [activeTab, setActiveTab] = useState('overview'); // overview, itinerary, experiences, gear

  if (!item) return null;

  const brand = type === 'cruise' ? CRUISE_LINES.find(b => b.id === item.lineId) : null;
  const accentColor = brand ? brand.color : BRAND_COLOR;

  // --- SMART EXPERIENCE MATCHING ---
  const relevantActivities = type === 'cruise' && activities 
    ? activities.filter(act => {
        const matchSource = (item.portKeywords && item.portKeywords.length > 0) 
            ? item.portKeywords 
            : item.itinerary;

        if (!matchSource || !act.port) return false;
        
        const actPort = act.port.toLowerCase().trim();
        if (actPort === 'destination' || actPort === 'unknown') return false; 

        return matchSource.some(cruisePortString => {
            const cPort = cruisePortString.toLowerCase().trim();
            return cPort.includes(actPort) || actPort.includes(cPort);
        });
      })
    : [];

  // Filter unique ports for display - Logic improved to handle duplicates and case sensitivity
  const uniquePorts = Array.isArray(item.itinerary) 
    ? [...new Set(item.itinerary
        .filter(stop => {
          if (!stop) return false;
          const s = stop.toLowerCase();
          return !s.includes('sea day') && !s.includes('embark') && !s.includes('disembark');
        })
      )] 
    : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-slate-50 w-full max-w-5xl h-[85vh] md:h-[90vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative font-roboto" onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"><X className="w-5 h-5" /></button>

        <div className="w-full md:w-5/12 h-64 md:h-auto relative bg-slate-900">
          {/* Always use high quality stock image for detail header for better aesthetic */}
          <img src={DETAIL_FALLBACK_IMAGE} alt={item.title} className="w-full h-full object-cover opacity-90" />
          
          {/* Brand Color Overlay & Blur */}
          <div className="absolute inset-0 bg-[#34a4b8]/30 backdrop-blur-[2px]"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            {type === 'cruise' && <span className="px-2 py-1 rounded bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-white/10">{item.ship}</span>}
            <h2 className="font-russo text-2xl md:text-3xl leading-tight mb-2 text-white drop-shadow-md">{item.title}</h2>
            
            <div className="flex gap-3 mt-4">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-white text-slate-900 rounded-xl font-bold text-center text-sm hover:bg-slate-100 transition-colors shadow-lg flex items-center justify-center">
                View Deal <ExternalLink className="w-3 h-3 inline ml-1" />
              </a>
              <button 
                onClick={() => onSave(item)} 
                className={`px-4 rounded-xl font-bold flex items-center justify-center transition-colors shadow-lg border border-white/20 ${isSaved ? 'bg-white text-red-500 hover:bg-red-50' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'}`}
              >
                <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 flex flex-col bg-white h-full overflow-hidden">
          {/* Tabs */}
          {type === 'cruise' && (
            <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar">
               {[
                 { id: 'overview', label: 'Overview', icon: Star },
                 { id: 'itinerary', label: 'Itinerary', icon: MapPin },
                 { id: 'experiences', label: 'Experiences', icon: Palmtree },
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
          )}

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            
            {type === 'cruise' && (
              <>
                {activeTab === 'overview' && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-6 text-sm border-b border-slate-100 pb-6 mb-6">
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase">Price</p>
                        <p className="font-bold text-slate-900 text-lg font-russo">${item.price}</p>
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
                      <h3 className="font-russo text-slate-900 text-lg mb-3">About this Voyage</h3>
                      <div className="prose prose-sm text-slate-600 leading-relaxed font-roboto" dangerouslySetInnerHTML={{ __html: item.description || 'No description available.' }}></div>
                    </div>

                    <div className="mt-8">
                      <h3 className="font-russo text-slate-900 text-lg mb-3">Ports of Call</h3>
                      <div className="flex flex-wrap gap-2">
                        {uniquePorts.length > 0 ? uniquePorts.map(port => (
                          <button 
                            key={port} 
                            onClick={() => setActiveTab('experiences')}
                            className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-100 hover:bg-teal-100 transition-colors flex items-center gap-1"
                          >
                            <Anchor className="w-3 h-3" /> {port}
                          </button>
                        )) : <p className="text-sm text-slate-400">See itinerary for details.</p>}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="space-y-4 relative pl-4 border-l-2 border-slate-100 animate-fade-in">
                    {Array.isArray(item.itinerary) && item.itinerary.map((port, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: accentColor }}></div>
                        <p className="text-base font-bold text-teal-700">{port}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase">Day {i + 1}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'experiences' && (
                  <div className="animate-fade-in">
                     <h3 className="font-russo text-slate-900 text-lg mb-4 flex items-center gap-2">
                        <Palmtree className="w-5 h-5 text-teal-600" /> Experiences in Port
                     </h3>
                     <p className="text-sm text-slate-500 mb-6">Explore curated activities for your stops.</p>
                     
                     {relevantActivities.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {relevantActivities.map(act => (
                              <a key={act.id} href={act.link} target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-xl border border-slate-200 hover:shadow-md transition-all flex flex-col gap-2 group">
                                 <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🎟️</div>
                                    <span className="text-xs font-black uppercase text-teal-600 tracking-wide bg-teal-50 px-2 py-1 rounded">{act.port}</span>
                                 </div>
                                 <div className="min-w-0">
                                    <p className="font-bold text-slate-800 text-xs line-clamp-2 group-hover:text-teal-600">{act.title}</p>
                                    {(act.category || act.duration) && (
                                      <p className="text-[10px] text-slate-500 mt-1">
                                        {act.category} {act.duration && `• ${act.duration}`}
                                      </p>
                                    )}
                                 </div>
                                 <div className="mt-auto pt-2 border-t border-slate-50 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-700">${act.price}</span>
                                    <span className="text-[10px] font-bold text-teal-600 hover:underline flex items-center gap-1">Book <ExternalLink className="w-3 h-3" /></span>
                                 </div>
                              </a>
                           ))}
                        </div>
                     ) : (
                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                           <Anchor className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                           <p className="text-sm text-slate-400 italic">No specific shore excursions found for these ports in our database.</p>
                        </div>
                     )}
                  </div>
                )}

                {activeTab === 'gear' && (
                   <div className="animate-fade-in">
                      <h3 className="font-russo text-slate-900 text-lg mb-4 flex items-center gap-2">
                         <ShoppingBag className="w-5 h-5 text-orange-500" /> Recommended Gear
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                         {item.amazonJson && item.amazonJson.map((gear, idx) => (
                            <a key={idx} href={gear.link || '#'} target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-sm transition-all flex items-center gap-3">
                               <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-2xl">🛍️</div>
                               <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-700 truncate">{gear.title || 'Travel Item'}</p>
                                  <p className="text-[10px] text-orange-500 font-bold mt-0.5">Amazon</p>
                               </div>
                            </a>
                         ))}
                         {(!item.amazonJson || item.amazonJson.length === 0) && (
                            <p className="col-span-2 text-sm text-slate-400">Check the main Essentials tab for general packing lists.</p>
                         )}
                      </div>
                   </div>
                )}
              </>
            )}

            {type === 'essential' && (
               <div>
                  <div className="flex items-center justify-between mb-6">
                     <span className="text-2xl font-bold text-slate-900 font-russo">${item.price}</span>
                     <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">Amazon Essential</span>
                  </div>
                  <p className="text-slate-600 mb-6 font-roboto">This item has been curated by our travel experts as a must-have for your next cruise vacation.</p>
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
  const [selectedItem, setSelectedItem] = useState(null); 

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cruisy_list_v2');
      if (saved) setSavedItems(JSON.parse(saved));
    } catch (e) { console.error('LS Error', e); }

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
          setCruises(data.map(p => {
            let imgUrl = null;
            if (p.acf?.main_image) {
                if (typeof p.acf.main_image === 'string') imgUrl = p.acf.main_image;
                else if (p.acf.main_image.url) imgUrl = p.acf.main_image.url;
            }
            if (!imgUrl && p._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
                imgUrl = p._embedded['wp:featuredmedia'][0].source_url;
            }

            // Split ports by comma OR newline, handle potential carriage returns or HTML breaks
            // Priority: 'ports_csv' (ACF) > 'ports_of_call' (ACF)
            const rawPorts = p.acf?.ports_csv || p.acf?.ports_of_call || '';
            const cleanPorts = rawPorts.replace(/<br\s*\/?>/gi, '\n');
            const portsList = cleanPorts.split(/\r\n|\r|\n|,/).map(s => s.trim()).filter(s => s.length > 0);

            // Fetch 'port_keywords' for smart matching if available
            const rawKeywords = p.acf?.port_keywords || '';
            const keywordsList = rawKeywords.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);

            return {
              id: p.id,
              type: 'cruise',
              title: p.title.rendered,
              lineId: getLineId(p.acf?.cruise_line),
              ship: p.acf?.ship_name || 'Cruise Ship',
              price: formatPrice(p.acf?.price),
              nights: p.acf?.nights || '7',
              itinerary: portsList,
              portKeywords: keywordsList.length > 0 ? keywordsList : null, // Store keywords
              realImage: imgUrl,
              link: p.acf?.affiliate_link || '#',
              description: p.acf?.description || '',
              vibe: p.acf?.travel_vibe,
              rating: p.acf?.rating,
              amazonJson: p.acf?.amazon_json ? JSON.parse(p.acf.amazon_json) : []
            };
          }));
        }

        if (essentialRes.ok) {
          const data = await essentialRes.json();
          setEssentials(data.map(p => {
             let imgUrl = null;
             if (p._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
                 imgUrl = p._embedded['wp:featuredmedia'][0].source_url;
             }
             return {
                id: p.id,
                type: 'essential',
                title: p.title.rendered,
                price: formatPrice(p.acf?.price),
                link: p.acf?.affiliate_link || '#',
                realImage: imgUrl
             };
          }));
        }

        if (activityRes.ok) {
          const data = await activityRes.json();
          setActivities(data.map(post => {
            let portName = post.acf?.destination_tag;
            
            if (!portName) {
                const lowerTitle = post.title.rendered.toLowerCase();
                if (lowerTitle.includes('key west')) portName = 'Key West';
                else if (lowerTitle.includes('cozumel')) portName = 'Cozumel';
                else if (lowerTitle.includes('nassau')) portName = 'Nassau';
                else if (lowerTitle.includes('st thomas') || lowerTitle.includes('st. thomas')) portName = 'St Thomas';
                else if (lowerTitle.includes('miami')) portName = 'Miami';
                else if (lowerTitle.includes('honolulu')) portName = 'Honolulu';
                else portName = 'Destination'; 
            }

            return {
              id: post.id,
              type: 'activity',
              title: post.title.rendered,
              port: portName,
              price: formatPrice(post.acf?.price),
              image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
              link: post.acf?.booking_url || post.link, 
              category: post.acf?.category,
              duration: post.acf?.duration
            };
          }));
        }

      } catch (err) {
        console.error("API Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cruisy_list_v2', JSON.stringify(savedItems));
  }, [savedItems]);

  const toggleSave = (item) => {
    const exists = savedItems.find(i => i.id === item.id);
    if (exists) setSavedItems(savedItems.filter(i => i.id !== item.id));
    else setSavedItems([...savedItems, item]);
  };

  const handleEmail = () => {
    const body = savedItems.map(i => `${i.title} - ${i.type === 'cruise' ? i.ship : '$'+i.price}`).join('\n');
    window.location.href = `mailto:?subject=My Cruisy List&body=${encodeURIComponent(body)}`;
  };

  const filteredCruises = cruises.filter(c => {
    if (selectedBrand && c.lineId !== selectedBrand.id) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.ship.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-slate-100 font-roboto text-slate-800 overflow-hidden">
      
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

      {/* --- Sidebar --- */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} cartCount={savedItems.length} />

      {/* --- Content Area --- */}
      <main className="flex-1 ml-0 md:ml-64 relative flex flex-col h-full overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center z-20">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#34a4b8]">
                 <img src={LOGO_URL} alt="Cruisy" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-russo text-lg text-slate-900">Cruisy <span style={{ color: BRAND_COLOR }}>Travel</span></h1>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
           
           {/* --- TAB: EXPLORE --- */}
           {activeTab === 'explore' && (
             <>
                <ImageHero />

                {/* Brand Selector */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar">
                   <button 
                      onClick={() => setSelectedBrand(null)}
                      className={`flex-shrink-0 px-5 py-2 rounded-full font-bold text-sm transition-all border font-roboto ${!selectedBrand ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                   >
                      All Lines
                   </button>
                   {CRUISE_LINES.map(brand => (
                      <button
                         key={brand.id}
                         onClick={() => setSelectedBrand(selectedBrand?.id === brand.id ? null : brand)}
                         className={`flex-shrink-0 px-5 py-2 rounded-full font-bold text-sm transition-all border font-roboto ${selectedBrand?.id === brand.id ? 'bg-white shadow-md ring-2 ring-[#34a4b8] border-transparent' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                      >
                         {brand.name}
                      </button>
                   ))}
                </div>

                {/* Search */}
                <div className="relative mb-8">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="Search ships, destinations..." 
                     className="w-full pl-12 pr-4 py-3 bg-white rounded-xl shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#34a4b8] transition-all font-roboto"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>

                {/* Loading State */}
                {loading && (
                   <div className="flex flex-col items-center justify-center py-20 opacity-50">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#34a4b8]"></div>
                      <p className="mt-4 text-sm font-medium font-roboto">Loading voyages...</p>
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
                                  {cruise.realImage ? (
                                     <img src={cruise.realImage} alt={cruise.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
                                  {brand && <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase font-roboto">{brand.name}</div>}
                               </div>
                               <div className="p-4 flex flex-col flex-1">
                                  <h3 className="font-bold text-slate-900 leading-tight mb-1 line-clamp-2 font-roboto">{cruise.title}</h3>
                                  <p className="text-xs text-slate-500 mb-4 font-roboto">{cruise.ship}</p>
                                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                     <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold font-roboto">From</p>
                                        <p className="text-lg font-bold text-slate-800 font-russo">${cruise.price}</p>
                                     </div>
                                     <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded text-xs font-bold text-slate-600 font-roboto">
                                        <Sun className="w-3 h-3 text-orange-400" /> {cruise.nights} Nights
                                     </div>
                                  </div>
                                </div>
                            </div>
                         );
                      }) : (
                         <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl font-roboto">
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
                             {item.realImage ? <img src={item.realImage} className="w-full h-full object-cover mix-blend-multiply" /> : <span className="text-2xl">🛍️</span>}
                             <button 
                                onClick={(e) => { e.stopPropagation(); toggleSave(item); }}
                                className={`absolute top-2 right-2 p-1.5 rounded-full z-10 transition-colors ${isSaved ? 'bg-[#34a4b8] text-white' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}
                             >
                                {isSaved ? <Check className="w-3 h-3" /> : <ListPlus className="w-3 h-3" />}
                             </button>
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 mb-2 min-h-[2.5em] font-roboto">{item.title}</h4>
                          <p className="font-bold text-[#34a4b8] font-roboto">${item.price}</p>
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
                       <h3 className="font-bold text-lg text-slate-800 font-russo">Your Voyage List</h3>
                       <button onClick={handleEmail} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-2 font-roboto">
                          <Mail className="w-3 h-3" /> Email to Me
                       </button>
                    </div>
                    <div className="divide-y divide-slate-100">
                       {savedItems.length === 0 ? (
                          <div className="p-12 text-center text-slate-400 font-roboto">Your list is empty. Go explore!</div>
                       ) : savedItems.map(item => (
                          <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                             <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
                                {item.realImage ? <img src={item.realImage} className="w-full h-full object-cover" /> : null}
                             </div>
                             <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 truncate font-roboto">{item.title}</h4>
                                <p className="text-xs text-slate-500 uppercase font-roboto">{item.type}</p>
                             </div>
                             <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#34a4b8] hover:underline font-roboto">View</a>
                             <button onClick={() => toggleSave(item)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           )}

        </div>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} cartCount={savedItems.length} />

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
