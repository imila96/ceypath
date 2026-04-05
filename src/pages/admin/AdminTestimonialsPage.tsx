import React, { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCatalogStore } from '../../catalog/catalogStore';
import { createEmptyTestimonial } from '../../catalog/defaults';
import TestimonialFormModal from '../../components/admin/TestimonialFormModal';
import type { Testimonial } from '../../data/testimonials';

export default function AdminTestimonialsPage() {
  const testimonials = useCatalogStore(s => s.testimonials);
  const upsertTestimonial = useCatalogStore(s => s.upsertTestimonial);
  const deleteTestimonial = useCatalogStore(s => s.deleteTestimonial);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Edit testimonial');
  const [editing, setEditing] = useState<Testimonial | null>(null);

  function openNew() {
    setEditing(createEmptyTestimonial());
    setModalTitle('New testimonial');
    setModalOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setModalTitle(`Edit — ${t.name}`);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSave(t: Testimonial) {
    upsertTestimonial(t);
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete testimonial from “${name}”?`)) return;
    deleteTestimonial(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Testimonials</h2>
          <p className="text-gray-600 mt-1 text-sm">All fields in a form; Raw JSON optional.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#003580] text-white font-bold rounded-lg hover:bg-[#002560] text-sm"
        >
          <Plus size={18} />
          Add testimonial
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Package</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Excerpt</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {testimonials.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{t.packageName}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-md truncate">{t.text}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(t)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-[#003580] hover:bg-blue-50 rounded mr-1"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id, t.name)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && editing && (
        <TestimonialFormModal
          open={modalOpen}
          title={modalTitle}
          initial={editing}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
