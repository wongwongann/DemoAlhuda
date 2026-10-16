import { saveRecord, deleteRecord, updateRecord, upsertRecord } from '../../lib/database';
import { dataError } from '../../lib/supabase';
import './admin.css';
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Newspaper, 
  Image, 
  Users, 
  MessageSquare, 
  Database, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles, 
  Building2, 
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Layers,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { 
  NewsItem, 
  GalleryItem, 
  StaffMember, 
  ContactMessage, 
  UnitType,
  SiteContentRecord
} from '../../types';
import { SiteContentEditor } from './SiteContentEditor';
import { contentFor } from '../../data/siteContent';

interface AdminDashboardProps {
  newsList: NewsItem[];
  setNewsList: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  galleryList: GalleryItem[];
  setGalleryList: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  staffList: StaffMember[];
  setStaffList: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  siteContentList: SiteContentRecord[];
  setSiteContentList: React.Dispatch<React.SetStateAction<SiteContentRecord[]>>;
  siteContentAvailable: boolean;
  contactList: ContactMessage[];
  setContactList: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  onExitAdmin: () => void;
  onSignOut: () => Promise<void>;
  onRefresh: () => void;
  loadingError: string | null;
}


const adminSections = {
  overview: { title: 'Ringkasan', description: 'Pantau pesan dan kelola informasi keluarga besar Al-Huda.' },
  news: { title: 'Berita & pengumuman', description: 'Kelola kabar yang tampil di website yayasan, SMP, dan pesantren.' },
  staff: { title: 'Guru & asatidz', description: 'Kelola profil tenaga pendidik dan staf setiap lembaga.' },
  gallery: { title: 'Galeri kegiatan', description: 'Atur dokumentasi foto dan video lingkungan Al-Huda.' },
  contacts: { title: 'Kotak masuk', description: 'Baca pertanyaan dan tindak lanjuti pesan dari wali murid.' },
  supabase: { title: 'Referensi database', description: 'Dokumentasi skema untuk pengembangan integrasi Supabase.' },
  content: { title: 'Konten website', description: 'Ubah tulisan dan tampilkan atau sembunyikan bagian halaman tanpa mengedit source code.' },
};
const isUnread = (message: ContactMessage) => message.status ? message.status === 'unread' : !message.isRead;

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  newsList,
  setNewsList,
  galleryList,
  setGalleryList,
  staffList,
  setStaffList,
  siteContentList,
  setSiteContentList,
  siteContentAvailable,
  contactList,
  setContactList,
  onExitAdmin,
  onSignOut, onRefresh, loadingError,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'news' | 'gallery' | 'staff' | 'contacts' | 'supabase' | 'content'
  >('overview');

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); document.querySelector<HTMLButtonElement>('.admin-menu-toggle')?.focus(); } };
    document.addEventListener('keydown', closeMenu);
    return () => document.removeEventListener('keydown', closeMenu);
  }, [menuOpen]);

  // Search & Filters in Admin
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState<'all' | 'yayasan' | 'smp' | 'pondok'>('all');

  // Modals state
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);

  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);


  const savingRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  async function runMutation(action: () => Promise<void>) {
    if (savingRef.current) return;
    savingRef.current = true; setSaving(true); setMutationError(null);
    try { await action(); } catch (error) { setMutationError(dataError(error)); }
    finally { savingRef.current = false; setSaving(false); }
  }

  // Success Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };


  const matchesFilter = (unit: string | undefined, text: string) => (filterUnit === 'all' || filterUnit === unit) && text.toLocaleLowerCase('id').includes(searchTerm.toLocaleLowerCase('id'));
  const visibleNews = newsList.filter(item => matchesFilter(item.unit, [item.title, item.author, item.category].join(' ')));
  const visibleStaff = staffList.filter(item => matchesFilter(item.unit, [item.name, item.role, item.subject].join(' ')));
  const visibleGallery = galleryList.filter(item => matchesFilter(item.unit, [item.title, item.category].join(' ')));
  const visibleContacts = contactList.filter(item => matchesFilter(item.unit || item.targetUnit, [item.name, item.subject, item.message, item.email].join(' ')));
  const visibleCount = ({ news: visibleNews.length, staff: visibleStaff.length, gallery: visibleGallery.length, contacts: visibleContacts.length } as Partial<Record<typeof activeTab, number>>)[activeTab];
  const adminSettings = contentFor('admin.settings', siteContentList);
  const modalOpen = isNewsModalOpen || isStaffModalOpen || isGalleryModalOpen;
  useEffect(() => {
    if (!modalOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>('.admin-dialog');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex="0"]') || []).filter(el => !el.hasAttribute('disabled'));
    focusables()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !savingRef.current) { setIsNewsModalOpen(false); setIsStaffModalOpen(false); setIsGalleryModalOpen(false); }
      if (event.key === 'Tab') { const elements = focusables(); const first = elements[0]; const last = elements[elements.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKey); previousFocus?.focus(); };
  }, [modalOpen]);

  // ------------------ CRUD HANDLERS ------------------
  // 1. News
  const handleSaveNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newsData: NewsItem = {
      id: editingNews ? editingNews.id : `news-${Date.now()}`,
      title: formData.get('title') as string,
      slug: (formData.get('title') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      unit: formData.get('unit') as UnitType,
      category: formData.get('category') as string,
      author: formData.get('author') as string,
      publishDate: formData.get('publishDate') as string || new Date().toISOString().split('T')[0],
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      imageUrl: formData.get('imageUrl') as string || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
      isFeatured: formData.get('isFeatured') === 'on',
      views: editingNews?.views ?? 0,
    };

    await runMutation(async () => {
      const saved = await saveRecord('news', { ...(editingNews || {}), ...newsData }, !editingNews);
      setNewsList(previous => editingNews ? previous.map(item => item.id === saved.id ? saved : item) : [saved, ...previous]);
      showToast('Berita berhasil disimpan ke database.');
      setIsNewsModalOpen(false); setEditingNews(null);
    });
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return;
    await runMutation(async () => {
      await deleteRecord('news', id);
      setNewsList(previous => previous.filter(item => item.id !== id));
      showToast('Berita berhasil dihapus.');
    });
  };
  // 2. Staff
  const handleSaveStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const staffData: StaffMember = {
      id: editingStaff ? editingStaff.id : `staff-${Date.now()}`,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      unit: formData.get('unit') as UnitType,
      category: formData.get('category') as any,
      subject: formData.get('subject') as string || undefined,
      nip: formData.get('nip') as string || undefined,
      imageUrl: formData.get('imageUrl') as string || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      order: editingStaff?.order ?? 99,
    };

    await runMutation(async () => {
      const saved = await saveRecord('staff', { ...(editingStaff || {}), ...staffData }, !editingStaff);
      setStaffList(previous => editingStaff ? previous.map(item => item.id === saved.id ? saved : item) : [saved, ...previous]);
      showToast('Data pendidik berhasil disimpan ke database.');
      setIsStaffModalOpen(false); setEditingStaff(null);
    });
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus data personil ini?')) return;
    await runMutation(async () => {
      await deleteRecord('staff', id);
      setStaffList(previous => previous.filter(item => item.id !== id));
      showToast('Data pendidik berhasil dihapus.');
    });
  };
  // 3. Gallery
  const handleSaveGallery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const mediaUrlVal = formData.get('imageUrl') as string;
    const galData: GalleryItem = {
      id: editingGallery ? editingGallery.id : `gal-${Date.now()}`,
      title: formData.get('title') as string,
      unit: formData.get('unit') as UnitType,
      type: formData.get('type') as 'image' | 'video',
      mediaUrl: mediaUrlVal,
      thumbnailUrl: mediaUrlVal,
      imageUrl: mediaUrlVal,
      category: formData.get('category') as any,
      date: formData.get('date') as string || new Date().toISOString().split('T')[0],
    };

    await runMutation(async () => {
      const saved = await saveRecord('gallery', { ...(editingGallery || {}), ...galData }, !editingGallery);
      setGalleryList(previous => editingGallery ? previous.map(item => item.id === saved.id ? saved : item) : [saved, ...previous]);
      showToast('Media galeri berhasil disimpan ke database.');
      setIsGalleryModalOpen(false); setEditingGallery(null);
    });
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Hapus media ini dari galeri?')) return;
    await runMutation(async () => {
      await deleteRecord('gallery', id);
      setGalleryList(previous => previous.filter(item => item.id !== id));
      showToast('Media berhasil dihapus.');
    });
  };
  // 5. Contact Message Status
  const handleToggleContactStatus = async (id: string) => {
    const message = contactList.find(item => item.id === id); if (!message) return;
    await runMutation(async () => {
      const read = isUnread(message);
      const saved = await updateRecord('contact_messages', id, { status: read ? 'read' : 'unread', isRead: read });
      setContactList(previous => previous.map(item => item.id === id ? saved : item));
      showToast('Status pesan berhasil diperbarui.');
    });
  };
  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Hapus pesan ini?')) return;
    await runMutation(async () => {
      await deleteRecord('contact_messages', id);
      setContactList(previous => previous.filter(item => item.id !== id));
      showToast('Pesan berhasil dihapus.');
    });
  };
  const handleSaveSiteContent = async (record: SiteContentRecord) => {
    await runMutation(async () => {
      const saved = await upsertRecord('site_content', record);
      setSiteContentList(previous => [...previous.filter(item => item.id !== saved.id), saved]);
      showToast('Konten halaman berhasil disimpan ke Supabase.');
    });
  };
  return (
    <div className="admin-app" aria-busy={saving}>
      {/* Toast */}
      {toastMsg && (
        <div role="status" className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-500 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <a href="#admin-content" className="skip-link">Langsung ke isi panel</a>
      <header className="admin-topbar">
        <div className="admin-brand"><span className="admin-monogram" aria-hidden="true">AH</span><div><strong>Al-Huda Tundungan</strong><span>Administrasi yayasan</span></div></div>
        <div className="admin-top-actions"><span className="admin-storage">Database Supabase</span><button disabled={saving} onClick={onExitAdmin} className="admin-public-link">Lihat website <ExternalLink size={15} aria-hidden="true" /></button><button disabled={saving} className="admin-menu-toggle" aria-expanded={menuOpen} aria-controls="admin-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Tutup menu' : 'Menu'}</button></div>
      </header>
      <div className="admin-workspace">
        <aside className={'admin-sidebar ' + (menuOpen ? 'is-open' : '')}>
          <nav id="admin-navigation" aria-label="Menu administrasi">
            <p className="admin-nav-label">Ruang kerja</p>
            {[
              { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard, count: null },
              { id: 'news', label: 'Berita & pengumuman', icon: Newspaper, count: newsList.length },
              { id: 'staff', label: 'Guru & asatidz', icon: Users, count: staffList.length },
              { id: 'gallery', label: 'Galeri kegiatan', icon: Image, count: galleryList.length },
              { id: 'contacts', label: 'Kotak masuk', icon: MessageSquare, count: contactList.filter(isUnread).length },
              { id: 'content', label: 'Konten website', icon: SlidersHorizontal, count: null },
              { id: 'supabase', label: 'Referensi database', icon: Database, count: null },
            ].map(item => <button disabled={saving} key={item.id} data-admin-tab={item.id} aria-current={activeTab === item.id ? 'page' : undefined} onClick={() => { setActiveTab(item.id as typeof activeTab); setSearchTerm(''); setFilterUnit('all'); setMenuOpen(false); }}><item.icon size={18} strokeWidth={1.6} aria-hidden="true" /><span>{item.label}</span>{item.count !== null && <span className="admin-nav-count">{item.count}</span>}</button>)}
          </nav>
          <div className="admin-sidebar-note"><button disabled={saving} onClick={() => void runMutation(onSignOut)} className="admin-sidebar-exit">Keluar akun</button><button disabled={saving} onClick={onExitAdmin} className="admin-sidebar-exit">Kembali ke website</button><span>Yayasan · SMP · Pesantren</span><p>Satu ruang untuk mengelola informasi Al-Huda.</p></div>
        </aside>
        <main id="admin-content" tabIndex={-1} className="admin-main">
          <div className="admin-page-heading"><div><p>Panel administrasi / {adminSections[activeTab].title}</p><h1>{adminSections[activeTab].title}</h1><span>{adminSections[activeTab].description}</span></div><span className="admin-year">Tahun ajaran<br /><strong>{adminSettings.academicYear}</strong></span></div>
          {(mutationError || loadingError) && <p role="alert" className="admin-error">{mutationError || loadingError}{loadingError && <button disabled={saving} onClick={onRefresh}>Muat ulang data</button>}</p>}
          {saving && <p role="status">Menyimpan perubahan ke server…</p>}
          {activeTab !== 'overview' && activeTab !== 'supabase' && activeTab !== 'content' && <div className="admin-toolbar"><label className="admin-search"><Search size={17} aria-hidden="true" /><input type="search" aria-label="Cari data" placeholder="Cari nama, judul, atau informasi…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></label><label className="admin-unit-filter">Lembaga<select disabled={saving} aria-label="Filter lembaga" value={filterUnit} onChange={e => setFilterUnit(e.target.value as typeof filterUnit)}><option value="all">Semua lembaga</option><option value="yayasan">Yayasan</option><option value="smp">SMP Al-Huda</option><option value="pondok">Pesantren</option></select></label></div>}
          {activeTab === 'overview' && <div className="admin-overview">
            <div className="admin-metrics">
              {[
                { label: 'Berita & artikel', value: newsList.length, note: 'Informasi yang dipublikasikan', tab: 'news' },
                { label: 'Guru & asatidz', value: staffList.length, note: 'Tenaga pendidik terdaftar', tab: 'staff' },
                { label: 'Pesan belum dibaca', value: contactList.filter(isUnread).length, note: contactList.length + ' pesan di kotak masuk', tab: 'contacts' },
              ].map(metric => <button disabled={saving} key={metric.tab} className="admin-metric" onClick={() => { setActiveTab(metric.tab as typeof activeTab); setSearchTerm(''); setFilterUnit('all'); }}><span>{metric.label}</span><strong>{metric.value.toString().padStart(2, '0')}</strong><small>{metric.note}</small></button>)}
            </div>
            <div className="admin-overview-columns">
              <section className="admin-recent"><div className="admin-section-heading"><h2>Pesan terbaru</h2><button disabled={saving} onClick={() => setActiveTab('contacts')}>Lihat semua</button></div><div className="admin-recent-labels"><span>Nama & pertanyaan</span><span>Status</span></div>{contactList.length ? [...contactList].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 5).map(message => <button disabled={saving} key={message.id} className="admin-recent-row" onClick={() => setActiveTab('contacts')}><span><strong>{message.name}</strong><small>{message.subject}</small></span><span className={'admin-status ' + (isUnread(message) ? 'status-unread' : 'status-read')}>{isUnread(message) ? 'Belum dibaca' : 'Dibaca'}</span></button>) : <p className="admin-empty">Belum ada pesan masuk.</p>}</section>
              <section className="admin-quick"><div className="admin-section-heading"><h2>Kelola informasi</h2></div><p>Perbarui konten yang dibutuhkan siswa, santri, dan wali murid.</p>
                <button disabled={saving} onClick={() => setActiveTab('content')}><Edit size={18} /><span><strong>Edit tampilan website</strong><small>Ubah tulisan dan bagian halaman</small></span><ChevronRight size={17} /></button>
                <button disabled={saving} onClick={() => { setEditingNews(null); setIsNewsModalOpen(true); }}><Newspaper size={18} /><span><strong>Tulis berita</strong><small>Pengumuman & kabar lembaga</small></span><Plus size={17} /></button>
                <button disabled={saving} onClick={() => { setEditingStaff(null); setIsStaffModalOpen(true); }}><Users size={18} /><span><strong>Tambah pendidik</strong><small>Profil guru, asatidz & staf</small></span><Plus size={17} /></button>
                <button disabled={saving} onClick={() => { setEditingGallery(null); setIsGalleryModalOpen(true); }}><Image size={18} /><span><strong>Tambah dokumentasi</strong><small>Foto & video kegiatan</small></span><Plus size={17} /></button>
              </section>
            </div>
            <div className="admin-local-note"><Database size={16} /><p>Data dikelola melalui Supabase. Penyimpanan di browser dinonaktifkan.</p><button disabled={saving} onClick={() => setActiveTab('supabase')}>Lihat referensi database</button></div>
          </div>}

          {visibleCount === 0 && <p role="status" className="admin-empty">Tidak ada data yang sesuai. Coba kata kunci atau lembaga lainnya.</p>}
          {activeTab === 'content' && <SiteContentEditor records={siteContentList} saving={saving} databaseReady={siteContentAvailable} onSave={record => void handleSaveSiteContent(record)} />}
          {/* TAB 3: NEWS MANAGEMENT */}
          {activeTab === 'news' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold font-heading text-slate-900">
                    Pengelolaan Berita & Warta
                  </h2>
                  <p className="text-xs text-slate-500">
                    Total {newsList.length} artikel terdaftar di database yayasan & unit.
                  </p>
                </div>

                <button disabled={saving}
                  onClick={() => {
                    setEditingNews(null);
                    setIsNewsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Berita Baru</span>
                </button>
              </div>

              {/* News Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Judul Artikel</th>
                      <th className="py-3 px-4">Unit</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Tanggal Rilis</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleNews.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block line-clamp-1">
                                {item.title}
                              </span>
                              <span className="text-[11px] text-slate-400">Oleh: {item.author}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 capitalize">
                            {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{item.category}</td>
                        <td className="py-3 px-4 text-slate-500">{item.publishDate}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button disabled={saving}
                              onClick={() => {
                                setEditingNews(item);
                                setIsNewsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                              title="Edit Berita"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button disabled={saving}
                              onClick={() => handleDeleteNews(item.id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                              title="Hapus Berita"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: STAFF MANAGEMENT */}
          {activeTab === 'staff' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold font-heading text-slate-900">
                    Pengelolaan Guru, Asatidz & Personil
                  </h2>
                  <p className="text-xs text-slate-500">
                    Total {staffList.length} personil terdaftar di unit SMP dan Pondok Pesantren.
                  </p>
                </div>

                <button disabled={saving}
                  onClick={() => {
                    setEditingStaff(null);
                    setIsStaffModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-800 text-white hover:bg-blue-900 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Personil Baru</span>
                </button>
              </div>

              {/* Staff Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Nama Lengkap & Foto</th>
                      <th className="py-3 px-4">Jabatan / Amanah</th>
                      <th className="py-3 px-4">Unit</th>
                      <th className="py-3 px-4">Bidang / Mapel</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleStaff.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={st.imageUrl || st.photoUrl}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{st.name}</span>
                              {st.nip && <span className="text-[10px] text-slate-400 font-mono">NIP: {st.nip}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{st.role}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            st.unit === 'smp' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {st.unit.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{st.subject || '—'}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button disabled={saving} aria-label="Edit pendidik"
                              onClick={() => {
                                setEditingStaff(st);
                                setIsStaffModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button disabled={saving}
                              aria-label="Hapus pendidik" onClick={() => handleDeleteStaff(st.id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: GALLERY MANAGEMENT */}
          {activeTab === 'gallery' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold font-heading text-slate-900">
                    Pengelolaan Galeri Foto & Video
                  </h2>
                  <p className="text-xs text-slate-500">
                    Total {galleryList.length} media terunggah di album yayasan dan unit.
                  </p>
                </div>

                <button disabled={saving}
                  onClick={() => {
                    setEditingGallery(null);
                    setIsGalleryModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Unggah Media Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {visibleGallery.map((item) => (
                  <div key={item.id} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                    <img src={item.thumbnailUrl || item.mediaUrl || item.imageUrl} alt="" className="aspect-square w-full object-cover" />
                    <div className="p-2 space-y-1">
                      <p className="font-bold text-slate-900 text-xs line-clamp-1">{item.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="capitalize">{item.unit}</span>
                        <span className="capitalize">{item.category}</span>
                      </div>
                    </div>
                    <button disabled={saving}
                      onClick={() => handleDeleteGallery(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white opacity-100 transition-opacity"
                      title="Hapus media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT MESSAGES */}
          {activeTab === 'contacts' && (
            <div data-admin-contacts className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold font-heading text-slate-900">
                  Pesan Masuk dari Formulir Kontak
                </h2>
                <p className="text-xs text-slate-500">
                  Pertanyaan dan silaturahmi dari masyarakat umum.
                </p>
              </div>

              <div className="space-y-4">
                {visibleContacts.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-xl border transition-all ${
                      isUnread(msg)
                        ? 'bg-amber-50/40 border-amber-300'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{msg.name}</span>
                          <span className="text-xs text-slate-500">({msg.email})</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 uppercase text-slate-700">
                            Tujuan: {msg.unit || msg.targetUnit || 'yayasan'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">Diterima: {msg.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {msg.phone && (
                          <a
                            href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
                          >
                            <Phone className="w-3 h-3" />
                            Balas via WA
                          </a>
                        )}
                        <button disabled={saving}
                          onClick={() => handleToggleContactStatus(msg.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          {isUnread(msg) ? 'Tandai Dibaca' : 'Tandai Belum Dibaca'}
                        </button>
                        <button disabled={saving}
                          aria-label="Hapus pesan" onClick={() => handleDeleteContact(msg.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 space-y-1">
                      <span className="font-bold text-xs text-slate-800 block">{msg.subject}</span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'supabase' && <section className="bg-white p-6 border space-y-4"><h2 className="text-lg font-bold">Koneksi database Supabase</h2><p>Berita, galeri, pendidik, agenda, konten website, dan pesan dibaca dari database. Setiap perubahan disimpan ke server sebelum dikonfirmasi berhasil.</p><p>Pesan hanya tersedia untuk akun admin yang diberi akses. Sesi login hanya disimpan dalam memori selama halaman terbuka.</p><p>Jalankan migrasi <code>202610010001_initial.sql</code> dan <code>202610170001_site_content.sql</code>.</p><button disabled={saving} onClick={onRefresh} className="button-primary">Muat ulang dari database</button></section>}

        </main>
      </div>

      {/* MODAL: ADD/EDIT NEWS */}
      {isNewsModalOpen && (
        <div className="admin-modal-backdrop">
          <div role="dialog" aria-modal="true" aria-label="Formulir berita" className="admin-dialog bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold font-heading text-lg text-slate-900">
                {editingNews ? 'Edit Berita / Pengumuman' : 'Tambah Berita Baru'}
              </h3>
              <button disabled={saving}
                aria-label="Tutup dialog" onClick={() => setIsNewsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4 text-xs sm:text-sm">
              {mutationError && <p role="alert" className="admin-error">{mutationError}</p>}
              <fieldset disabled={saving} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="admin-title" className="font-semibold text-slate-700">Judul Berita</label>
                <input id="admin-title"
                  type="text"
                  name="title"
                  defaultValue={editingNews?.title}
                  required
                  placeholder="Contoh: SMP Al-Huda Raih Juara 1 Olimpiade..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="admin-unit" className="font-semibold text-slate-700">Unit Terkait</label>
                  <select disabled={saving} id="admin-unit"
                    name="unit"
                    defaultValue={editingNews?.unit || 'yayasan'}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="yayasan">Yayasan (Umum)</option>
                    <option value="smp">SMP Al-Huda</option>
                    <option value="pondok">Pondok Pesantren</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="admin-category" className="font-semibold text-slate-700">Kategori</label>
                  <input id="admin-category"
                    type="text"
                    name="category"
                    defaultValue={editingNews?.category || 'Pengumuman'}
                    required
                    placeholder="Prestasi / Pengumuman / Kegiatan"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="admin-author" className="font-semibold text-slate-700">Penulis / Author</label>
                  <input id="admin-author"
                    type="text"
                    name="author"
                    defaultValue={editingNews?.author || 'Humas Al-Huda'}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="admin-publishDate" className="font-semibold text-slate-700">Tanggal Terbit</label>
                  <input id="admin-publishDate"
                    type="date"
                    name="publishDate"
                    defaultValue={editingNews?.publishDate || new Date().toISOString().split('T')[0]}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="admin-imageUrl" className="font-semibold text-slate-700">URL Gambar Utama</label>
                <input id="admin-imageUrl"
                  type="url"
                  name="imageUrl"
                  defaultValue={editingNews?.imageUrl}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="admin-excerpt" className="font-semibold text-slate-700">Ringkasan / Excerpt</label>
                <textarea id="admin-excerpt"
                  name="excerpt"
                  rows={2}
                  defaultValue={editingNews?.excerpt}
                  required
                  placeholder="Ringkasan singkat artikel..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label htmlFor="admin-content" className="font-semibold text-slate-700">Konten Lengkap Berita</label>
                <textarea id="admin-content"
                  name="content"
                  rows={5}
                  defaultValue={editingNews?.content}
                  required
                  placeholder="Isi berita lengkap..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  defaultChecked={editingNews?.isFeatured}
                  className="rounded border-slate-300 text-emerald-700"
                />
                <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-700">
                  Tampilkan sebagai Berita Utama (Featured)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button disabled={saving}
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button disabled={saving}
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900"
                >
                  Simpan Berita
                </button>
              </div>
            </fieldset></form>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT STAFF */}
      {isStaffModalOpen && (
        <div className="admin-modal-backdrop">
          <div role="dialog" aria-modal="true" aria-label="Formulir pendidik" className="admin-dialog bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold font-heading text-lg text-slate-900">
                {editingStaff ? 'Edit Personil' : 'Tambah Tenaga Pendidik / Staff'}
              </h3>
              <button disabled={saving}
                aria-label="Tutup dialog" onClick={() => setIsStaffModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3.5 text-xs sm:text-sm">
              {mutationError && <p role="alert" className="admin-error">{mutationError}</p>}
              <fieldset disabled={saving} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="admin-name" className="font-semibold text-slate-700">Nama Lengkap (Beserta Gelar)</label>
                <input id="admin-name"
                  type="text"
                  name="name"
                  defaultValue={editingStaff?.name}
                  required
                  placeholder="Contoh: Ust. Ahmad Fauzi, S.Pd.I"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="admin-role" className="font-semibold text-slate-700">Jabatan / Amanah</label>
                <input id="admin-role"
                  type="text"
                  name="role"
                  defaultValue={editingStaff?.role}
                  required
                  placeholder="Contoh: Guru PAI / Kepala Asrama"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="admin-unit" className="font-semibold text-slate-700">Unit</label>
                  <select disabled={saving} id="admin-unit"
                    name="unit"
                    defaultValue={editingStaff?.unit || 'smp'}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="smp">SMP Al-Huda</option>
                    <option value="pondok">Pondok Pesantren</option>
                    <option value="yayasan">Yayasan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="admin-category" className="font-semibold text-slate-700">Kategori</label>
                  <select disabled={saving} id="admin-category"
                    name="category"
                    defaultValue={editingStaff?.category || 'guru'}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="pimpinan">Pimpinan</option>
                    <option value="pengasuh">Pengasuh</option>
                    <option value="guru">Guru Mapel</option>
                    <option value="ustadz">Ustadz Diniyah</option>
                    <option value="staff">Staff TU / Asrama</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="admin-subject" className="font-semibold text-slate-700">Mata Pelajaran / Kitab</label>
                  <input id="admin-subject"
                    type="text"
                    name="subject"
                    defaultValue={editingStaff?.subject}
                    placeholder="Contoh: Matematika / Fiqih"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="admin-nip" className="font-semibold text-slate-700">NIP / NIY</label>
                  <input id="admin-nip"
                    type="text"
                    name="nip"
                    defaultValue={editingStaff?.nip}
                    placeholder="Opsional"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="admin-imageUrl" className="font-semibold text-slate-700">URL Foto Profil</label>
                <input id="admin-imageUrl"
                  type="url"
                  name="imageUrl"
                  defaultValue={editingStaff?.imageUrl || editingStaff?.photoUrl}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button disabled={saving}
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button disabled={saving}
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-800 text-white hover:bg-blue-900"
                >
                  Simpan Personil
                </button>
              </div>
            </fieldset></form>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT GALLERY */}
      {isGalleryModalOpen && (
        <div className="admin-modal-backdrop">
          <div role="dialog" aria-modal="true" aria-label="Formulir galeri" className="admin-dialog bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold font-heading text-lg text-slate-900">
                Unggah Media Galeri
              </h3>
              <button disabled={saving}
                aria-label="Tutup dialog" onClick={() => setIsGalleryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-3.5 text-xs sm:text-sm">
              {mutationError && <p role="alert" className="admin-error">{mutationError}</p>}
              <fieldset disabled={saving} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="admin-title" className="font-semibold text-slate-700">Judul Kegiatan / Media</label>
                <input id="admin-title"
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Upacara Bendera HUT RI..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="admin-unit" className="font-semibold text-slate-700">Unit</label>
                  <select disabled={saving} id="admin-unit" name="unit" className="w-full p-2.5 rounded-xl border border-slate-200">
                    <option value="yayasan">Yayasan</option>
                    <option value="smp">SMP Al-Huda</option>
                    <option value="pondok">Pondok Pesantren</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="admin-category" className="font-semibold text-slate-700">Kategori</label>
                  <select disabled={saving} id="admin-category" name="category" className="w-full p-2.5 rounded-xl border border-slate-200">
                    <option value="kegiatan">Kegiatan</option>
                    <option value="fasilitas">Fasilitas</option>
                    <option value="prestasi">Prestasi</option>
                    <option value="keagamaan">Keagamaan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="admin-type" className="font-semibold text-slate-700">Tipe Media</label>
                <select disabled={saving} id="admin-type" name="type" className="w-full p-2.5 rounded-xl border border-slate-200">
                  <option value="image">Foto (Gambar)</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="admin-imageUrl" className="font-semibold text-slate-700">URL Gambar / Thumbnail</label>
                <input id="admin-imageUrl"
                  type="url"
                  name="imageUrl"
                  required
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button disabled={saving}
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button disabled={saving}
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700"
                >
                  Simpan Media
                </button>
              </div>
            </fieldset></form>
          </div>
        </div>
      )}

    </div>
  );
};

