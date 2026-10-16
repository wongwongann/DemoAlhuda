import React, { useState } from 'react';
import { Search, Filter, Calendar, User, Eye, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { NewsItem, UnitType } from '../types';
import { NewsCard, getUnitBadge } from '../components/common/NewsCard';
import { EmptyState } from '../components/common/EmptyState';
import { contentFor, sectionIsVisible } from '../data/siteContent';
import type { SiteContentRecord } from '../types';

interface NewsPageProps {
  newsList: NewsItem[];
  selectedNews: NewsItem | null;
  onSelectNews: (news: NewsItem | null) => void;
  siteContent: SiteContentRecord[];
}

export const NewsPage: React.FC<NewsPageProps> = ({
  newsList,
  selectedNews,
  onSelectNews,
  siteContent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<'all' | 'yayasan' | 'smp' | 'pondok'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showEmptyState, setShowEmptyState] = useState(false);

  const page = contentFor('news.page', siteContent);
  const categories = ['all', ...new Set(newsList.map(item => item.category.trim()).filter(Boolean).sort((a, b) => a.localeCompare(b, 'id')))];

  const filteredNews = newsList.filter((item) => {
    const matchUnit = selectedUnit === 'all' || item.unit === selectedUnit;
    const matchCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchUnit && matchCategory && matchSearch;
  });

  // DETAIL VIEW
  if (selectedNews) {
    const badge = getUnitBadge(selectedNews.unit);
    const formattedDate = new Date(selectedNews.publishDate).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
        {/* Back Button */}
        <button
          onClick={() => onSelectNews(null)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {page.backLabel}
        </button>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}></span>
              {badge.label}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              {selectedNews.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-slate-900 leading-snug">
            {selectedNews.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                Oleh: {selectedNews.author}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                {selectedNews.views || 240} pembaca
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-[16/9] bg-slate-100">
          <img
            src={selectedNews.imageUrl}
            alt={selectedNews.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
          <p className="font-semibold text-slate-900 text-base sm:text-lg leading-relaxed border-l-4 border-emerald-700 pl-4 bg-slate-50 py-2 rounded-r-lg">
            {selectedNews.excerpt}
          </p>

          <div className="whitespace-pre-line text-slate-700 space-y-4 pt-2">
            {selectedNews.content}
          </div>
        </div>

        {/* Share & Feedback */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => onSelectNews(null)}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            ← Kembali ke Semua Artikel
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Tautan berita berhasil disalin!');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            {page.shareLabel}
          </button>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="w-full space-y-10 pb-20">
      {/* Banner */}
      {sectionIsVisible('news.page', siteContent) && <section className="bg-gradient-to-b from-emerald-950 to-[#0c3327] text-white py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <span className="inline-block px-3 py-1 bg-emerald-800 text-emerald-200 text-xs font-semibold rounded-full border border-emerald-600/40">
            {page.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">
            {page.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            {page.description}
          </p>
        </div>
      </section>}

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Unit Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Semua Unit' },
              { id: 'yayasan', label: 'Yayasan' },
              { id: 'smp', label: 'SMP Al-Huda' },
              { id: 'pondok', label: 'Pondok Pesantren' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedUnit(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedUnit === tab.id
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={page.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>

          {/* Empty state simulation toggle */}
          
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap">{page.categoryLabel}:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'all' ? page.allCategoriesLabel : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {showEmptyState || filteredNews.length === 0 ? (
          <EmptyState
            title={page.emptyTitle}
            description={page.emptyDescription}
            icon="search"
            onResetData={() => {
              setShowEmptyState(false);
              setSearchTerm('');
              setSelectedUnit('all');
              setSelectedCategory('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} news={item} onClick={onSelectNews} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

