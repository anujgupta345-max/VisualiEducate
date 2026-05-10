
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AlertTriangle, RefreshCw, Globe, Filter, ChevronDown, ChevronUp,
  BookOpen, Briefcase, Users, Building2, Calendar, Scale, MessageCircle,
  CheckCircle2, ExternalLink, Loader2, Wifi, WifiOff, Info, Sparkles
} from 'lucide-react';
import { DailyBriefing, VisaCategory, VisaNewsItem } from './types';
import {
  fetchDailyVisaBriefing, COUNTRY_FLAGS, CATEGORY_META,
  SOURCE_META, SEVERITY_CONFIG
} from './services/visaNewsService';

// --- Constants ---

const ALL_COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Other'];

const CATEGORY_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  'student-visa':     (p) => <BookOpen {...p} />,
  'work-visa':        (p) => <Briefcase {...p} />,
  'family-visa':      (p) => <Users {...p} />,
  'embassy-update':   (p) => <Building2 {...p} />,
  'slot-availability':(p) => <Calendar {...p} />,
  'policy-change':    (p) => <Scale {...p} />,
  'community-story':  (p) => <MessageCircle {...p} />,
  'success-story':    (p) => <CheckCircle2 {...p} />,
};

const CATEGORIES: { id: string; label: string; emoji: string }[] = [
  { id: 'all',              label: 'All News',       emoji: '📰' },
  { id: 'student-visa',     label: 'Students',       emoji: '🎓' },
  { id: 'work-visa',        label: 'Work Visas',     emoji: '💼' },
  { id: 'family-visa',      label: 'Family',         emoji: '👨‍👩‍👧' },
  { id: 'embassy-update',   label: 'Embassy',        emoji: '🏛️' },
  { id: 'slot-availability',label: 'Slot Status',    emoji: '📅' },
  { id: 'policy-change',    label: 'Policy',         emoji: '⚖️' },
  { id: 'community-story',  label: 'Community',      emoji: '💬' },
  { id: 'success-story',    label: 'Success',        emoji: '✅' },
];

// --- Sub-components ---

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const cfg = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.info;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.badge}`}>
      {cfg.label}
    </span>
  );
};

const CategoryBadge: React.FC<{ category: VisaCategory }> = ({ category }) => {
  const meta = CATEGORY_META[category];
  if (!meta) return null;
  const Icon = CATEGORY_ICONS[category];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
      {Icon && <Icon size={11} />}
      {meta.label}
    </span>
  );
};

const SourceBadge: React.FC<{ sourceType: string; source: string }> = ({ sourceType, source }) => {
  const meta = SOURCE_META[sourceType] ?? SOURCE_META.news;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${meta.color}`}>
      {meta.label}: {source}
    </span>
  );
};

