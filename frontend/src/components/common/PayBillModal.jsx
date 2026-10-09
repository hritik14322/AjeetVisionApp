import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { apiService } from '../../services/api';

export const PayBillModal = () => {
  const { isPayBillModalOpen, setIsPayBillModalOpen, payingInvoice, showToast } = useApp();
  const [payAmount, setPayAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  if (!isPayBillModalOpen || !payingInvoice) return null;

  const remaining = payingInvoice.remainingAmount || 0;

  const handlePay = async (e) => {
    e.preventDefault();
    const amount = Number(payAmount) || remaining;
    if (amount <= 0 || amount > remaining) {
      showToast(`Please enter an amount between ₹1 and ₹${remaining.toLocaleString('en-IN')}`, 'error');
      return;
    }

    try {
      setIsProcessing(true);
      const res = await apiService.payOutstandingAmount(payingInvoice.invoiceNo, amount);
      setPaymentSuccess(res);
      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message || 'Payment failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsPayBillModalOpen(false);
    setPaymentSuccess(null);
    setPayAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-brand-red flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Pay Outstanding Bill</h3>
              <p className="text-xs text-gray-500">Invoice: {payingInvoice.invoiceNo}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-gray-900">Payment Successful!</h4>
            <p className="text-xs text-gray-600 max-w-xs mx-auto">
              Your payment of <strong className="text-emerald-700">₹{(Number(payAmount) || remaining).toLocaleString('en-IN')}</strong> has been recorded on invoice #{payingInvoice.invoiceNo}.
            </p>
            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 font-mono">
              Txn Reference: NAV-{Date.now().toString().slice(-8)}
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Done & View Updated Purchases
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5 overflow-y-auto">
            {/* Bill Summary */}
            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Product:</span>
                <span className="font-bold text-gray-900">{payingInvoice.productName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Total Bill:</span>
                <span className="font-bold text-gray-900">₹{payingInvoice.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Amount Paid So Far:</span>
                <span className="font-bold text-emerald-600">₹{payingInvoice.amountPaid?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-red-200">
                <span className="text-xs font-bold text-brand-red">Total Outstanding:</span>
                <span className="text-lg font-black text-brand-red">₹{remaining.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Custom or Full Payment */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                Payment Amount (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder={remaining.toString()}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:border-brand-red"
                />
                <button
                  type="button"
                  onClick={() => setPayAmount(remaining.toString())}
                  className="absolute right-2 top-2 px-2.5 py-1 bg-red-100 hover:bg-red-200 text-brand-red text-xs font-bold rounded-lg transition"
                >
                  Pay Full ₹{remaining.toLocaleString('en-IN')}
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">Select Payment Method</label>
              <div className="space-y-2">
                {[
                  { id: 'upi', label: 'UPI / GooglePay / PhonePe / Paytm', icon: '⚡' },
                  { id: 'card', label: 'Credit / Debit Card (Visa, RuPay, MC)', icon: '💳' },
                  { id: 'netbanking', label: 'Net Banking (All Indian Banks)', icon: '🏦' },
                  { id: 'showroom', label: 'Pay Cash at New Ajeet Vision Counter', icon: '🏬' },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === m.id
                        ? 'border-brand-red bg-red-50/40 text-gray-900 font-semibold'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                      className="accent-brand-red"
                    />
                    <span className="text-base">{m.icon}</span>
                    <span className="text-xs flex-1">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>256-bit SSL encrypted & authorized New Ajeet Vision billing</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
            >
              {isProcessing ? 'Processing Transaction...' : `Pay ₹${(Number(payAmount) || remaining).toLocaleString('en-IN')} Now`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
