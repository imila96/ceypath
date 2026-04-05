import React, { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCatalogStore } from '../../catalog/catalogStore';
import { createEmptyHotel } from '../../catalog/defaults';
import HotelFormModal from '../../components/admin/HotelFormModal';
import type { Hotel } from '../../data/hotels';

export default function AdminHotelsPage() {
  const hotels = useCatalogStore(s => s.hotels);
  const upsertHotel = useCatalogStore(s => s.upsertHotel);
  const deleteHotel = useCatalogStore(s => s.deleteHotel);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Edit hotel');
  const [editing, setEditing] = useState<Hotel | null>(null);

  function openNew() {
    setEditing(createEmptyHotel());
    setModalTitle('New hotel');
    setModalOpen(true);
  }

  function openEdit(h: Hotel) {
    setEditing(h);
    setModalTitle(`Edit — ${h.name}`);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSave(h: Hotel) {
    upsertHotel(h);
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete hotel “${name}”?`)) return;
    deleteHotel(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Hotels</h2>
          <p className="text-gray-600 mt-1 text-sm">Form-based editing; Raw JSON optional in the modal.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#003580] text-white font-bold rounded-lg hover:bg-[#002560] text-sm"
        >
          <Plus size={18} />
          Add hotel
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Destination</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Tier</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">$/night</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hotels.map(h => (
                <tr key={h.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-2 font-mono text-xs text-gray-600 max-w-[100px] truncate">{h.id}</td>
                  <td className="px-4 py-2 font-medium text-gray-900">{h.name}</td>
                  <td className="px-4 py-2 text-gray-600">{h.destination}</td>
                  <td className="px-4 py-2 text-gray-600">{h.tier}</td>
                  <td className="px-4 py-2 text-right">{h.pricePerNight}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(h)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-[#003580] hover:bg-blue-50 rounded mr-1"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(h.id, h.name)}
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
        <HotelFormModal
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
