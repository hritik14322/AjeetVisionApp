import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Crown,
  Gift,
  Truck,
  Lock,
  Scale,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ExternalLink,
  Printer,
  Search,
} from 'lucide-react';

export const LegalTermsScreen = () => {
  const { goBack, navigateTo, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'general', label: 'Terms of Service', icon: FileText },
    { id: 'vip', label: 'VIP Club Membership', icon: Crown },
    { id: 'rewards', label: 'Loyalty & Birthday', icon: Gift },
    { id: 'delivery', label: 'Delivery & Warranty', icon: Truck },
    { id: 'privacy', label: 'Privacy Policy', icon: Lock },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 pt-3">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-2 -ml-2 rounded-full text-gray-700 hover:bg-gray-100 transition cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold text-gray-700 hidden sm:inline">Back</span>
        </button>
        <div className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-gray-500">
          <Scale className="w-4 h-4 text-[#E51926]" />
          <span>Legal & Compliance</span>
        </div>
        <button
          onClick={handlePrint}
          className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
          title="Print Legal Document"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>

      {/* Main Legal Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#121212] p-6 sm:p-8 text-white shadow-xl border border-gray-800">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[11px] font-bold text-amber-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Showroom Legal Terms & Policies</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              NEW AJEET VISION
            </h1>
            <p className="text-xs text-gray-300 mt-1 max-w-md leading-relaxed">
              Main Market, Obra, Sonbhadra, Uttar Pradesh 231219. Governed by Consumer Protection Act, 2019 & Information Technology Act, 2000.
            </p>
          </div>
          <div className="text-left sm:text-right text-[11px] text-gray-400 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4">
            <span className="block font-semibold text-gray-300">Effective Date:</span>
            <span className="font-mono text-amber-400">13 October 2026</span>
            <span className="block text-[10px] text-gray-500 mt-0.5">Version 2.4 (Updated)</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#E51926] text-white shadow-sm shadow-red-500/20'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-xs space-y-6 text-gray-800 text-xs sm:text-sm leading-relaxed">
        {/* ================= 1. TERMS OF SERVICE ================= */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base sm:text-lg font-black text-gray-950">
                1. General Terms of Service & Showroom Agreement
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Rules governing your interaction with New Ajeet Vision web application and retail counter.
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                1.1 Showroom Identity & Eligibility
              </h3>
              <p>
                This application is operated by <strong>New Ajeet Vision</strong> (hereinafter referred to as "NAV", "we", "us", or "our"), an authorized consumer electronics and home appliances showroom located at Main Market, Obra, Sonbhadra, Uttar Pradesh 231219. By accessing or registering an account on this platform, you certify that you are at least 18 years of age and competent to enter into a legally binding contract under the Indian Contract Act, 1872.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                1.2 Digital Invoices & Billing Synchronisation
              </h3>
              <p>
                All purchase invoices displayed under "My Purchases" represent authentic retail showroom sales conducted with genuine GST tax invoices. Prices of electronics (TVs, Refrigerators, Washing Machines, Air Conditioners) are inclusive of applicable GST unless specified otherwise. In the event of typographical or computational discrepancies, the physical GST tax invoice printed at the Obra showroom counter shall serve as the primary legal document.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                1.3 Outstanding Payments & Instalment Terms
              </h3>
              <p>
                Where a showroom transaction includes deferred payment or instalment terms ("Remaining / Outstanding Amount"), the customer agrees to settle the remaining dues within the timeline stipulated on the showroom invoice. New Ajeet Vision reserves the right to issue reminders via SMS, WhatsApp, and registered email.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                1.4 Digital Account & Mobile Authentication
              </h3>
              <p>
                Access to digital warranty cards, loyalty points, and purchase records is tied to your registered mobile number and email. You are solely responsible for maintaining the confidentiality of your OTPs and login credentials.
              </p>
            </section>
          </div>
        )}

        {/* ================= 2. VIP CLUB MEMBERSHIP ================= */}
        {activeTab === 'vip' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 mb-1">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>Privilege Subscription Rules</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-gray-950">
                2. New Ajeet Vision VIP Club Terms & Conditions
              </h2>
            </div>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                2.1 Membership Fee & Validity
              </h3>
              <p>
                The New Ajeet Vision VIP Membership is priced at a flat annual subscription fee of <strong>₹499 (All Inclusive)</strong>. Upon successful payment verification via our authorized gateway (Razorpay), membership is activated immediately and remains valid for exactly <strong>365 calendar days (1 full year)</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                2.2 Non-Refundable Nature
              </h3>
              <p>
                The ₹499 VIP membership fee is non-refundable and non-transferable once activated. It cannot be exchanged for cash, nor can it be adjusted against the retail purchase price of appliances unless explicitly sanctioned under a showroom festive bundle promotion.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                2.3 Member Privileges & Scope
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                <li><strong>Exclusive Member Pricing:</strong> VIP discounts applicable on select Smart TVs, Refrigerators, and Appliances.</li>
                <li><strong>Priority Showroom Delivery:</strong> Complimentary doorstep transport within a 25 km radius of Obra Showroom.</li>
                <li><strong>Guaranteed Birthday Gift:</strong> Automatic entitlement to a ₹1,500 birthday voucher valid during the customer's birthday month.</li>
                <li><strong>24-Hour Early Access:</strong> Priority booking during Dhanteras, Diwali, and New Year promotional inventory allocations.</li>
                <li><strong>Annual Promotional Lucky Draw:</strong> Automatically registered for the annual customer appreciation draw.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                2.4 Fair Use Policy
              </h3>
              <p>
                VIP Membership benefits are strictly intended for retail end-users and individual households. Bulk commercial reselling or automated coupon aggregation is strictly prohibited and shall result in immediate revocation of VIP status without refund.
              </p>
            </section>
          </div>
        )}

        {/* ================= 3. REWARDS & BIRTHDAY POLICY ================= */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base sm:text-lg font-black text-gray-950">
                3. Loyalty Coins, Wheel Spins & Birthday Discount Policy
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Official rules governing NAV coins, birthday vouchers, and promotional spins.
              </p>
            </div>

            <section className="space-y-2 bg-rose-50/60 p-4 rounded-2xl border border-rose-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#E51926] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#E51926]" />
                <span>3.1 Permanent Date of Birth (DOB) Lock Policy</span>
              </h3>
              <p className="text-gray-700">
                To prevent fraudulent coupon exploitation and repeated birthday discount claims within a single year:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-800 font-medium">
                <li>A customer may register their Date of Birth exactly once.</li>
                <li><strong>Once saved in our database, the Date of Birth cannot be edited, modified, or altered further under any circumstances by the customer.</strong></li>
                <li>Any administrative correction requires physical identity verification (Aadhaar / Voter ID / PAN) at the New Ajeet Vision billing desk in Obra.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                3.2 Birthday Voucher Terms (BDAY-AJEET-1500)
              </h3>
              <p>
                The ₹1,500 birthday voucher is applicable exclusively on showroom appliance purchases with a minimum invoice value of <strong>₹10,000</strong>. The coupon must be presented at the billing counter during the customer's registered birthday month. Only one birthday discount voucher may be redeemed per customer per calendar year.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                3.3 NAV Loyalty Points & Coin Redemption
              </h3>
              <p>
                Customers earn loyalty coins with showroom purchases (typically 1 point per ₹1,000 spend) and app engagement. Points have no independent monetary or cash surrender value and can only be redeemed as instant discounts on subsequent purchases at the Obra showroom. Coins do not expire as long as the account remains active with at least one transaction every 24 months.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                3.4 Spin the Wheel & Lucky Draws
              </h3>
              <p>
                Promotional wheel spins and lucky draws are offered as goodwill marketing promotions. Prizes (smart watches, soundbars, iron boxes, cash discount vouchers) are subject to showroom stock availability and cannot be exchanged for cash.
              </p>
            </section>
          </div>
        )}

        {/* ================= 4. DELIVERY & WARRANTY ================= */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base sm:text-lg font-black text-gray-950">
                4. Doorstep Delivery, Installation & Brand Warranty
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Guidelines regarding transit, inspection, installation, and manufacturer warranties.
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                4.1 Showroom Delivery Radius & Schedule
              </h3>
              <p>
                Standard showroom delivery is available across Obra, Renukoot, Anpara, Chopan, and surrounding regions in Sonbhadra district within a <strong>25 km radius</strong>. VIP members receive priority complimentary delivery. Delivery is typically executed within 24 to 48 hours of billing.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                4.2 Doorstep Inspection & Dead On Arrival (DOA)
              </h3>
              <p>
                Customers are advised to inspect the physical condition of appliances (screens, outer panels, glass doors) upon unboxing by our delivery team. In the rare event of transit damage or manufacturing DOA (Dead On Arrival), it must be reported to the showroom within <strong>24 hours</strong> of delivery with photographic evidence for immediate replacement.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                4.3 Official Brand Manufacturer Warranty
              </h3>
              <p>
                All appliances sold by New Ajeet Vision are 100% brand-new, original units backed by official manufacturer warranties (e.g., Samsung, LG, Sony, Whirlpool, Haier, Voltas, Daikin, Godrej). Warranty service, on-site repairs, and compressor/panel replacements are serviced directly by authorized brand service technicians in accordance with each brand's standard warranty policy.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                4.4 Return & Replacement Policy
              </h3>
              <p>
                Due to the bulky and specialized nature of major appliances, products once sold and inspected cannot be returned for buyer's remorse or change of mind. Replacements are strictly governed by manufacturer service center DOA certification.
              </p>
            </section>
          </div>
        )}

        {/* ================= 5. PRIVACY POLICY ================= */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base sm:text-lg font-black text-gray-950">
                5. Privacy Policy & Customer Data Protection
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Commitment to user data security under the Digital Personal Data Protection Act, 2023.
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                5.1 Information We Collect
              </h3>
              <p>
                We collect personal information necessary to deliver showroom services, including:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Full Name and Contact Number (for billing and OTP verification).</li>
                <li>Registered Email Address (for electronic invoice delivery and password resets).</li>
                <li>Delivery Address (for doorstep transport of appliances).</li>
                <li>Date of Birth (for birthday discount validation; locked upon entry).</li>
                <li>Purchase Invoices and Warranty Records.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                5.2 Payment Data & Gateway Security
              </h3>
              <p>
                We do not store complete credit card numbers, debit card PINs, or CVV codes on our servers. All online transactions (including the ₹499 VIP subscription) are processed through <strong>Razorpay Software Private Limited</strong>, a PCI-DSS Level 1 certified payment aggregator, utilizing 256-bit bank-grade SSL encryption.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                5.3 Non-Disclosure to Third Parties
              </h3>
              <p>
                New Ajeet Vision does not rent, sell, or trade your personal customer data with third-party telemarketers or advertisers. Your data is used exclusively for fulfilling your orders, servicing warranties, and communicating genuine showroom festival offers.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E51926]">
                5.4 Grievance Officer & Contact Information
              </h3>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                <p className="font-bold text-gray-900">
                  In compliance with the Information Technology Act, 2000 and rules made thereunder:
                </p>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-3.5 h-3.5 text-[#E51926] flex-shrink-0" />
                  <span>New Ajeet Vision, Main Market, Obra, Sonbhadra, Uttar Pradesh 231219</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>+91 94152 23344 / Showroom Helpline: +91 74884 92130</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>care@ajeetvision.com / grievance@ajeetvision.com</span>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Showroom Contact Card */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-white">Have Questions About Our Terms?</h4>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Visit our Obra showroom or speak with our customer care representative.
          </p>
        </div>
        <button
          onClick={() => navigateTo('profile')}
          className="py-2 px-4 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded-xl shadow-xs transition whitespace-nowrap cursor-pointer"
        >
          Return to My Profile
        </button>
      </div>
    </div>
  );
};
