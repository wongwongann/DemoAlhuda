import React, { useState } from 'react';
import { 
  UnitType, 
  NewsItem, 
  GalleryItem, 
  StaffMember, 
  ContactMessage, 
  AgendaItem 
} from './types';
import { useWebsiteData } from './hooks/useWebsiteData';
import { submitContact } from './lib/database';
import { requireSupabase } from './lib/supabase';
import { AdminLogin } from './pages/admin/AdminLogin';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Hub Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { NewsPage } from './pages/NewsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';

// SMP Sub-Area Pages
import { SMPProfilePage } from './pages/smp/SMPProfilePage';
import { SMPStaffPage } from './pages/smp/SMPStaffPage';
import { SMPExtracurricularPage } from './pages/smp/SMPExtracurricularPage';
import { SMPFacilitiesPage } from './pages/smp/SMPFacilitiesPage';

// Pondok Sub-Area Pages
import { PondokProfilePage } from './pages/pondok/PondokProfilePage';
import { PondokAsatidzPage } from './pages/pondok/PondokAsatidzPage';
import { PondokSchedulePage } from './pages/pondok/PondokSchedulePage';
import { PondokFacilitiesPage } from './pages/pondok/PondokFacilitiesPage';

// Admin Panel
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Floating Widgets
import { MessageSquare } from 'lucide-react';
import { contentFor } from './data/siteContent';

