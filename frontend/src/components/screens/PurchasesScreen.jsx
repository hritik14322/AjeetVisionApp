import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Receipt, CreditCard, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { apiService } from '../../services/api';

export const PurchasesScreen = () => {
  const {
    navigateTo,
    goBack,
    setSelectedInvoiceNo,
    setIsPayBillModalOpen,
    setPayingInvoice,
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'ongoing', 'completed'
  const [purchasesData, setPurchasesData] = useState({
    purchases: [],
    totalOutstanding: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await apiService.getPurchases(activeTab);
      setPurchasesData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [activeTab]);

  const handlePayNow = (purchase) => {
    setPayingInvoice(purchase);
    setIsPayBillModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-4xl mx-auto px-4 sm:px-6 pt-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="p-2 -ml-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            My Purchases
          </h2>
          <p className="text-xs text-gray-500">Track showroom orders, instalments and official bills</p>
        </div>
      </div>

      {/* Tabs matching reference */}
      <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-2xl w-full sm:w-80">
        {[
          { id: 'all', label: 'All' },
          { id: 'ongoing', label: 'Ongoing' },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-brand-red text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Total Outstanding Card matching reference */}
      <div className="bg-red-50/80 border border-red-200/90 rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold text-gray-600 block">Total Outstanding</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-red tracking-tight mt-0.5">
            ₹{purchasesData.totalOutstanding?.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Pending showroom instalment balance</p>
        </div>

        {purchasesData.totalOutstanding > 0 && (
          <button
            onClick={() => {
              const ongoingOne = purchasesData.purchases.find((p) => p.remainingAmount > 0) || purchasesData.purchases[0];
              if (ongoingOne) handlePayNow(ongoingOne);
            }}
            className="py-2.5 px-6 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm"
          >
            Pay Now
          </button>
        )}
      </div>

      {/* Purchase List Cards matching reference */}
      <div className="space-y-3">
        {purchasesData.purchases?.map((item) => {
          const isOngoing = item.status === 'ongoing';
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 hover:border-gray-300 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl p-2 flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                      {item.productName}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        isOngoing
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-0.5">Purchased on {item.date}</p>

                  <div className="flex items-center gap-3 text-xs mt-2 flex-wrap">
                    <span>
                      Total: <strong className="text-gray-900">₹{item.totalAmount?.toLocaleString('en-IN')}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Paid: <strong className="text-emerald-600">₹{item.amountPaid?.toLocaleString('en-IN')}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Remaining:{' '}
                      <strong className={item.remainingAmount > 0 ? 'text-brand-red' : 'text-gray-500'}>
                        ₹{item.remainingAmount?.toLocaleString('en-IN')}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {item.remainingAmount > 0 && (
                  <button
                    onClick={() => handlePayNow(item)}
                    className="py-2 px-3 bg-red-100 hover:bg-red-200 text-brand-red text-xs font-bold rounded-xl transition"
                  >
                    Pay EMI
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedInvoiceNo(item.invoiceNo);
                    navigateTo('bill_details', { invoiceNo: item.invoiceNo });
                  }}
                  className="py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl transition flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5 text-gray-500" />
                  <span>View Bill</span>
                </button>
              </div>
            </div>
          );
        })}

        {!loading && purchasesData.purchases?.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 text-gray-400">
            <p className="text-sm">No purchases in this tab.</p>
          </div>
        )}
      </div>
    </div>
  );
};
