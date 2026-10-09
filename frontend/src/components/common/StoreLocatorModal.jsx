import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, MapPin, Phone, MessageCircle, Clock, Navigation, ShieldCheck } from 'lucide-react';
import { SHOWROOM_INFO } from '../../data/mockData';

export const StoreLocatorModal = () => {
  const { isStoreLocatorOpen, setIsStoreLocatorOpen } = useApp();

  if (!isStoreLocatorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#C4121F] to-[#E51926] p-6 text-white text-center">
          <button
            onClick={() => setIsStoreLocatorOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="bg-white rounded-2xl p-2.5 max-w-[220px] mx-auto mb-2 flex items-center justify-center gap-2 shadow-md">
            <img
              src="/nav-logo.png"
              alt="New Ajeet Vision"
              className="w-10 h-8 object-contain"
            />
            <img
              src="/nav-brand-text.png"
              alt="New AJEET Vision"
              className="h-6 object-contain"
            />
          </div>
          <span className="inline-block mt-1 px-3 py-0.5 bg-white/20 rounded-full text-[11px] font-semibold">
            Electronics Showroom • Obra
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
            <MapPin className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Showroom Address</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{SHOWROOM_INFO.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <Clock className="w-5 h-5 text-amber-500 mb-1" />
              <p className="text-xs font-bold text-gray-500">Showroom Hours</p>
              <p className="text-xs font-semibold text-gray-800 mt-0.5">{SHOWROOM_INFO.hours}</p>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
              <p className="text-xs font-bold text-gray-500">GST Registration</p>
              <p className="text-xs font-semibold text-gray-800 mt-0.5">{SHOWROOM_INFO.gstin}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-2">
            <a
              href={`tel:${SHOWROOM_INFO.phone.split(',')[0].trim().replace(/\D+/g, '')}`}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="truncate">Call: {SHOWROOM_INFO.phone}</span>
            </a>

            <a
              href={`https://wa.me/${SHOWROOM_INFO.whatsapp.replace(/\D/g, '')}?text=Namaste%20New%20Ajeet%20Vision`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Chat on WhatsApp
            </a>

            <a
              href={SHOWROOM_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-red-50 text-brand-red border border-red-200 hover:bg-red-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Open in Google Maps Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
