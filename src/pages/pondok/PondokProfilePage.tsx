import React from 'react';
import { BookOpen, Sparkles, Award, ShieldCheck, Target, Eye, ArrowRight, CheckCircle2, HeartHandshake } from 'lucide-react';
import { collectionFor, contentFor, pageSectionOrderFor, sectionIsVisible } from '../../data/siteContent';
import type { SiteContentRecord } from '../../types';

interface PondokProfilePageProps {
  onNavigate: (route: string) => void;
  siteContent: SiteContentRecord[];
}

export const PondokProfilePage: React.FC<PondokProfilePageProps> = ({ onNavigate, siteContent }) => {
  const hero = contentFor('pondok.hero', siteContent);
  const history = contentFor('pondok.history', siteContent);
  const vision = contentFor('pondok.vision', siteContent);
  const programs = contentFor('pondok.programs', siteContent);
  const cta = contentFor('pondok.cta', siteContent);
  const cardOneHighlights = collectionFor('pondok.programs', 'cardOneHighlights', siteContent);
  const cardTwoHighlights = collectionFor('pondok.programs', 'cardTwoHighlights', siteContent);
  const sectionOrder = pageSectionOrderFor('layout.pondok-profile', ['pondok.hero', 'pondok.history', 'pondok.vision', 'pondok.programs'], siteContent);
  const orderOf = (id: string) => sectionOrder.indexOf(id);
  return (
    <div className="w-full flex flex-col gap-16 pb-20">
      {/* 1. Header Banner Pondok (Gold/Warm Accent) */}
      {sectionIsVisible('pondok.hero', siteContent) && <section style={{ order: orderOf('pondok.hero') }} className="bg-gradient-to-b from-[#251b0a] via-[#35250a] to-slate-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-pondok-pattern opacity-25 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <span className="inline-block px-3.5 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-full">
            {hero.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white leading-tight">
            {hero.title}
          </h1>
          <p className="text-sm sm:text-base text-amber-100/90 max-w-2xl mx-auto leading-relaxed">
            {hero.description}
          </p>
        </div>
      </section>}

      {/* 2. Sejarah Singkat Pesantren (Admin placeholder as requested) */}
      {sectionIsVisible('pondok.history', siteContent) && <section style={{ order: orderOf('pondok.history') }} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
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
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-100 text-center">
              <span className="text-xl font-bold text-amber-900 font-heading block">{history.statOne}</span>
              <span className="text-xs text-slate-600">{history.statOneNote}</span>
            </div>
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-100 text-center">
              <span className="text-xl font-bold text-amber-900 font-heading block">{history.statTwo}</span>
              <span className="text-xs text-slate-600">{history.statTwoNote}</span>
            </div>
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-100 text-center">
              <span className="text-xl font-bold text-amber-900 font-heading block">{history.statThree}</span>
              <span className="text-xs text-slate-600">{history.statThreeNote}</span>
            </div>
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-100 text-center">
              <span className="text-xl font-bold text-amber-900 font-heading block">{history.statFour}</span>
              <span className="text-xs text-slate-600">{history.statFourNote}</span>
            </div>
          </div>
        </div>
      </section>}

      {/* 3. Visi & Misi Pesantren */}
      {sectionIsVisible('pondok.vision', siteContent) && <section style={{ order: orderOf('pondok.vision') }} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visi */}
          <div className="bg-gradient-to-br from-[#2c200c] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 border border-amber-600/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                {vision.visionTitle}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-amber-100 leading-relaxed italic bg-black/20 p-4 rounded-xl border border-white/10">
              &quot;{vision.vision}&quot;
            </p>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {vision.missionTitle}
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{vision.missionOne}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{vision.missionTwo}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{vision.missionThree}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>}

      {/* 4. Program Unggulan Pondok */}
      {sectionIsVisible('pondok.programs', siteContent) && <section style={{ order: orderOf('pondok.programs') }} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
            {programs.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            {programs.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {programs.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Program 1: Tahfidz */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-md">
                {programs.cardOneBadge}
              </span>
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {programs.cardOneTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {programs.cardOneDescription}
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                {cardOneHighlights.map(item => <li key={item.id} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />{item.text}</li>)}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-900">{programs.cardOneFooter}</span>
            </div>
          </div>

          {/* Program 2: Madrasah Diniyah & Kitab Kuning */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-md">
                {programs.cardTwoBadge}
              </span>
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {programs.cardTwoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {programs.cardTwoDescription}
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                {cardTwoHighlights.map(item => <li key={item.id} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />{item.text}</li>)}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-900">{programs.cardTwoFooter}</span>
            </div>
          </div>
        </div>

        {sectionIsVisible('pondok.cta', siteContent) && <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base font-heading">{cta.title}</h4>
            <p className="text-xs text-amber-200">{cta.description}</p>
          </div>
          <button onClick={() => onNavigate('/kontak')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shrink-0">
            <span>{cta.action}</span><ArrowRight className="w-4 h-4" />
          </button>
        </div>}
      </section>}
    </div>
  );
};
