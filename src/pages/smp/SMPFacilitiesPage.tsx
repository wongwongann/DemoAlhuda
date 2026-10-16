import React from 'react';
import { Building2, Monitor, BookOpen, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { collectionFor, contentFor, sectionIsVisible } from '../../data/siteContent';
import type { SiteContentRecord } from '../../types';

export const SMPFacilitiesPage: React.FC<{ siteContent: SiteContentRecord[] }> = ({ siteContent }) => {
  const content = contentFor('smp.facilities', siteContent);
  const facilities = collectionFor('smp.facilities', 'items', siteContent);
  return (
    <div className="w-full space-y-12 pb-20">
      {/* Banner */}
      {sectionIsVisible('smp.facilities', siteContent) && <><section className="bg-gradient-to-b from-blue-950 to-[#0c1f3d] text-white py-14 px-4 sm:px-6 relative overflow-hidden">
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
                  <h3 className="text-lg font-bold font-heading text-slate-900 group-hover:text-blue-900 transition-colors">
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
