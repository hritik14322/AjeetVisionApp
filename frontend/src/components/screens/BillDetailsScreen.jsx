import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  Building2,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { apiService } from '../../services/api';
import { SHOWROOM_INFO } from '../../data/mockData';

export const BillDetailsScreen = () => {
  const { selectedInvoiceNo, goBack, showToast, setIsPayBillModalOpen, setPayingInvoice } = useApp();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await apiService.getInvoiceDetails(selectedInvoiceNo || 'NAV20260915001');
        setInvoice(data);
      } catch (err) {
        showToast(err.message || 'Invoice not found', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [selectedInvoiceNo]);

  const handlePrintDownload = () => {
    window.print();
    showToast('Invoice printed / saved as PDF', 'success');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoice.invoiceNo} - New Ajeet Vision`,
          text: `Official Bill ${invoice.invoiceNo} from New Ajeet Vision for ${invoice.productName}. Total: ₹${invoice.totalAmount}`,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Bill link copied to clipboard!', 'info');
    }
  };

  if (loading || !invoice) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p className="text-sm">Loading Bill Details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-2xl mx-auto px-4 sm:px-6 pt-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-2 -ml-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-black text-gray-900 tracking-tight">
          Bill Details
        </h2>
        <div className="w-8" />
      </div>

      {/* Main Printable / Digital Invoice Card */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-lg p-6 sm:p-8 space-y-6 print:shadow-none print:border-none">
        {/* Invoice Showroom Header matching reference */}
        <div className="text-center pb-6 border-b border-gray-100 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="/nav-logo.png"
              alt="New Ajeet Vision Logo"
              className="w-12 h-10 object-contain"
            />
            <img
              src="/nav-brand-text.png"
              alt="New AJEET Vision"
              className="h-7 object-contain"
            />
          </div>
          <p className="text-[11px] text-gray-500 max-w-sm">
            {SHOWROOM_INFO.address}
          </p>
          <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1 font-mono">
            <span>GSTIN: {SHOWROOM_INFO.gstin}</span>
            <span>•</span>
            <span>Ph: {SHOWROOM_INFO.phone}</span>
          </div>
        </div>

        {/* Invoice Meta Grid matching reference */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-400 block font-medium">Invoice No.</span>
            <span className="font-mono font-bold text-gray-900 text-sm">{invoice.invoiceNo}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block font-medium">Date</span>
            <span className="font-bold text-gray-900 text-sm">{invoice.date}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Billed To</span>
            <span className="font-bold text-gray-900">{invoice.customer?.name}</span>
            <span className="text-gray-500 block">{invoice.customer?.mobile}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block font-medium">Invoice Status</span>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize mt-0.5 ${
                invoice.status === 'ongoing'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Itemized Table matching reference */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5 flex justify-between text-xs font-bold text-gray-600">
            <span>Product</span>
            <span>Qty</span>
            <span className="text-right">Total</span>
          </div>
          <div className="divide-y divide-gray-100">
            {invoice.items?.map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-[11px] font-mono text-gray-400 mt-0.5">S/N: {item.serialNo}</p>
                </div>
                <span className="font-semibold text-gray-700">{item.qty}</span>
                <span className="font-bold text-gray-900 text-right">
                  ₹{item.total?.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Amount Breakdown matching reference */}
        <div className="space-y-2 text-xs pt-2 border-t border-gray-100">
          <div className="flex justify-between text-gray-600">
            <span>Total Amount</span>
            <span className="font-bold text-gray-900">₹{invoice.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Amount Paid</span>
            <span className="font-bold text-emerald-600">₹{invoice.amountPaid?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100 text-sm">
            <span className="font-bold text-brand-red">Remaining Amount</span>
            <span className="font-black text-brand-red text-base">
              ₹{invoice.remainingAmount?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Payment History matching reference */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Payment History
          </h4>
          <div className="space-y-2">
            {invoice.paymentHistory?.map((pay, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">{pay.date}</p>
                    <p className="text-[11px] text-gray-500">{pay.method}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">
                  ₹{pay.amount?.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Outstanding Payment CTA if pending */}
        {invoice.remainingAmount > 0 && (
          <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-brand-red">Instalment Due</p>
              <p className="text-[11px] text-gray-600">Clear remaining ₹{invoice.remainingAmount?.toLocaleString('en-IN')}</p>
            </div>
            <button
              onClick={() => {
                setPayingInvoice(invoice);
                setIsPayBillModalOpen(true);
              }}
              className="py-1.5 px-4 bg-brand-red hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              Pay Remaining
            </button>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons matching reference */}
      <div className="grid grid-cols-2 gap-3 print:hidden">
        <button
          onClick={handlePrintDownload}
          className="py-3 px-4 border-2 border-brand-red text-brand-red hover:bg-red-50 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Bill</span>
        </button>

        <button
          onClick={handleShare}
          className="py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
