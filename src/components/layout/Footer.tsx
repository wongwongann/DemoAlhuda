import React from 'react';
import { UnitType, SiteContentRecord } from '../../types';
import { contentFor, sectionIsVisible } from '../../data/siteContent';
interface FooterProps { onNavigate: (route: string) => void; onUnitChange: (unit: UnitType) => void; siteContent: SiteContentRecord[]; }
export const Footer: React.FC<FooterProps> = ({ onNavigate, onUnitChange, siteContent }) => {
  const footer = contentFor('footer.contact', siteContent);
  const footerLinks = [[footer.navAbout, '/tentang'], [footer.navNews, '/berita'], [footer.navGallery, '/galeri'], [footer.navContact, '/kontak']];
  return (
  <footer id="main-footer" className="site-footer"><div className="page-width">
    <div className="footer-main"><div className="footer-identity"><p>{footer.organizationLabel}</p><h2>{footer.organizationName}</h2><p>{footer.tagline}</p><div className="footer-units"><button onClick={() => onUnitChange('smp')}>{footer.unitSmpLabel}</button><button onClick={() => onUnitChange('pondok')}>{footer.unitPondokLabel}</button></div></div>{sectionIsVisible('footer.contact', siteContent) && <div className="footer-contact"><h3>{footer.visitTitle}</h3><address>{footer.address}</address><p>{footer.hours}</p><a href={'tel:' + footer.phone.replace(/[^0-9+]/g, '')}>{footer.phone}</a><a href={'mailto:' + footer.email}>{footer.email}</a><a href={footer.mapUrl} target="_blank" rel="noreferrer">{footer.mapLabel}</a></div>}</div>
    <nav className="footer-links" aria-label={footer.navLabel}>{footerLinks.map(([label,route]) => <button key={route} onClick={() => onNavigate(route)}>{label}</button>)}</nav>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Yayasan Al-Huda Tundungan</span><button id="nav-admin-btn" onClick={() => onNavigate('/admin')}>Panel admin</button></div>
  </div></footer>
  );
};
