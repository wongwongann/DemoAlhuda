import React from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';
import { collectionFor, contentFor, sectionIsVisible } from '../../data/siteContent';
import type { SiteContentRecord } from '../../types';

export const PondokFacilitiesPage: React.FC<{ siteContent: SiteContentRecord[] }> = ({ siteContent }) => {
  const content = contentFor('pondok.facilities', siteContent);
  const facilities = collectionFor('pondok.facilities', 'items', siteContent);
  return (
    <div className="w-full space-y-12 pb-20">
      {/* Banner */}
      {sectionIsVisible('pondok.facilities', siteContent) && <><section className="bg-gradient-to-b from-[#251b0a] to-[#3a290d] text-white py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-pondok-pattern opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <span className="inline-block px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-full">
            {content.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">
            {content.title}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl mx-auto">
            {content.description}
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={fac.imageUrl}
                  alt={fac.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-heading text-slate-900 group-hover:text-amber-700 transition-colors">
                    {fac.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {fac.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {content.itemNote}
                  </span>
                  <span>{content.locationLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section></>}
    </div>
  );
};
