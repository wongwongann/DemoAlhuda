import React, { useState } from 'react';
import { ChevronDown, ChevronRight, User, Shield, BookOpen, Search, Layers, LayoutGrid } from 'lucide-react';
import { OrgNode, UnitType } from '../../types';

interface OrgChartProps {
  data: OrgNode;
}

export const OrgChart: React.FC<OrgChartProps> = ({ data }) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'org-root': true,
    'org-ketua': true,
    'org-smp': true,
    'org-pondok': true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'card'>('tree');

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const expandAll = () => {
    setExpandedNodes({
      'org-root': true,
      'org-pengawas': true,
      'org-ketua': true,
      'org-sekretaris': true,
      'org-bendahara': true,
      'org-smp': true,
      'org-pondok': true,
    });
  };

  const collapseAll = () => {
    setExpandedNodes({ 'org-root': true });
  };

  const getNodeColor = (node: OrgNode) => {
    if (node.unit === 'smp') {
      return {
        border: 'border-blue-700',
        bg: 'bg-blue-50/90 text-blue-950',
        badge: 'bg-blue-800 text-blue-50',
        iconColor: 'text-blue-700',
      };
    }
    if (node.unit === 'pondok') {
      return {
        border: 'border-amber-600',
        bg: 'bg-amber-50/90 text-amber-950',
        badge: 'bg-amber-800 text-amber-50',
        iconColor: 'text-amber-700',
      };
    }
    return {
      border: 'border-emerald-800',
      bg: 'bg-emerald-50/90 text-emerald-950',
      badge: 'bg-emerald-900 text-emerald-50',
      iconColor: 'text-emerald-800',
    };
  };

  const renderTreeNode = (node: OrgNode, isLast = false): React.ReactNode => {
    const isExpanded = expandedNodes[node.id] !== false;
    const hasChildren = node.children && node.children.length > 0;
    const colors = getNodeColor(node);

    const matchesSearch = searchTerm === '' || 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      node.role.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      <div key={node.id} className="flex flex-col items-center relative my-3">
        {/* Node Card */}
        <div
          id={`org-node-${node.id}`}
          onClick={() => hasChildren && toggleNode(node.id)}
          className={`relative z-10 w-64 sm:w-72 rounded-xl border-2 ${colors.border} bg-white shadow-md p-4 transition-all duration-200 hover:shadow-lg ${hasChildren ? 'cursor-pointer' : ''} ${!matchesSearch ? 'opacity-40' : 'opacity-100 ring-2 ring-emerald-500/20'}`}
        >
          <div className="flex items-start gap-3">
            {node.photoUrl ? (
              <img
                src={node.photoUrl}
                alt={node.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shrink-0"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center shrink-0 border border-slate-200`}>
                <User className={`w-6 h-6 ${colors.iconColor}`} />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${colors.badge}`}>
                {node.role}
              </span>
              <h4 className="text-sm font-bold font-heading text-slate-900 truncate leading-snug">
                {node.name}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Level {node.level} • {node.unit ? node.unit.toUpperCase() : 'YAYASAN'}
              </p>
            </div>

            {hasChildren && (
              <button
                className="text-slate-400 hover:text-slate-700 p-1"
                aria-label="Toggle node"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col items-center w-full">
            {/* Connecting Vertical Line down from parent */}
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Sub-branch container */}
            <div className="relative flex flex-wrap justify-center gap-4 sm:gap-6 pt-2 before:absolute before:top-0 before:left-12 before:right-12 before:h-0.5 before:bg-slate-300">
              {node.children!.map((child, idx) => (
                <div key={child.id} className="relative flex flex-col items-center">
                  {/* Vertical drop line to child */}
                  <div className="w-0.5 h-4 bg-slate-300"></div>
                  {renderTreeNode(child, idx === node.children!.length - 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Flattened List for Cards mode
  const flattenNodes = (node: OrgNode, result: OrgNode[] = []): OrgNode[] => {
    result.push(node);
    if (node.children) {
      node.children.forEach((c) => flattenNodes(c, result));
    }
    return result;
  };

  const allNodes = flattenNodes(data);
  const filteredNodes = allNodes.filter(
    (n) =>
      searchTerm === '' ||
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="org-structure-container" className="w-full space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama pengurus atau jabatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* View & Expand Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'tree' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              Bagan Pohon
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'card' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Grid Kartu
            </button>
          </div>

          {viewMode === 'tree' && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={expandAll}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Buka Semua
              </button>
              <button
                onClick={collapseAll}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 px-2">
        <span className="font-semibold text-slate-700">Keterangan:</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-800"></span>
          Pengurus Yayasan
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-800"></span>
          SMP Al-Huda
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-600"></span>
          Pondok Pesantren Al-Huda
        </span>
      </div>

      {/* Structure View */}
      {viewMode === 'tree' ? (
        <div className="w-full overflow-x-auto pb-8 pt-4 rounded-2xl bg-white border border-slate-200/80 p-6 min-h-[400px] flex justify-center shadow-inner">
          <div className="min-w-fit">
            {renderTreeNode(data)}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node) => {
            const colors = getNodeColor(node);
            return (
              <div
                key={node.id}
                className={`p-4 rounded-xl border-2 ${colors.border} bg-white shadow-sm hover:shadow-md transition-all flex items-start gap-3`}
              >
                {node.photoUrl ? (
                  <img
                    src={node.photoUrl}
                    alt={node.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border shrink-0"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center shrink-0`}>
                    <User className={`w-6 h-6 ${colors.iconColor}`} />
                  </div>
                )}
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${colors.badge}`}>
                    {node.role}
                  </span>
                  <h4 className="text-sm font-bold font-heading text-slate-900">
                    {node.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Struktur Level {node.level} • {node.unit ? node.unit.toUpperCase() : 'YAYASAN'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
