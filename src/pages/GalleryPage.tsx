import React, { useState } from 'react';
import { Image, Video, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { GalleryItem, UnitType } from '../types';
import { GalleryCard } from '../components/common/GalleryCard';
import { Lightbox } from '../components/common/Lightbox';
import { EmptyState } from '../components/common/EmptyState';
import { contentFor, sectionIsVisible } from '../data/siteContent';
import type { SiteContentRecord } from '../types';

interface GalleryPageProps {
  galleryList: GalleryItem[];
  siteContent: SiteContentRecord[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ galleryList, siteContent }) => {
  const [selectedUnit, setSelectedUnit] = useState<'all' | 'yayasan' | 'smp' | 'pondok'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const page = contentFor('gallery.page', siteContent);
  const categories: string[] = ['all', ...Array.from(new Set<string>(galleryList.map(item => item.category)))].sort((a, b) => a.localeCompare(b, 'id'));

  const filteredItems = galleryList.filter((item) => {
    const matchUnit = selectedUnit === 'all' || item.unit === selectedUnit;
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchType = selectedType === 'all' || item.type === selectedType;
    return matchUnit && matchCat && matchType;
  });

  return (
    <div className="w-full space-y-10 pb-20">
      {/* Banner */}
      {sectionIsVisible('gallery.page', siteContent) && <section className="bg-gradient-to-b from-emerald-950 to-[#0c3327] text-white py-14 px-4 sm:px-6 relative overflow-hidden">
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

      {/* Filters Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Unit Filters */}
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

          {/* Media Type Filter */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-slate-200 p-1 bg-slate-50">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedType === 'all' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedType('image')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                  selectedType === 'image' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                Foto
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                  selectedType === 'video' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                Video
              </button>
            </div>

            {/* Empty state simulation */}
            
          </div>
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
              {cat === 'all' ? page.allCategoriesLabel : cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {showEmptyState || filteredItems.length === 0 ? (
          <EmptyState
            title={page.emptyTitle}
            description={page.emptyDescription}
            onResetData={() => {
              setShowEmptyState(false);
              setSelectedUnit('all');
              setSelectedCategory('all');
              setSelectedType('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={(it) => setActiveLightboxItem(it)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <Lightbox
        item={activeLightboxItem}
        items={filteredItems}
        onClose={() => setActiveLightboxItem(null)}
        onSelect={(it) => setActiveLightboxItem(it)}
      />
    </div>
  );
};

