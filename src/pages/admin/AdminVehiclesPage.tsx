import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useCatalogStore } from '../../catalog/catalogStore';
import { invalidateCatalogQueries } from '../../catalog/catalogInvalidate';
import { createEmptyVehicle } from '../../catalog/defaults';
import VehicleFormModal from '../../components/admin/VehicleFormModal';
import { useVehicles } from '../../hooks/useVehicles';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import type { Vehicle } from '../../data/vehicles';

export default function AdminVehiclesPage() {
  const { currency } = useCurrency();
  const { refetch } = useVehicles();
  const vehicles = useCatalogStore(s => s.vehicles);
  const upsertVehicle = useCatalogStore(s => s.upsertVehicle);
  const deleteVehicle = useCatalogStore(s => s.deleteVehicle);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Edit vehicle');
  const [editing, setEditing] = useState<Vehicle | null>(null);

  function openNew() {
    setEditing(createEmptyVehicle());
    setModalTitle('New vehicle');
    setModalOpen(true);
  }

  function openEdit(v: Vehicle) {
    setEditing(v);
    setModalTitle(`Edit — ${v.name}`);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSave(v: Vehicle) {
    upsertVehicle(v);
    invalidateCatalogQueries();
    void refetch();
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete vehicle “${name}”?`)) return;
    deleteVehicle(id);
    invalidateCatalogQueries();
    void refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Vehicles</h2>
          <p className="text-gray-600 mt-1 text-sm">Form fields for fleet; optional Raw JSON for edge cases.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#003580] text-white font-bold rounded-lg hover:bg-[#002560] text-sm"
        >
          <Plus size={18} />
          Add vehicle
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Daily</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{v.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{v.name}</td>
                  <td className="px-4 py-3 text-gray-600">{v.type}</td>
                  <td className="px-4 py-3 text-right font-semibold text-[#003580]">
                    {formatCurrency(v.dailyRate, currency)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => openEdit(v)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-[#003580] hover:bg-blue-50 rounded"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <Link
                        to="/vehicles"
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <ExternalLink size={14} /> Fleet
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(v.id, v.name)}
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
        <VehicleFormModal
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
