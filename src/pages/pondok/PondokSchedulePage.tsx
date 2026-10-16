import React from 'react';
import { Clock, Sun, Moon, Sparkles, BookOpen, Coffee, CheckCircle2 } from 'lucide-react';
import { collectionFor, contentFor, sectionIsVisible } from '../../data/siteContent';
import type { SiteContentRecord } from '../../types';

export const PondokSchedulePage: React.FC<{ siteContent: SiteContentRecord[] }> = ({ siteContent }) => {
  const content = contentFor('pondok.schedule', siteContent);
  const schedule = collectionFor('pondok.schedule', 'items', siteContent);
  return (
    <div className="w-full space-y-12 pb-20">
      {/* Banner */}
      {sectionIsVisible('pondok.schedule', siteContent) && <><section className="bg-gradient-to-b from-[#251b0a] to-[#3a290d] text-white py-14 px-4 sm:px-6 relative overflow-hidden">
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

      {/* Schedule Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                {content.scheduleTitle}
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200">
              {content.scheduleLabel}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {schedule.map((item, index) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-amber-50/40 p-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-24 shrink-0 font-mono font-bold text-xs sm:text-sm text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-center">
                    {item.time}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 font-heading">
                      {item.activity}
                    </h3>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  {(item.type || item.category || 'rutinitas').toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Riyadhah Info Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold font-heading text-sm sm:text-base">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <span>{content.noteTitle}</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            {content.note}
          </p>
        </div>
      </section></>}
    </div>
  );
};
