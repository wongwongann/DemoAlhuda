import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';
import { ContactForm } from '../components/common/ContactForm';
import { ContactMessage, SiteContentRecord } from '../types';
import { contentFor, pageSectionOrderFor, sectionIsVisible } from '../data/siteContent';

interface ContactPageProps {
  onMessageCreated: (msg: ContactMessage) => Promise<ContactMessage>;
  siteContent: SiteContentRecord[];
}

export const ContactPage: React.FC<ContactPageProps> = ({ onMessageCreated, siteContent }) => {
  const hero = contentFor('contact.hero', siteContent);
  const details = contentFor('contact.details', siteContent);
  const map = contentFor('contact.map', siteContent);
  const sectionOrder = pageSectionOrderFor('layout.contact', ['contact.hero', 'contact.details', 'contact.map'], siteContent);
  const orderOf = (id: string) => sectionOrder.indexOf(id);
  return (
    <div className="w-full flex flex-col gap-16 pb-20">
      {/* 1. Header Banner */}
      {sectionIsVisible('contact.hero', siteContent) && <section style={{ order: orderOf('contact.hero') }} className="bg-gradient-to-b from-emerald-950 to-[#0c3327] text-white py-16 px-4 sm:px-6 relative overflow-hidden">
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

      {/* 2. Contact Cards & Form */}
      <section style={{ order: orderOf('contact.details') }} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Contact Details (5 cols) */}
          {sectionIsVisible('contact.details', siteContent) && <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold font-heading text-slate-900">
                  {details.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {details.institution}
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">{details.addressLabel}</span>
                    <p className="text-slate-600 leading-relaxed">
                      {details.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">{details.phoneLabel}</span>
                    <p className="text-slate-600">{details.officePhone}</p>
                    <p className="text-slate-600">{details.whatsapp}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">{details.emailLabel}</span>
                    <p className="text-slate-600">{details.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">{details.hoursLabel}</span>
                    <p className="text-slate-600">{details.hoursOne}</p>
                    <p className="text-slate-600">{details.hoursTwo}</p>
                    <p className="text-slate-600">{details.hoursThree}</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA Button */}
              <div className="pt-2">
                <a
                  href={details.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{details.whatsappLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>}

          {/* Right Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm onSubmitSuccess={onMessageCreated} />
          </div>
        </div>
      </section>

      {/* 3. Interactive Google Map Location */}
      {sectionIsVisible('contact.map', siteContent) && <section style={{ order: orderOf('contact.map') }} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                {map.title}
              </h3>
              <p className="text-xs text-slate-500">
                {map.description}
              </p>
            </div>
            <a
              href={map.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 self-start sm:self-auto"
            >
              <span>{map.openLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-[16/7] w-full bg-slate-100 shadow-inner">
            <iframe
              title={map.title}
              src={map.embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>}
    </div>
  );
};
