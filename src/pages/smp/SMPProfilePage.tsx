import React from 'react';
import { GraduationCap, Award, BookOpen, CheckCircle, Target, Eye, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { contentFor, pageSectionOrderFor, sectionIsVisible } from '../../data/siteContent';
import type { SiteContentRecord } from '../../types';

interface SMPProfilePageProps {
  onNavigate: (route: string) => void;
  siteContent: SiteContentRecord[];
}

export const SMPProfilePage: React.FC<SMPProfilePageProps> = ({ onNavigate, siteContent }) => {
  const hero = contentFor('smp.hero', siteContent);
  const history = contentFor('smp.history', siteContent);
  const vision = contentFor('smp.vision', siteContent);
  const curriculum = contentFor('smp.curriculum', siteContent);
  const cta = contentFor('smp.cta', siteContent);
  const sectionOrder = pageSectionOrderFor('layout.smp-profile', ['smp.hero', 'smp.history', 'smp.vision', 'smp.curriculum'], siteContent);
  const orderOf = (id: string) => sectionOrder.indexOf(id);
  return (
    <div className="w-full flex flex-col gap-16 pb-20">
      {/* 1. Header Banner SMP (Navy Accent) */}
      {sectionIsVisible('smp.hero', siteContent) && <section style={{ order: orderOf('smp.hero') }} className="bg-gradient-to-b from-blue-950 via-[#0a1e3f] to-slate-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-smp-pattern opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <span className="inline-block px-3.5 py-1 bg-blue-800 text-blue-100 text-xs font-bold rounded-full border border-blue-500/40">
            {hero.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white leading-tight">
            {hero.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {hero.description}
          </p>
        </div>
      </section>}

      {/* 2. Sejarah Singkat Unit SMP */}
      {sectionIsVisible('smp.history', siteContent) && <section style={{ order: orderOf('smp.history') }} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                {history.title}
              </h2>
              <span className="text-xs text-slate-400">{history.subtitle}</span>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
            <p>
              {history.paragraphOne}
            </p>
            <p>
              {history.paragraphTwo}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-center">
              <span className="text-xl font-bold text-blue-900 font-heading block">{history.metricOne}</span>
              <span className="text-xs text-slate-600">{history.metricOneNote}</span>
            </div>
            <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-center">
              <span className="text-xl font-bold text-blue-900 font-heading block">{history.metricTwo}</span>
              <span className="text-xs text-slate-600">{history.metricTwoNote}</span>
            </div>
            <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-center">
              <span className="text-xl font-bold text-blue-900 font-heading block">{history.metricThree}</span>
              <span className="text-xs text-slate-600">{history.metricThreeNote}</span>
            </div>
            <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-center">
              <span className="text-xl font-bold text-blue-900 font-heading block">{history.metricFour}</span>
              <span className="text-xs text-slate-600">{history.metricFourNote}</span>
            </div>
          </div>
        </div>
      </section>}

      {/* 3. Visi & Misi Khusus SMP */}
      {sectionIsVisible('smp.vision', siteContent) && <section style={{ order: orderOf('smp.vision') }} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visi */}
          <div className="bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 border border-blue-700/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                {vision.visionTitle}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed italic bg-black/20 p-4 rounded-xl border border-white/10">
              &quot;{vision.vision}&quot;
            </p>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {vision.missionTitle}
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>{vision.missionOne}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>{vision.missionTwo}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>{vision.missionThree}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>}

      {/* 4. Struktur Kurikulum */}
      {sectionIsVisible('smp.curriculum', siteContent) && <section style={{ order: orderOf('smp.curriculum') }} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 text-xs font-bold rounded-full">
            {curriculum.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            {curriculum.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {curriculum.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
              01
            </span>
            <h4 className="text-base font-bold font-heading text-slate-900">
              {curriculum.cardOneTitle}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {curriculum.cardOneDescription}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
              02
            </span>
            <h4 className="text-base font-bold font-heading text-slate-900">
              {curriculum.cardTwoTitle}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {curriculum.cardTwoDescription}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
              03
            </span>
            <h4 className="text-base font-bold font-heading text-slate-900">
              {curriculum.cardThreeTitle}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {curriculum.cardThreeDescription}
            </p>
          </div>
        </div>

        {sectionIsVisible('smp.cta', siteContent) && <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base font-heading">{cta.title}</h4>
            <p className="text-xs text-blue-200">{cta.description}</p>
          </div>
          <button onClick={() => onNavigate('/kontak')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shrink-0">
            <span>{cta.action}</span><ArrowRight className="w-4 h-4" />
          </button>
        </div>}
      </section>}
    </div>
  );
};
