import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Tag, Play } from 'lucide-react';
import { GalleryItem } from '../../types';
import { getUnitBadge } from './NewsCard';

interface LightboxProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ item, items, onClose, onSelect }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!item) return;
      const currentIndex = items.findIndex((i) => i.id === item.id);
      if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
        onSelect(items[currentIndex + 1]);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onSelect(items[currentIndex - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, items, onClose, onSelect]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const badge = getUnitBadge(item.unit);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onSelect(items[currentIndex - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < items.length - 1) {
      onSelect(items[currentIndex + 1]);
    }
  };

  return (
    <div
      id="lightbox-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all animate-fadeIn"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        id="lightbox-close-btn"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 hover:text-white"
        aria-label="Tutup lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev / Next controls */}
      {currentIndex > 0 && (
        <button
          id="lightbox-prev-btn"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      {currentIndex < items.length - 1 && (
        <button
          id="lightbox-next-btn"
          onClick={handleNext}
          className="absolute right-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"
          aria-label="Selanjutnya"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}

      {/* Content */}
      <div
        className="relative max-w-4xl max-h-[90vh] w-full flex flex-col bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {item.type === 'video' ? (
            <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/40">
                <div className="h-16 w-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg mb-3">
                  <Play className="h-8 w-8 fill-white translate-x-0.5" />
                </div>
                <p className="text-white text-sm font-medium">Video Dokumenter Galeri</p>
                <p className="text-xs text-slate-300 mt-1 max-w-md">Klik untuk menonton dokumenter kegiatan resmi Yayasan Al-Huda</p>
              </div>
            </div>
          ) : (
            <img
              src={item.mediaUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        <div className="p-6 bg-slate-900 text-white space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}></span>
                {badge.label}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <Tag className="w-3 h-3 text-amber-400" />
                {item.category.toUpperCase()}
              </span>
            </div>

            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(item.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold font-heading text-white">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
          )}

          <div className="pt-2 flex justify-between text-xs text-slate-500">
            <span>Foto {currentIndex + 1} dari {items.length}</span>
            <span className="hidden sm:inline">Gunakan tombol panah ◀ ▶ keyboard untuk navigasi</span>
          </div>
        </div>
      </div>
    </div>
  );
};
