import React from 'react';
import { X } from 'lucide-react';

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  wide?: boolean;
};

export default function AdminModalShell({ title, onClose, children, footer, wide }: Props) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close" onClick={onClose} />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full ${
          wide ? 'max-w-5xl' : 'max-w-lg'
        } max-h-[92vh] flex flex-col`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 pr-4">{title}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 shrink-0">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-5">{children}</div>
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl shrink-0 flex flex-wrap gap-2 justify-end">
          {footer}
        </div>
      </div>
    </div>
  );
}
