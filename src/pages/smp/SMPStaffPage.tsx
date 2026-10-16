import React, { useState } from 'react';
import { Users, Search, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';
import { StaffMember } from '../../types';
import { StaffCard } from '../../components/common/StaffCard';
import { EmptyState } from '../../components/common/EmptyState';
import { contentFor, sectionIsVisible } from '../../data/siteContent';
import type { SiteContentRecord } from '../../types';

interface SMPStaffPageProps {
  staffList: StaffMember[];
  siteContent: SiteContentRecord[];
}

export const SMPStaffPage: React.FC<SMPStaffPageProps> = ({ staffList, siteContent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const page = contentFor('smp.staff.page', siteContent);

  const smpStaff = staffList.filter((s) => s.unit === 'smp');

  const filteredStaff = smpStaff.filter((staff) => {
    const matchCat = selectedCategory === 'all' || staff.category === selectedCategory;
    const matchSearch =
      searchTerm === '' ||
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.subject && staff.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Banner */}
      {sectionIsVisible('smp.staff.page', siteContent) && <section className="bg-gradient-to-b from-blue-950 to-[#0c1f3d] text-white py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-smp-pattern opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <span className="inline-block px-3 py-1 bg-blue-800 text-blue-200 text-xs font-semibold rounded-full border border-blue-600/40">
            {page.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">
            {page.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            {page.description}
          </p>
        </div>
      </section>}

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: page.allStaffLabel },
              { id: 'pimpinan', label: page.leadershipLabel },
              { id: 'guru', label: page.teacherLabel },
              { id: 'staff', label: page.staffLabel },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={page.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
            />
          </div>

          
        </div>
      </section>

      {/* Staff Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {showEmptyState || filteredStaff.length === 0 ? (
          <EmptyState
            title="Data Guru & Staff Belum Tersedia"
            description="Belum ada data guru/staff yang sesuai dengan filter atau kata kunci pencarian."
            icon="search"
            onResetData={() => {
              setShowEmptyState(false);
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredStaff.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

