export type UnitType = 'yayasan' | 'smp' | 'pondok';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  unit: UnitType;
  category: string;
  author: string;
  publishDate: string;
  imageUrl: string;
  isFeatured?: boolean;
  views?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  unit: UnitType;
  category: 'kegiatan' | 'fasilitas' | 'prestasi' | 'keagamaan';
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  imageUrl?: string; // convenient alias
  description?: string;
  date: string;
}

export interface StaffMember {
  id: string;
  name: string;
  title?: string;
  role: string;
  unit: UnitType;
  category: 'pimpinan' | 'guru' | 'asatidz' | 'staff' | 'pengasuh' | 'ustadz';
  education?: string;
  subject?: string;
  photoUrl?: string;
  imageUrl?: string; // alias
  nip?: string;
  bio?: string;
  order?: number;
}

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  level: number; // 1: Pembina/Pengawas, 2: Ketua Yayasan, 3: Sekretaris/Bendahara/Kepala Unit, 4: Bidang
  unit?: UnitType;
  photoUrl?: string;
  parentId?: string | null;
  children?: OrgNode[];
}

export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  unit: UnitType;
  category: string;
  description: string;
}

export interface FacilityItem {
  id: string;
  name: string;
  unit: UnitType;
  description: string;
  imageUrl: string;
  features?: string[];
}

export interface ExtracurricularItem {
  id: string;
  name: string;
  category: 'olahraga' | 'seni_budaya' | 'keagamaan' | 'akademik_it';
  schedule: string;
  coach: string;
  description: string;
  imageUrl: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  description: string;
  type?: 'ibadah' | 'diniyah' | 'formal' | 'tahfidz' | 'istirahat';
  category?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  unit?: UnitType;
  targetUnit?: UnitType;
  createdAt: string;
  status?: 'unread' | 'read' | 'replied';
  isRead?: boolean;
}

export interface SiteContentRecord {
  id: string;
  page: string;
  label: string;
  data: Record<string, unknown>;
  visible: boolean;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  unit: UnitType;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
}
