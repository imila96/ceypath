import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, X } from 'lucide-react';
import { PackagePriceBreakdown } from '../../utils/priceCalculator';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface Props {
  breakdown: PackagePriceBreakdown;
  adults: number;
  children: number;
  packageName?: string;
  onReserve?: () => void;
  mode?: 'package' | 'customizer';
  showGetQuote?: boolean;
}

export default function PriceSummary({ breakdown, adults, children, packageName, onReserve, mode = 'package', showGetQuote }: Props) {
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const totalRef = useRef<HTMLSpanElement>(null);
  const [animate, setAnimate] = useState(false);
  const prevTotal = useRef(breakdown.total);

  useEffect(() => {
    if (breakdown.total !== prevTotal.current) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 400);
      prevTotal.current = breakdown.total;
      return () => clearTimeout(t);
    }
  }, [breakdown.total]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-[#003580] px-4 py-3">
        <p className="text-white font-bold text-sm">
          {mode === 'package' ? 'Book This Package' : 'Price Summary'}
        </p>
        {packageName && <p className="text-blue-200 text-xs mt-0.5 truncate">{packageName}</p>}
      </div>

      {/* Price Breakdown */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base package ({adults} adults{children > 0 ? `, ${children} children` : ''})</span>
          <span className="font-medium text-gray-900">{formatCurrency(breakdown.basePrice, currency)}</span>
        </div>

        {breakdown.vehicleUpgrade !== 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Vehicle & accommodation</span>
            <span className={`font-medium ${breakdown.vehicleUpgrade > 0 ? 'text-gray-900' : 'text-green-600'}`}>
              {breakdown.vehicleUpgrade > 0 ? '+' : ''}{formatCurrency(breakdown.vehicleUpgrade, currency)}
            </span>
          </div>
        )}

        {breakdown.addOnsTotal !== 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Add-ons & extras</span>
            <span className="font-medium text-gray-900">+{formatCurrency(Math.abs(breakdown.addOnsTotal), currency)}</span>
          </div>
        )}

        <div className="border-t border-dashed border-gray-200 pt-2 mt-2 flex justify-between text-sm font-semibold">
          <span className="text-gray-700">Subtotal</span>
          <span>{formatCurrency(breakdown.subtotal, currency)}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>Taxes & fees (15%)</span>
          <span>+{formatCurrency(breakdown.taxes, currency)}</span>
        </div>

        {/* Total */}
        <div className="bg-gray-50 rounded-lg p-3 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800">Total</span>
            <span
              className={`text-2xl font-black text-gray-900 transition-all ${animate ? 'animate-price text-[#E32636]' : ''}`}
            >
              {formatCurrency(breakdown.total, currency)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">for all travelers</p>
        </div>

        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
          <span>✓</span> Free cancellation up to 30 days before
        </p>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 space-y-2">
        {mode === 'package' && (
          <>
            <button
              onClick={onReserve || (() => navigate('/confirmation'))}
              className="w-full py-3.5 bg-[#E32636] text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-base"
            >
              Reserve Now →
            </button>
            <button
              onClick={() => navigate('/customize')}
              className="w-full py-2.5 border border-[#003580] text-[#003580] font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
            >
              Customize This Package
            </button>
          </>
        )}
        {mode === 'customizer' && (
          <button
            onClick={onReserve || (() => navigate('/confirmation'))}
            className="w-full py-3.5 bg-[#E32636] text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-base"
          >
            Get Final Quote →
          </button>
        )}

        {/* Trust Badge */}
        <div className="flex items-center gap-2 pt-2">
          <Shield size={16} className="text-green-500 shrink-0" />
          <p className="text-xs text-gray-500">Secure booking — your data is protected</p>
        </div>
      </div>
    </div>
  );
}
