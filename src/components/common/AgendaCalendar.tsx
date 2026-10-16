import React, { useState } from 'react';
import { AgendaItem, UnitType } from '../../types';
import { getUnitBadge } from './NewsCard';
interface AgendaCalendarProps { agendaList: AgendaItem[]; currentUnit?: UnitType; }
export const AgendaCalendar: React.FC<AgendaCalendarProps> = ({ agendaList, currentUnit }) => {
  const [selectedUnit, setSelectedUnit] = useState(currentUnit || 'all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const filtered = agendaList.filter(item => selectedUnit === 'all' || item.unit === selectedUnit);
  return <div id="agenda-calendar-component" className="agenda-calendar">
    {!currentUnit && <div className="agenda-filters" role="group" aria-label="Filter agenda">{[{ id: 'all', label: 'Semua' }, { id: 'yayasan', label: 'Yayasan' }, { id: 'smp', label: 'SMP' }, { id: 'pondok', label: 'Pesantren' }].map(tab => <button key={tab.id} aria-pressed={selectedUnit === tab.id} onClick={() => setSelectedUnit(tab.id)}>{tab.label}</button>)}</div>}
    <div aria-live="polite">{filtered.length === 0 ? <p className="empty-message">Belum ada agenda untuk lembaga ini.</p> : filtered.map(item => <article key={item.id} className="agenda-entry" id={`agenda-item-${item.id}`}><button className="agenda-trigger" aria-expanded={activeId === item.id} aria-controls={`agenda-detail-${item.id}`} onClick={() => setActiveId(activeId === item.id ? null : item.id)}><time className="agenda-date" dateTime={item.date}><strong>{new Date(item.date).getDate()}</strong><span>{new Date(item.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span></time><span className="agenda-event"><span className="agenda-unit">{getUnitBadge(item.unit).label} · {item.category}</span><span className="agenda-title">{item.title}</span><span className="agenda-time">{item.time}</span></span><span className="agenda-expand" aria-hidden="true">{activeId === item.id ? '−' : '+'}</span></button><div id={`agenda-detail-${item.id}`} hidden={activeId !== item.id} className="agenda-detail"><p>{item.description}</p><p>Lokasi: {item.location}</p>{item.endDate && <p>Sampai {new Date(item.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}</div></article>)}</div>
  </div>;
};
