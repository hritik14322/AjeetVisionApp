import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calculator, Percent, Calendar, IndianRupee, MessageCircle, Check } from 'lucide-react';
import { SHOWROOM_INFO } from '../../data/mockData';

export const EmiCalculatorModal = () => {
  const { isEmiModalOpen, setIsEmiModalOpen, emiProduct } = useApp();

  const [price, setPrice] = useState(54999);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenureMonths, setTenureMonths] = useState(12);
  const [interestRate, setInterestRate] = useState(0); // 0% No Cost EMI default

  useEffect(() => {
    if (emiProduct?.price) {
      setPrice(emiProduct.price);
    }
  }, [emiProduct]);

  if (!isEmiModalOpen) return null;

  const downPaymentAmount = Math.round((price * downPaymentPercent) / 100);
  const loanPrincipal = price - downPaymentAmount;

  // Monthly EMI formula
  const monthlyInterestRate = interestRate / (12 * 100);
  let monthlyEmi = 0;
  let totalInterest = 0;

  if (interestRate === 0) {
    monthlyEmi = Math.round(loanPrincipal / tenureMonths);
    totalInterest = 0;
  } else {
    monthlyEmi = Math.round(
      (loanPrincipal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) /
        (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1)
    );
    totalInterest = (monthlyEmi * tenureMonths) - loanPrincipal;
  }

  const totalPayable = downPaymentAmount + (monthlyEmi * tenureMonths);

  const handleWhatsAppEnquiry = () => {
    const productName = emiProduct?.name || 'Electronics';
    const text = encodeURIComponent(
      `Namaste New Ajeet Vision! I am interested in purchasing "${productName}" (Price: ₹${price.toLocaleString('en-IN')}) on EMI:\n- Down Payment: ₹${downPaymentAmount.toLocaleString('en-IN')} (${downPaymentPercent}%)\n- Tenure: ${tenureMonths} Months\n- Monthly EMI: ₹${monthlyEmi.toLocaleString('en-IN')}/mo.\nPlease confirm showroom stock and finance options.`
    );
    window.open(`https://wa.me/${SHOWROOM_INFO.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
    setIsEmiModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-brand-red flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Showroom EMI Calculator</h3>
              <p className="text-xs text-gray-500">Calculate easy monthly instalments</p>
            </div>
          </div>
          <button
            onClick={() => setIsEmiModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {emiProduct && (
            <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 flex items-center gap-3">
              <img
                src={emiProduct.images?.[0] || emiProduct.image}
                alt={emiProduct.name}
                className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Selected Product</p>
                <p className="text-sm font-bold text-gray-900 truncate">{emiProduct.name}</p>
                <p className="text-xs font-bold text-brand-red">₹{emiProduct.price?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          )}

          {/* Product Price Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-700">Product Price (₹)</label>
              <span className="text-sm font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="200000"
              step="1000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-brand-red h-2 bg-gray-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>₹5,000</span>
              <span>₹1,00,000</span>
              <span>₹2,00,000</span>
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Down Payment: {downPaymentPercent}%
              </label>
              <span className="text-sm font-bold text-gray-900">
                ₹{downPaymentAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-brand-red h-2 bg-gray-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>0% (Zero Down)</span>
              <span>30%</span>
              <span>60%</span>
            </div>
          </div>

          {/* Tenure Selection */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Loan Tenure (Months)</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[3, 6, 9, 12, 18, 24].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTenureMonths(m)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    tenureMonths === m
                      ? 'bg-brand-red text-white border-brand-red shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {m} Mo
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate Selection */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Interest Rate</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '0% No-Cost EMI', val: 0 },
                { label: '12% p.a. (Bank)', val: 12 },
                { label: '14% p.a. (Finserv)', val: 14 },
              ].map((rate) => (
                <button
                  key={rate.val}
                  type="button"
                  onClick={() => setInterestRate(rate.val)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition text-center ${
                    interestRate === rate.val
                      ? 'bg-brand-red text-white border-brand-red shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {rate.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculated Output Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg space-y-3">
            <div className="flex justify-between items-baseline border-b border-gray-700 pb-3">
              <div>
                <span className="text-xs text-gray-400 font-medium">Estimated Monthly EMI</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
                  ₹{monthlyEmi.toLocaleString('en-IN')}
                  <span className="text-xs text-gray-300 font-normal"> / month</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400">Total Duration</span>
                <p className="text-sm font-bold text-white">{tenureMonths} Months</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <div>
                <span className="text-gray-400 text-[11px]">Down Payment</span>
                <p className="font-bold text-white">₹{downPaymentAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-gray-400 text-[11px]">Loan Principal</span>
                <p className="font-bold text-white">₹{loanPrincipal.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-[11px]">Total Interest</span>
                <p className="font-bold text-emerald-400">₹{totalInterest.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => setIsEmiModalOpen(false)}
            className="w-full sm:w-1/3 py-2.5 px-4 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition"
          >
            Close
          </button>
          <button
            onClick={handleWhatsAppEnquiry}
            className="w-full sm:w-2/3 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            Enquire on WhatsApp with this EMI
          </button>
        </div>
      </div>
    </div>
  );
};
