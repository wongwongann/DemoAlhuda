import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { NewsItem, UnitType } from '../types';
import { NewsCard } from '../components/common/NewsCard';
import { AgendaCalendar } from '../components/common/AgendaCalendar';
import { agendaItemsFor, contentFor, pageSectionOrderFor, sectionIsVisible } from '../data/siteContent';
import type { SiteContentRecord } from '../types';

interface HomePageProps {
  newsList: NewsItem[];
  onNavigate: (route: string) => void;
  onUnitSelect: (unit: UnitType) => void;
  onNewsDetail: (news: NewsItem) => void;
  siteContent: SiteContentRecord[];
}

export const HomePage: React.FC<HomePageProps> = ({ newsList, onNavigate, onUnitSelect, onNewsDetail, siteContent }) => {
  const [newsFilter, setNewsFilter] = useState<'all' | UnitType>('all');
  const hero = contentFor('home.hero', siteContent);
  const units = contentFor('home.units', siteContent);
  const foundation = contentFor('home.foundation', siteContent);
  const newsSection = contentFor('home.news', siteContent);
  const agenda = contentFor('home.agenda', siteContent);
  const agendaItems = agendaItemsFor(siteContent);
  const sectionOrder = pageSectionOrderFor('layout.home', ['home.hero', 'home.units', 'home.foundation', 'home.news', 'home.agenda'], siteContent);
  const orderOf = (id: string) => sectionOrder.indexOf(id);
  const filteredNews = newsList.filter(item => newsFilter === 'all' || item.unit === newsFilter);
  const featuredNews = filteredNews.find(item => item.isFeatured) || filteredNews[0];
  const regularNews = filteredNews.filter(item => item.id !== featuredNews?.id).slice(0, 3);
  return (
    <div className="home-page" style={{ display: 'flex', flexDirection: 'column' }}>
      {sectionIsVisible('home.hero', siteContent) && <section className="school-hero" style={{ order: orderOf('home.hero') }} aria-labelledby="hero-title">
        <div className="hero-main page-width">
          <div className="hero-copy">
            <p className="hero-location">{hero.eyebrow}</p>
            <h1 id="hero-title">{hero.title}</h1>
            <p className="hero-description">{hero.description}</p>
            <div className="hero-actions"><button className="button-light" onClick={() => onNavigate('/tentang')}>{hero.primaryAction}</button><button className="hero-text-link" onClick={() => onNavigate('/kontak')}>{hero.secondaryAction}</button></div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="arch-frame"><div className="arch-inner"><span className="arabic-mark" lang="ar">العلم نور</span><span className="art-caption">Ilmu adalah cahaya</span><div className="book-lines"><i /><i /><i /><i /><i /></div></div></div><span className="art-footnote">Al-Huda Tundungan</span></div>
        </div>
        <div className="hero-bottom page-width"><span>{hero.footnote}</span><span>{hero.supportingLine}</span></div>
      </section>}
      {sectionIsVisible('home.units', siteContent) && <section className="unit-section page-width" style={{ order: orderOf('home.units') }} aria-labelledby="unit-heading">
        <div className="section-intro"><p className="section-label">{units.eyebrow}</p><h2 id="unit-heading">{units.title}</h2><p>{units.description}</p></div>
        <div className="unit-options">
          <button id="gate-smp" className="unit-option" onClick={() => onUnitSelect('smp')}><span className="unit-caption">{units.smpCaption}</span><span className="unit-name">{units.smpTitle} <ArrowUpRight aria-hidden="true" /></span><span className="unit-description">{units.smpDescription}</span><span className="unit-detail">{units.smpDetail}</span></button>
          <button id="gate-pondok" className="unit-option" onClick={() => onUnitSelect('pondok')}><span className="unit-caption">{units.pondokCaption}</span><span className="unit-name">{units.pondokTitle} <ArrowUpRight aria-hidden="true" /></span><span className="unit-description">{units.pondokDescription}</span><span className="unit-detail">{units.pondokDetail}</span></button>
        </div>
      </section>}
      {sectionIsVisible('home.foundation', siteContent) && <section className="foundation-section page-width" style={{ order: orderOf('home.foundation') }} aria-labelledby="foundation-heading"><div><p className="section-label">{foundation.eyebrow}</p><h2 id="foundation-heading">{foundation.title}</h2></div><div className="foundation-copy"><p>{foundation.paragraphOne}</p><p>{foundation.paragraphTwo}</p><button className="text-link" onClick={() => onNavigate('/tentang')}>{foundation.linkLabel}</button></div></section>}
      {sectionIsVisible('home.news', siteContent) && <section className="news-section page-width" style={{ order: orderOf('home.news') }} aria-labelledby="news-heading">
        <div className="section-heading"><div><p className="section-label">{newsSection.eyebrow}</p><h2 id="news-heading">{newsSection.title}</h2></div><button className="text-link" onClick={() => onNavigate('/berita')}>{newsSection.allNewsLabel}</button></div>
        <div className="news-tabs" role="group" aria-label="Filter berita berdasarkan lembaga">{([{ id: 'all', label: 'Semua kabar' }, { id: 'yayasan', label: 'Yayasan' }, { id: 'smp', label: 'SMP' }, { id: 'pondok', label: 'Pesantren' }] as const).map(tab => <button key={tab.id} aria-pressed={newsFilter === tab.id} onClick={() => setNewsFilter(tab.id)}>{tab.label}</button>)}</div>
        <div aria-live="polite">{featuredNews ? <div className="news-editorial"><NewsCard news={featuredNews} featured onClick={onNewsDetail} /><div className="news-secondary">{regularNews.map(news => <NewsCard key={news.id} news={news} onClick={onNewsDetail} />)}</div></div> : <p className="empty-message">{newsSection.emptyMessage}</p>}</div>
      </section>}
      {sectionIsVisible('home.agenda', siteContent) && <section className="agenda-section" style={{ order: orderOf('home.agenda') }} aria-labelledby="agenda-heading"><div className="page-width agenda-layout"><div className="agenda-intro"><p className="section-label">{agenda.eyebrow}</p><h2 id="agenda-heading">{agenda.title}</h2><p>{agenda.description}</p><button className="text-link" onClick={() => onNavigate('/kontak')}>Hubungi sekretariat</button></div><AgendaCalendar agendaList={agendaItems} /></div></section>}
    </div>
  );
};
