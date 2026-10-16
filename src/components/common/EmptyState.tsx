import React from 'react';
import { Database, PlusCircle, RefreshCw, FolderSearch, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'data' | 'search' | 'alert' | 'general';
  actionLabel?: string;
  onAction?: () => void;
  onResetData?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Belum Ada Data Tersedia',
  description = 'Informasi untuk bagian ini belum tersedia. Silakan kembali lagi nanti.',
  icon = 'data',
  actionLabel,
  onAction,
  onResetData,
  className = '',
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'search':
        return <FolderSearch className="w-8 h-8 text-emerald-700" />;
      case 'alert':
        return <AlertCircle className="w-8 h-8 text-amber-600" />;
      case 'data':
      default:
        return <Database className="w-8 h-8 text-emerald-800" />;
    }
  };

  return (
    <div
      id="empty-state-card"
      className={`w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/80 ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 mb-4 shadow-sm">
        {renderIcon()}
      </div>

      <h3 className="text-base sm:text-lg font-bold font-heading text-slate-800 mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            {actionLabel}
          </button>
        )}

        {onResetData && (
          <button
            onClick={onResetData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Atur ulang tampilan
          </button>
        )}
      </div>


    </div>
  );
};

