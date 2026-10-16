import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { SiteContentRecord, UnitType } from '../../types';
import { contentFor } from '../../data/siteContent';
interface NavbarProps { currentRoute: string; onNavigate: (route: string) => void; activeUnit: UnitType; onUnitChange: (unit: UnitType) => void; siteContent: SiteContentRecord[]; }
export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, activeUnit, onUnitChange, siteContent }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => { setMobileMenuOpen(false); }, [currentRoute, activeUnit]);
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileMenuOpen(false); }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, []);
  const navigate = (route: string) => { onNavigate(route); setMobileMenuOpen(false); };
  const labels = contentFor('global.navigation', siteContent);
  const links: Record<UnitType, [string, string][]> = {
    yayasan: [[labels.foundationHome, '/'], [labels.about, '/tentang'], [labels.news, '/berita'], [labels.gallery, '/galeri'], [labels.contact, '/kontak']],
    smp: [[labels.smpHome, '/smp'], [labels.smpProfile, '/smp/profil'], [labels.smpStaff, '/smp/guru'], [labels.smpExtracurricular, '/smp/ekskul'], [labels.smpFacilities, '/smp/fasilitas'], [labels.contact, '/kontak']],
    pondok: [[labels.pondokHome, '/pondok'], [labels.pondokProfile, '/pondok/profil'], [labels.pondokStaff, '/pondok/asatidz'], [labels.pondokSchedule, '/pondok/jadwal'], [labels.pondokFacilities, '/pondok/fasilitas'], [labels.contact, '/kontak']],
  };
  const unitLabels: Record<UnitType, string> = { yayasan: labels.foundationLabel, smp: labels.smpLabel, pondok: labels.pondokLabel };
  const brand = activeUnit === 'smp' ? labels.smpBrand : activeUnit === 'pondok' ? labels.pondokBrand : labels.foundationBrand;
  return (
    <header className="site-header">
      <div className="utility-bar"><div className="page-width utility-inner"><span className="utility-location">{labels.utilityLocation}</span><nav aria-label="Pilih lembaga" className="unit-nav">{(['yayasan', 'smp', 'pondok'] as const).map(id => <button id={`switch-unit-${id}`} key={id} aria-pressed={activeUnit === id} onClick={() => { onUnitChange(id); setMobileMenuOpen(false); }}>{unitLabels[id]}</button>)}</nav></div></div>
      <div className="page-width main-navigation">
        <button id="brand-logo-btn" className="brand" onClick={() => navigate(activeUnit === 'yayasan' ? '/' : `/${activeUnit}`)} aria-label={`${links[activeUnit][0][0]} · ${brand}`}><span className="brand-emblem" aria-hidden="true">اهـ</span><span><span className="brand-kicker">{activeUnit === 'yayasan' ? labels.foundationKicker : labels.otherKicker}</span><span className="brand-name">{brand}</span></span></button>
        <nav className="desktop-navigation" aria-label="Navigasi utama">{links[activeUnit].map(([label, route]) => <button key={route} aria-current={currentRoute === route ? 'page' : undefined} onClick={() => navigate(route)}>{label}</button>)}</nav>
        <div className="nav-actions"><button id="mobile-menu-toggle" className="mobile-toggle" aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-drawer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button></div>
      </div>
      {mobileMenuOpen && <nav id="mobile-drawer" className="mobile-navigation" aria-label="Navigasi seluler">{links[activeUnit].map(([label, route]) => <button key={route} aria-current={currentRoute === route ? 'page' : undefined} onClick={() => navigate(route)}>{label}</button>)}<button onClick={() => navigate('/admin')}>Panel admin</button></nav>}
    </header>
  );
};
