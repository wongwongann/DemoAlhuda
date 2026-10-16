import React from 'react';
import { Building2, Shield, Target, Eye, Users, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { OrgChart } from '../components/common/OrgChart';
import { contentFor, orgStructureFor, pageSectionOrderFor, sectionIsVisible } from '../data/siteContent';
import type { SiteContentRecord } from '../types';

interface AboutPageProps {
  onNavigate: (route: string) => void;
  siteContent: SiteContentRecord[];
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, siteContent }) => {
  const hero = contentFor('about.hero', siteContent);
  const history = contentFor('about.history', siteContent);
  const values = contentFor('about.vision', siteContent);
  const organizationContent = contentFor('about.organization', siteContent);
  const organization = orgStructureFor(siteContent);
  const sectionOrder = pageSectionOrderFor('layout.about', ['about.hero', 'about.history', 'about.vision', 'about.organization'], siteContent);
  const orderOf = (id: string) => sectionOrder.indexOf(id);
  return (
    <div className="w-full flex flex-col gap-16 pb-20">
      {/* 1. Header Banner */}
      {sectionIsVisible('about.hero', siteContent) && <section style={{ order: orderOf('about.hero') }} className="bg-gradient-to-b from-emerald-950 to-[#0c3327] text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <span className="inline-block px-3 py-1 bg-emerald-800 text-emerald-200 text-xs font-semibold rounded-full border border-emerald-600/40">
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

      {/* 2. Sejarah Yayasan (Admin Placeholder as requested) */}
      {sectionIsVisible('about.history', siteContent) && <section style={{ order: orderOf('about.history') }} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">{history.legalLabel}</span>
              <p className="text-xs text-slate-600">{history.legal}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">{history.regionLabel}</span>
              <p className="text-xs text-slate-600">{history.region}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">{history.affiliationLabel}</span>
              <p className="text-xs text-slate-600">{history.affiliation}</p>
            </div>
          </div>
        </div>
      </section>}

      {/* 3. Visi & Misi Yayasan (Admin Placeholder as requested) */}
      {sectionIsVisible('about.vision', siteContent) && <section style={{ order: orderOf('about.vision') }} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visi */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 border border-emerald-700/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                {values.visionTitle}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic bg-black/20 p-4 rounded-xl border border-white/10">
              &quot;{values.vision}&quot;
            </p>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {values.missionTitle}
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{values.missionOne}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{values.missionTwo}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{values.missionThree}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>}

      {/* 4. STRUKTUR PENGURUS YAYASAN (Bagan Organisasi Data-Driven) */}
      {sectionIsVisible('about.organization', siteContent) && <section style={{ order: orderOf('about.organization') }} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900">
            <Users className="w-3.5 h-3.5" />
            {organizationContent.eyebrow}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            {organizationContent.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {organizationContent.description}
          </p>
        </div>

        {/* Data-Driven Interactive Org Chart */}
        <OrgChart data={organization} />
      </section>}
    </div>
  );
};
