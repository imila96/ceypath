import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useCatalogStore } from '../../catalog/catalogStore';
import { invalidateCatalogQueries } from '../../catalog/catalogInvalidate';
import { createEmptyDestination } from '../../catalog/defaults';
import DestinationFormModal from '../../components/admin/DestinationFormModal';
import { useDestinations } from '../../hooks/useDestinations';
import type { Destination } from '../../data/destinations';

export default function AdminDestinationsPage() {
  const { refetch } = useDestinations();
  const destinations = useCatalogStore(s => s.destinations);
  const upsertDestination = useCatalogStore(s => s.upsertDestination);
  const deleteDestination = useCatalogStore(s => s.deleteDestination);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Edit destination');
  const [editing, setEditing] = useState<Destination | null>(null);

  function openNew() {
    setEditing(createEmptyDestination());
    setModalTitle('New destination');
    setModalOpen(true);
  }

  function openEdit(d: Destination) {
    setEditing(d);
    setModalTitle(`Edit — ${d.name}`);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSave(d: Destination) {
    upsertDestination(d);
    invalidateCatalogQueries();
    void refetch();
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete destination “${name}”?`)) return;
    deleteDestination(id);
    invalidateCatalogQueries();
    void refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Destinations</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Friendly form for text and attractions. <strong>Raw JSON</strong> is available inside the editor if needed.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#003580] text-white font-bold rounded-lg hover:bg-[#002560] text-sm"
        >
          <Plus size={18} />
          Add destination
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Slug</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Tagline</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {destinations.map(d => (
                <tr key={d.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{d.slug}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{d.name}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{d.tagline}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => openEdit(d)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-[#003580] hover:bg-blue-50 rounded"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <Link
                        to={`/destinations/${d.slug}`}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <ExternalLink size={14} /> View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(d.id, d.name)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && editing && (
        <DestinationFormModal
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
