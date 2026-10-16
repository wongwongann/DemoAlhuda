import React from 'react';
import { Play, ZoomIn, Calendar } from 'lucide-react';
import { GalleryItem } from '../../types';
import { getUnitBadge } from './NewsCard';

interface GalleryCardProps {
  item: GalleryItem;
  onClick: (item: GalleryItem) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onClick }) => {
  const badge = getUnitBadge(item.unit);

  const formattedDate = new Date(item.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      id={`gallery-item-${item.id}`}
      onClick={() => onClick(item)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={item.thumbnailUrl || item.mediaUrl}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4">
          <div className="flex justify-end">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform group-hover:scale-110">
              {item.type === 'video' ? (
                <Play className="h-4 w-4 fill-white" />
              ) : (
                <ZoomIn className="h-4 w-4" />
              )}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              {item.category}
            </p>
            <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
              {item.title}
            </h4>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none group-hover:opacity-0 transition-opacity">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md border ${badge.bg}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}></span>
            {badge.label}
          </span>
          {item.type === 'video' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-600/90 text-white backdrop-blur-md">
              <Play className="w-2.5 h-2.5 fill-white" />
              Video
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-1.5 bg-white">
        <h4 className="text-sm font-bold font-heading text-slate-800 line-clamp-1 group-hover:text-emerald-800 transition-colors">
          {item.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-700" />
            {formattedDate}
          </span>
          <span className="capitalize font-medium text-slate-500">{item.category}</span>
        </div>
      </div>
    </div>
  );
};