const NewsCard: React.FC<{ item: VisaNewsItem }> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.info;
  const flag = COUNTRY_FLAGS[item.country] ?? '🌍';

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden border-l-4 ${cfg.border} transition-shadow hover:shadow-md`}>
      <div className="p-4 space-y-3">
        {/* Top meta row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <SeverityBadge severity={item.severity} />
            <CategoryBadge category={item.category} />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
              {flag} {item.country}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-800 leading-snug">{item.title}</h3>

        {/* Summary */}
        <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>

        {/* Affected group */}
        {item.affectedGroup && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Users size={11} />
            <span className="italic">Affects: {item.affectedGroup}</span>
          </div>
        )}

        {/* Action Required (collapsible) */}
        {item.actionRequired && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Info size={12} />
              What to do
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {expanded && (
              <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-[11px] text-indigo-800 leading-relaxed">
                {item.actionRequired}
              </div>
            )}
          </div>
        )}

        {/* Tags + source */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 4).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500">
                #{tag}
              </span>
            ))}
          </div>
          <SourceBadge sourceType={item.sourceType} source={item.source} />
        </div>
      </div>
    </div>
  );
};

const AlertBanner: React.FC<{ alerts: VisaNewsItem[] }> = ({ alerts }) => {
  const [visible, setVisible] = useState(true);
  if (!visible || alerts.length === 0) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <AlertTriangle className="shrink-0 mt-0.5" size={18} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide mb-1">
            {alerts.length} Critical Alert{alerts.length > 1 ? 's' : ''} Today
          </p>
          <ul className="space-y-1">
            {alerts.map(a => (
              <li key={a.id} className="text-xs opacity-90 leading-snug">
                <span className="font-semibold">{COUNTRY_FLAGS[a.country] ?? '🌍'} {a.country}:</span>{' '}
                {a.title}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => setVisible(false)} className="shrink-0 text-white/70 hover:text-white text-lg leading-none">
          ×
        </button>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ briefing: DailyBriefing }> = ({ briefing }) => (
  <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-xl p-5 shadow-lg">
    <div className="flex items-center gap-2 mb-3">
      <Sparkles size={16} className="text-yellow-300" />
      <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">AI Daily Briefing</span>
    </div>
    <h2 className="text-base font-bold leading-snug mb-3">{briefing.headline}</h2>
    <p className="text-sm text-indigo-100 leading-relaxed">{briefing.executiveSummary}</p>
    <div className="mt-4 flex items-center gap-4 text-[11px] text-indigo-300">
      <span>{briefing.news.length} stories aggregated</span>
      <span>·</span>
      <span>{briefing.date}</span>
      <span>·</span>
      <span className="flex items-center gap-1"><Sparkles size={10} /> Powered by Gemini AI</span>
    </div>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
    <div className="relative">
      <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 w-5 h-5" />
    </div>
    <div className="text-center">
      <p className="font-semibold text-slate-700">Gathering latest visa news…</p>
      <p className="text-xs mt-1 text-slate-400">Searching Reddit, embassies, official sources &amp; more</p>
    </div>
  </div>
);

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
    <Filter size={32} />
    <p className="font-medium text-slate-600">No stories match your filters</p>
    <button onClick={onReset} className="text-sm text-indigo-600 hover:underline">Reset filters</button>
  </div>
);

// --- Main App ---

const App: React.FC = () => {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(ALL_COUNTRIES);
  const [showCountryFilter, setShowCountryFilter] = useState(false);

  const loadBriefing = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const data = await fetchDailyVisaBriefing();
      setBriefing(data);
    } catch {
      // service handles fallback internally
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { loadBriefing(); }, [loadBriefing]);

  const toggleCountry = (c: string) =>
    setSelectedCountries(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );

  const filteredNews = useMemo(() => {
    if (!briefing) return [];
    return briefing.news.filter(item => {
      const catOk = selectedCategory === 'all' || item.category === selectedCategory;
      const countryOk = selectedCountries.includes(item.country);
      return catOk && countryOk;
    });
  }, [briefing, selectedCategory, selectedCountries]);

  const severityCounts = useMemo(() => {
    if (!briefing) return {};
    return briefing.news.reduce<Record<string, number>>((acc, n) => {
      acc[n.severity] = (acc[n.severity] ?? 0) + 1;
      return acc;
    }, {});
  }, [briefing]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCountries(ALL_COUNTRIES);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2 rounded-lg shadow-md shadow-orange-200">
              <Globe className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-800 leading-none">
                🇮🇳 IndiaVisa Daily
              </h1>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">Visa intelligence for Indians</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats chips */}
            {briefing && !isLoading && (
              <div className="hidden md:flex items-center gap-2 text-[11px]">
                {Object.entries(severityCounts).map(([sev, cnt]) => {
                  const cfg = SEVERITY_CONFIG[sev];
                  return (
                    <span key={sev} className={`px-2 py-0.5 rounded-full font-semibold ${cfg.badge}`}>
                      {cnt} {sev}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Connection indicator */}
            <div className={`hidden md:flex items-center gap-1 text-[11px] ${briefing ? 'text-emerald-600' : 'text-slate-400'}`}>
              {briefing ? <Wifi size={13} /> : <WifiOff size={13} />}
              <span>{briefing ? 'Live' : 'Offline'}</span>
            </div>

            <button
              onClick={() => loadBriefing(true)}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      {/* Critical Alerts Banner */}
      {!isLoading && briefing && <AlertBanner alerts={briefing.criticalAlerts} />}

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">

        {isLoading ? (
          <LoadingState />
        ) : briefing ? (
          <>
            {/* Summary */}
            <SummaryCard briefing={briefing} />

            {/* Filters */}
            <div className="space-y-3">
              {/* Category tabs — horizontal scroll */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Country filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowCountryFilter(!showCountryFilter)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <Filter size={12} />
                  Countries ({selectedCountries.length}/{ALL_COUNTRIES.length})
                  {showCountryFilter ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {showCountryFilter && ALL_COUNTRIES.map(c => (
                  <button
                    key={c}
                    onClick={() => toggleCountry(c)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                      selectedCountries.includes(c)
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-500 border-slate-200 opacity-50'
                    }`}
                  >
                    {COUNTRY_FLAGS[c] ?? '🌍'} {c}
                  </button>
                ))}
              </div>

              {/* Results count */}
              <p className="text-[11px] text-slate-400">
                Showing <span className="font-semibold text-slate-600">{filteredNews.length}</span> of{' '}
                {briefing.news.length} stories · Last updated:{' '}
                {new Date(briefing.generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* News Grid */}
            {filteredNews.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredNews.map(item => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-indigo-400" />
            <span>Powered by <span className="font-semibold text-slate-600">Gemini AI</span> with Google Search grounding</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Sources: Reddit · US Embassy India · VFS Global · USCIS · UKVI · IRCC · News outlets</span>
          </div>
          <div className="flex items-center gap-1">
            <ExternalLink size={11} />
            <span>For informational purposes only. Consult a licensed immigration attorney.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
