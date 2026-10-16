import { dataError } from '../../lib/supabase';
import React, { useRef, useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { ContactMessage, UnitType } from '../../types';

interface ContactFormProps {
  defaultUnit?: UnitType;
  onSubmitSuccess: (msg: ContactMessage) => Promise<ContactMessage>;
}

export const ContactForm: React.FC<ContactFormProps> = ({ defaultUnit = 'yayasan', onSubmitSuccess }) => {
  const requestId = useRef(crypto.randomUUID());
  const submittingRef = useRef(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    targetUnit: defaultUnit,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Nama lengkap wajib diisi';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Email tidak valid';
    if (!formData.phone.trim()) errs.phone = 'Nomor telepon/WhatsApp wajib diisi';
    if (!formData.subject.trim()) errs.subject = 'Subjek pesan wajib diisi';
    if (!formData.message.trim() || formData.message.length < 10) errs.message = 'Pesan minimal 10 karakter';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || !validate()) return;

    setIsSubmitting(true); submittingRef.current = true; setSubmitError(null);
    try {
      const newMsg: ContactMessage = {
        id: requestId.current,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        targetUnit: formData.targetUnit,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        isRead: false,
      };

      await onSubmitSuccess(newMsg);
      setIsSuccess(true);
    } catch (error) { setSubmitError(dataError(error)); }
    finally { setIsSubmitting(false); submittingRef.current = false; }
  };

  if (isSuccess) {
    return (
      <div id="contact-form-success" className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fadeIn">
        <div className="w-14 h-14 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold font-heading text-emerald-950">
          Pesan Berhasil Terkirim!
        </h3>
        <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
          Terima kasih telah menghubungi kami. Sekretariat Yayasan / Unit akan merespons melalui WhatsApp atau Email dalam 1x24 jam kerja.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSuccess(false); requestId.current = crypto.randomUUID();
            setFormData({
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: '',
              targetUnit: defaultUnit,
            });
          }}
          className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm transition-all"
        >
          Kirim Pesan Lainnya
        </button>
      </div>
    );
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
      {submitError && <p role="alert" className="form-server-error">{submitError}</p>}
      <div className="space-y-1">
        <h3 className="text-lg font-bold font-heading text-slate-900">
          Kirim Pesan atau Pertanyaan
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Silakan isi formulir di bawah ini untuk pertanyaan, kunjungan, atau kerja sama.
        </p>
      </div>

      {/* Target Unit Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Tujuan Unit / Lembaga <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'yayasan', label: 'Yayasan' },
            { id: 'smp', label: 'SMP Al-Huda' },
            { id: 'pondok', label: 'Pondok Pesantren' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFormData({ ...formData, targetUnit: item.id as UnitType })}
              className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                formData.targetUnit === item.id
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Bapak Hendra"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            No. WhatsApp / Telepon <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="08123456789"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
          {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Aktif <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="nama@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Subjek Pesan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Pertanyaan tentang sekolah dan pesantren"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
          {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Isi Pesan <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Tuliskan pertanyaan atau keperluan Anda secara rinci..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
        ></textarea>
        {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-800 text-white hover:bg-emerald-900 shadow-md transition-all disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}
      </button>
    </form>
  );
};