export default function App() {
  // App-level State
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [activeUnit, setActiveUnit] = useState<UnitType>('yayasan');
  const [selectedNewsDetail, setSelectedNewsDetail] = useState<NewsItem | null>(null);

  const { newsList, setNewsList, galleryList, setGalleryList, staffList, setStaffList,
    contactList, setContactList, siteContentList, setSiteContentList, siteContentAvailable,
    session, adminState, publicError, adminError, publicLoading, retry } = useWebsiteData();
  const theme = contentFor('global.theme', siteContentList);
  const contactDetails = contentFor('contact.details', siteContentList);
  const themeStyle = {
    '--forest': theme.forest,
    '--forest-dark': theme.forestDark,
    '--paper': theme.paper,
    '--brass': theme.brass,
    '--font-sans': `'${theme.sansFont}', 'Segoe UI', sans-serif`,
    '--font-heading': `'${theme.headingFont}', Georgia, serif`,
    backgroundColor: theme.paper,
  } as React.CSSProperties;

  // Handle Route Navigation
  const handleNavigate = (route: string) => {
    // Determine unit from route
    if (route.startsWith('/smp')) {
      setActiveUnit('smp');
    } else if (route.startsWith('/pondok')) {
      setActiveUnit('pondok');
    } else if (route === '/' || route === '/tentang') {
      setActiveUnit('yayasan');
    }

    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  // Switch Unit explicitly
  const handleUnitChange = (unit: UnitType) => {
    setActiveUnit(unit);
    if (unit === 'yayasan') {
      setCurrentRoute('/');
    } else if (unit === 'smp') {
      setCurrentRoute('/smp');
    } else if (unit === 'pondok') {
      setCurrentRoute('/pondok');
    }
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  const handleContactCreated = async (message: ContactMessage) => {
    const saved = await submitContact(message);
    if (adminState === 'authorized') setContactList(previous => [saved, ...previous.filter(item => item.id !== saved.id)]);
    return saved;
  };

  // If in Admin route, render Admin Dashboard
  if (currentRoute === '/admin') {
    if (adminState !== 'authorized') return <AdminLogin onExit={() => handleNavigate('/')} checking={adminState === 'checking'} accessError={adminError} signedIn={Boolean(session)} onRetry={retry} />;
    return (
      <AdminDashboard
        newsList={newsList}
        setNewsList={setNewsList}
        galleryList={galleryList}
        setGalleryList={setGalleryList}
        staffList={staffList}
        setStaffList={setStaffList}
        siteContentList={siteContentList}
        setSiteContentList={setSiteContentList}
        siteContentAvailable={siteContentAvailable}
        contactList={contactList}
        setContactList={setContactList}
        onExitAdmin={() => handleNavigate('/')}
        onSignOut={async () => { const { error } = await requireSupabase().auth.signOut({ scope: 'local' }); if (error) throw error; }}
        onRefresh={retry}
        loadingError={publicError}
      />
    );
  }

  return (
    <div style={themeStyle} className="public-site min-h-screen flex flex-col bg-[#f8f9f5] text-slate-800 font-sans selection:bg-emerald-800 selection:text-white">
      <a className="skip-link" href="#main-content">Langsung ke isi halaman</a>
      {/* Global Responsive Navigation Header */}
      <Navbar
        currentRoute={currentRoute}
        activeUnit={activeUnit}
        onNavigate={handleNavigate}
        onUnitChange={handleUnitChange}
        siteContent={siteContentList}
      />

      {(publicLoading || publicError) && <div className="data-status" role={publicError ? 'alert' : 'status'}>{publicLoading ? 'Memuat informasi dari server…' : publicError}{publicError && <button onClick={retry}>Coba lagi</button>}</div>}

      {/* Main Content View with Dynamic Router */}
      <main id="main-content" tabIndex={-1} className="flex-1 w-full">
        {/* HUB LEVEL ROUTES */}
        {currentRoute === '/' && (
          <HomePage
            newsList={newsList}
            siteContent={siteContentList}
            onNavigate={handleNavigate}
            onUnitSelect={handleUnitChange}
            onNewsDetail={(news) => {
              setSelectedNewsDetail(news);
              handleNavigate('/berita');
            }}
          />
        )}

        {currentRoute === '/tentang' && <AboutPage onNavigate={handleNavigate} siteContent={siteContentList} />}

        {currentRoute === '/berita' && (
          <NewsPage
            newsList={newsList}
            selectedNews={selectedNewsDetail}
            onSelectNews={setSelectedNewsDetail}
            siteContent={siteContentList}
          />
        )}

        {currentRoute === '/galeri' && <GalleryPage galleryList={galleryList} siteContent={siteContentList} />}

        {currentRoute === '/kontak' && (
          <ContactPage onMessageCreated={handleContactCreated} siteContent={siteContentList} />
        )}

        {/* SUB-AREA SMP ROUTES */}
        {(currentRoute === '/smp' || currentRoute === '/smp/profil') && (
          <SMPProfilePage onNavigate={handleNavigate} siteContent={siteContentList} />
        )}

        {currentRoute === '/smp/guru' && <SMPStaffPage staffList={staffList} siteContent={siteContentList} />}

        {currentRoute === '/smp/ekskul' && <SMPExtracurricularPage siteContent={siteContentList} />}

        {currentRoute === '/smp/fasilitas' && <SMPFacilitiesPage siteContent={siteContentList} />}

        {/* SUB-AREA PONDOK ROUTES */}
        {(currentRoute === '/pondok' || currentRoute === '/pondok/profil') && (
          <PondokProfilePage onNavigate={handleNavigate} siteContent={siteContentList} />
        )}

        {currentRoute === '/pondok/asatidz' && (
          <PondokAsatidzPage staffList={staffList} siteContent={siteContentList} />
        )}

        {currentRoute === '/pondok/jadwal' && <PondokSchedulePage siteContent={siteContentList} />}

        {currentRoute === '/pondok/fasilitas' && <PondokFacilitiesPage siteContent={siteContentList} />}
      </main>

      <a className="contact-float" href={contactDetails.whatsappUrl} target="_blank" rel="noreferrer" aria-label={contactDetails.whatsappLabel} title={contactDetails.whatsappLabel}><MessageSquare className="w-5 h-5" /></a>

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} onUnitChange={handleUnitChange} siteContent={siteContentList} />
    </div>
  );
}

