import React from 'react';
import { Award, BookOpen, GraduationCap } from 'lucide-react';
import { StaffMember } from '../../types';
import { getUnitBadge } from './NewsCard';

interface StaffCardProps {
  staff: StaffMember;
  onClick?: (staff: StaffMember) => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({ staff, onClick }) => {
  const badge = getUnitBadge(staff.unit);

  return (
    <div
      id={`staff-card-${staff.id}`}
      onClick={() => onClick?.(staff)}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col"
    >
      <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-slate-100">
        <img
          src={staff.photoUrl}
          alt={staff.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md border ${badge.bg}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}></span>
            {badge.label}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
            {staff.role}
          </p>
          <h4 className="text-base font-bold font-heading text-white leading-tight mt-0.5 drop-shadow-sm">
            {staff.name}
          </h4>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-2">
          {staff.title && (
            <p className="text-xs font-medium text-slate-700 leading-snug">
              {staff.title}
            </p>
          )}

          {staff.subject && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="font-medium text-slate-800">{staff.subject}</span>
            </div>
          )}

          {staff.education && (
            <div className="flex items-start gap-1.5 text-xs text-slate-500">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{staff.education}</span>
            </div>
          )}
        </div>

        {staff.bio && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 italic line-clamp-2">
              {staff.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
