import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, dataError } from '../lib/supabase';
import { readTable } from '../lib/database';
import type { NewsItem, GalleryItem, StaffMember, ContactMessage, AgendaItem, SiteContentRecord } from '../types';

export function useWebsiteData() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [agendaList, setAgendaList] = useState<AgendaItem[]>([]);
  const [siteContentList, setSiteContentList] = useState<SiteContentRecord[]>([]);
  const [siteContentAvailable, setSiteContentAvailable] = useState<boolean | null>(null);
  const [contactList, setContactList] = useState<ContactMessage[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [adminState, setAdminState] = useState<'signedOut' | 'checking' | 'authorized' | 'denied'>('signedOut');
  const [publicError, setPublicError] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [publicLoading, setPublicLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const retry = useCallback(() => setRevision(value => value + 1), []);

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAdminState(nextSession ? 'checking' : 'signedOut');
      // Clear private in-memory data immediately on sign-out/session changes.
      setContactList([]);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setPublicLoading(true); setPublicError(null);
    const contentRequest = readTable('site_content').then(records => ({ records, available: true })).catch(error => {
      const code = (error as { code?: string })?.code;
      if (code === 'PGRST205' || code === '42P01') return { records: [] as SiteContentRecord[], available: false };
      throw error;
    });
    Promise.all([readTable('news'), readTable('gallery'), readTable('staff'), readTable('agenda'), contentRequest])
      .then(([news, gallery, staff, agenda, content]) => {
        if (cancelled) return;
        setNewsList(news); setGalleryList(gallery); setStaffList(staff); setAgendaList(agenda); setSiteContentList(content.records); setSiteContentAvailable(content.available);
      }).catch(error => { if (!cancelled) setPublicError(dataError(error)); })
      .finally(() => { if (!cancelled) setPublicLoading(false); });
    return () => { cancelled = true; };
  }, [revision]);

  useEffect(() => {
    let cancelled = false;
    if (!session || !supabase) { setAdminState('signedOut'); return; }
    setAdminState('checking'); setAdminError(null);
    (async () => {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      if (!data) { if (!cancelled) { setAdminState('denied'); setAdminError('Akun ini belum diberi akses admin oleh pengelola.'); } return; }
      const contacts = await readTable('contact_messages');
      if (!cancelled) { setContactList(contacts); setAdminState('authorized'); }
    })().catch(error => { if (!cancelled) { setAdminState('denied'); setAdminError(dataError(error)); } });
    return () => { cancelled = true; };
  }, [session, revision]);

  return { newsList, setNewsList, galleryList, setGalleryList, staffList, setStaffList,
    agendaList, siteContentList, setSiteContentList, siteContentAvailable, contactList, setContactList,
    session, adminState, publicError, adminError, publicLoading, retry };
}
