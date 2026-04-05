import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useCatalogStore } from '../../catalog/catalogStore';
import { invalidateCatalogQueries } from '../../catalog/catalogInvalidate';
import { createEmptyPackage } from '../../catalog/defaults';
import PackageFormModal from '../../components/admin/PackageFormModal';
import { usePackages } from '../../hooks/usePackages';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import type { TourPackage } from '../../data/packages';

export default function AdminPackagesPage() {
  const { currency } = useCurrency();
  const { refetch } = usePackages();
  const packages = useCatalogStore(s => s.packages);
  const upsertPackage = useCatalogStore(s => s.upsertPackage);
  const deletePackage = useCatalogStore(s => s.deletePackage);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Edit package');
  const [editing, setEditing] = useState<TourPackage | null>(null);

  function openNew() {
    setEditing(createEmptyPackage());
    setModalTitle('New package');
    setModalOpen(true);
  }

  function openEdit(pkg: TourPackage) {
    setEditing(pkg);
    setModalTitle(`Edit — ${pkg.name}`);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSave(pkg: TourPackage) {
    upsertPackage(pkg);
    invalidateCatalogQueries();
    void refetch();
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete package “${name}”? This cannot be undone.`)) return;
    deletePackage(id);
    invalidateCatalogQueries();
    void refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Packages</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Edit with the form (labels, lists, itinerary, images). Use <strong>Raw JSON</strong> inside the editor only if
            you need full control. Data is stored in this browser.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#003580] text-white font-bold rounded-lg hover:bg-[#002560] text-sm shrink-0"
        >
          <Plus size={18} />
          Add package
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
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Price</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.map(pkg => (
                <tr key={pkg.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 max-w-[140px] truncate">{pkg.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{pkg.name}</td>
                  <td className="px-4 py-3 text-gray-600">{pkg.type}</td>
                  <td className="px-4 py-3 text-right font-semibold text-[#003580]">
                    {formatCurrency(pkg.price, currency)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => openEdit(pkg)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-[#003580] hover:bg-blue-50 rounded"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <Link
                        to={`/packages/${pkg.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <ExternalLink size={14} /> View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg.id, pkg.name)}
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
        <PackageFormModal
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
