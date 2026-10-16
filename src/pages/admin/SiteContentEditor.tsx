import React, { useEffect, useMemo, useState } from 'react';
import { Save, Eye, EyeOff, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { siteContentDefinitions } from '../../data/siteContent';
import type { SiteContentRecord } from '../../types';
import type { SiteContentListItem } from '../../data/siteContent';

interface SiteContentEditorProps {
  records: SiteContentRecord[];
  saving: boolean;
  databaseReady: boolean | null;
  onSave: (record: SiteContentRecord) => void;
}

export const SiteContentEditor: React.FC<SiteContentEditorProps> = ({ records, saving, databaseReady, onSave }) => {
  const pages = [...new Set(siteContentDefinitions.map(section => section.page))];
  const [page, setPage] = useState(pages[0]);
  const sections = useMemo(() => siteContentDefinitions.filter(section => section.page === page), [page]);
  const [selectedId, setSelectedId] = useState(sections[0]?.id || '');
  const definition = siteContentDefinitions.find(section => section.id === selectedId) || sections[0];
  const saved = records.find(record => record.id === definition?.id);
  const orderOnly = definition?.fields.some(field => field.orderOnly) ?? false;
  const [data, setData] = useState<Record<string, unknown>>(definition?.data || {});
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!sections.some(section => section.id === selectedId)) setSelectedId(sections[0]?.id || '');
  }, [sections, selectedId]);
  useEffect(() => {
    if (!definition) return;
    const current = records.find(record => record.id === definition.id);
    setData({ ...definition.data, ...(current?.data || {}) });
    setVisible(current?.visible ?? true);
  }, [definition, records]);

  if (!definition) return null;
  return <section className="admin-content-editor">
    <div className="admin-content-intro">
      <div><p className="admin-nav-label">Editor halaman</p><h2>Atur tulisan yang tampil di website</h2><p>Pilih halaman dan bagian. Perubahan tersimpan ke Supabase setelah Anda menekan tombol simpan.</p></div>
      <span className="admin-content-status">{saved ? 'Sudah tersimpan' : 'Menggunakan isi awal'}</span>
    </div>
    {databaseReady === false && <p role="status" className="admin-content-migration">Editor ini belum aktif di database. Minta pengelola menjalankan migrasi <code>supabase/migrations/202610170001_site_content.sql</code>, lalu muat ulang website.</p>}
    <div className="admin-content-selectors">
      <label>Halaman<select value={page} onChange={event => { setPage(event.target.value); const first = siteContentDefinitions.find(section => section.page === event.target.value); setSelectedId(first?.id || ''); }}>
        {pages.map(item => <option key={item}>{item}</option>)}
      </select></label>
      <label>Bagian<select value={definition.id} onChange={event => setSelectedId(event.target.value)}>
        {sections.map(section => <option key={section.id} value={section.id}>{section.label}</option>)}
      </select></label>
    </div>
    {orderOnly && <p className="admin-content-order-help">Gunakan panah untuk menyusun ulang bagian. Perubahan baru tampil setelah disimpan.</p>}
    <div className="admin-content-fields">
      {definition.fields.map(field => <div className="admin-content-field" key={field.key}>
        <span>{field.label}</span>
        {field.collection ? <div className="admin-content-list">
          {((data[field.key] as SiteContentListItem[] | undefined) || []).map((item, index, items) => <fieldset className="admin-content-item" key={item.id || index}>
            <legend>{field.label} {index + 1}</legend>
            <div className="admin-content-item-actions">
              <button type="button" aria-label="Pindah ke atas" disabled={saving || index === 0} onClick={() => setData(previous => { const next = [...((previous[field.key] as SiteContentListItem[]) || [])]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return { ...previous, [field.key]: next }; })}><ChevronUp size={16} /></button>
              <button type="button" aria-label="Pindah ke bawah" disabled={saving || index === items.length - 1} onClick={() => setData(previous => { const next = [...((previous[field.key] as SiteContentListItem[]) || [])]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; return { ...previous, [field.key]: next }; })}><ChevronDown size={16} /></button>
              {!field.orderOnly && <button type="button" aria-label="Hapus item" disabled={saving} onClick={() => setData(previous => ({ ...previous, [field.key]: ((previous[field.key] as SiteContentListItem[]) || []).filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 size={15} /></button>}
            </div>
            <div className="admin-content-item-fields">{field.collection!.map(itemField => {
              const choices = itemField.relation === 'earlier-item'
                ? items.slice(0, index).map(previousItem => ({ value: previousItem.id, label: previousItem.name || previousItem.role || 'Pengurus' }))
                : itemField.options;
              const updateValue = (value: string) => setData(previous => { const next = [...((previous[field.key] as SiteContentListItem[]) || [])]; next[index] = { ...next[index], [itemField.key]: value }; return { ...previous, [field.key]: next }; });
              if (itemField.readOnly) return <div className="admin-content-item-readonly" key={itemField.key}><span>{itemField.label}</span><strong>{item[itemField.key]}</strong></div>;
              return <label key={itemField.key}><span>{itemField.label}</span>{choices
                ? <select value={String(item[itemField.key] || '')} onChange={event => updateValue(event.target.value)}>
                  {itemField.relation && <option value="">Tanpa atasan</option>}
                  {choices.map(choice => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
                </select>
                : itemField.multiline
                  ? <textarea rows={3} value={String(item[itemField.key] || '')} onChange={event => updateValue(event.target.value)} />
                  : <input type={itemField.inputType || 'text'} value={String(item[itemField.key] || '')} onChange={event => updateValue(event.target.value)} />}</label>;
            })}</div>
          </fieldset>)}
          {!field.orderOnly && <button type="button" className="admin-content-add" disabled={saving} onClick={() => { const item: SiteContentListItem = { id: `item-${Date.now()}`, ...Object.fromEntries(field.collection!.map(input => [input.key, ''])) }; setData(previous => ({ ...previous, [field.key]: [...((previous[field.key] as SiteContentListItem[]) || []), item] })); }}><Plus size={16} />Tambah {field.label.toLocaleLowerCase('id')}</button>}
        </div> : field.options
          ? <select aria-label={field.label} value={String(data[field.key] || '')} onChange={event => setData(previous => ({ ...previous, [field.key]: event.target.value }))}>{field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
          : field.multiline
          ? <textarea aria-label={field.label} rows={4} value={String(data[field.key] || '')} onChange={event => setData(previous => ({ ...previous, [field.key]: event.target.value }))} />
          : <input aria-label={field.label} type={field.inputType || 'text'} value={String(data[field.key] || '')} onChange={event => setData(previous => ({ ...previous, [field.key]: event.target.value }))} />}
      </div>)}
    </div>
    <div className="admin-content-actions">
      {!orderOnly && <label className="admin-content-visibility"><input type="checkbox" checked={visible} onChange={event => setVisible(event.target.checked)} />
        {visible ? <Eye size={17} aria-hidden="true" /> : <EyeOff size={17} aria-hidden="true" />}
        <span>{visible ? 'Bagian ditampilkan' : 'Bagian disembunyikan'}</span>
      </label>}
      <button className="button-primary" disabled={saving || databaseReady !== true} onClick={() => onSave({ id: definition.id, page: definition.page, label: definition.label, data, visible })}><Save size={16} />{saving ? 'Menyimpan…' : databaseReady === null ? 'Memeriksa database…' : 'Simpan perubahan'}</button>
    </div>
  </section>;
};
