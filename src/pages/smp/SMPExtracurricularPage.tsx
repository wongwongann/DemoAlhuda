import React, { useState } from 'react';
import { Award, Clock, User, Sparkles, Filter } from 'lucide-react';
import type { SiteContentRecord } from '../../types';
import { collectionFor, contentFor, sectionIsVisible } from '../../data/siteContent';
import { EmptyState } from '../../components/common/EmptyState';

export const SMPExtracurricularPage: React.FC<{ siteContent: SiteContentRecord[] }> = ({ siteContent }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const content = contentFor('smp.extracurricular', siteContent);
  const items = collectionFor('smp.extracurricular', 'items', siteContent);

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Banner */}
      {sectionIsVisible('smp.extracurricular', siteContent) && <><section className="bg-gradient-to-b from-blue-950 to-[#0c1f3d] text-white py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-smp-pattern opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <span className="inline-block px-3 py-1 bg-blue-800 text-blue-200 text-xs font-semibold rounded-full border border-blue-600/40">
            {content.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">
            {content.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            {content.description}
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'Semua Ekstrakurikuler' },
              { id: 'keagamaan', label: 'Kepanduan & Agama' },
              { id: 'seni_budaya', label: 'Seni Musik & Hadrah' },
              { id: 'olahraga', label: 'Olahraga & Silat' },
              { id: 'akademik_it', label: 'Sains & Bahasa' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowEmptyState(!showEmptyState)}
            className="text-[11px] px-2.5 py-1.5 rounded-lg border border-dashed border-slate-300 text-slate-500 hover:text-blue-900"
          >
            {showEmptyState ? 'Reset' : 'Empty State'}
          </button>
        </div>
      </section></>}

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {showEmptyState || filteredItems.length === 0 ? (
          <EmptyState
            title="Belum Ada Ekstrakurikuler Terdaftar"
            description="Data ekstrakurikuler di kategori ini belum dimasukkan ke dalam database."
            onResetData={() => {
              setShowEmptyState(false);
              setSelectedCategory('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-blue-900/90 text-white border border-blue-700/50 backdrop-blur-sm">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold font-heading text-slate-900 group-hover:text-blue-900 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span className="font-semibold">{item.schedule}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <User className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>Pelatih: {item.coach}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
