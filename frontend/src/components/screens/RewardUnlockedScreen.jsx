import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Gift, Sparkles, Trophy, Award, CheckCircle2 } from 'lucide-react';
import { WHEEL_PRIZES } from '../../data/mockData';
import { apiService } from '../../services/api';
import confetti from 'canvas-confetti';

export const RewardUnlockedScreen = () => {
  const {
    goBack,
    navigateTo,
    rewardJourney,
    setRewardJourney,
    showToast,
    setWheelPrizeResult,
    setIsWheelResultModalOpen,
  } = useApp();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  const numSlices = WHEEL_PRIZES.length;
  const sliceAngle = 360 / numSlices;

  const handleSpinClick = async () => {
    if (isSpinning) return;

    try {
      setIsSpinning(true);
      setErrorMsg(null);

      // Call BACKEND API to get deterministic winning prize!
      // "Wheel result must come from backend, not random frontend logic"
      const apiResult = await apiService.spinRewardWheel();

      // Winning index determined by backend
      const winningIndex = apiResult.prizeIndex ?? 0;

      // Calculate degrees so the pointer at 12 o'clock (top, 270deg or 0deg) lands on winning slice
      // Current pointer is at the TOP (0 deg / 360 deg)
      // Segment i spans from i*sliceAngle to (i+1)*sliceAngle
      // To center segment i at the top pointer (0 deg), wheel must stop at:
      // 360 - (winningIndex * sliceAngle + sliceAngle / 2)
      const targetSegmentAngle = (360 - (winningIndex * sliceAngle + sliceAngle / 2));
      const extraSpins = 360 * 6; // 6 full rotations for dramatic suspense
      const finalRotation = rotationDegrees + extraSpins + (targetSegmentAngle - (rotationDegrees % 360) + 360) % 360;

      setRotationDegrees(finalRotation);

      // Wait for spin animation (4.5s) to complete
      setTimeout(() => {
        setIsSpinning(false);
        setRewardJourney((prev) => ({
          ...prev,
          hasSpun: true,
          claimedReward: apiResult.reward,
          claimCode: apiResult.claimCode,
        }));

        setWheelPrizeResult({
          reward: apiResult.reward,
          claimCode: apiResult.claimCode,
          validUntil: apiResult.validUntil,
        });

        // Trigger glorious confetti
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch (e) {}

        setIsWheelResultModalOpen(true);
      }, 4500);
    } catch (err) {
      setIsSpinning(false);
      setErrorMsg(err.message || 'Error spinning wheel');
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8C0B14] via-[#5C060D] to-[#2B0205] text-white flex flex-col justify-between pb-12 select-none relative overflow-hidden">
      {/* Background Sparkles & Fireworks effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full px-4 pt-4 flex items-center justify-between z-10">
        <button
          onClick={goBack}
          className="p-2 -ml-2 rounded-full text-white hover:bg-white/10 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <img
            src="/nav-logo.png"
            alt="Logo"
            className="w-7 h-6 object-contain"
          />
          <img
            src="/nav-brand-text-white.png"
            alt="New AJEET Vision"
            className="h-5 object-contain"
          />
        </div>
        <div className="w-8" />
      </div>

      {/* Center Celebration Box */}
      <div className="max-w-md mx-auto w-full px-6 flex flex-col items-center text-center z-10 space-y-4">
        {/* Animated Celebration Box */}
        <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl w-full">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Gift className="w-8 h-8 text-black animate-bounce" />
          </div>

          <span className="text-[11px] font-extrabold tracking-widest uppercase text-yellow-300">
            Target ₹1,00,000 Achieved!
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Congratulations!
          </h1>
          <p className="text-xs text-red-100 font-medium mt-1">
            Your exclusive milestone showroom reward is unlocked!
          </p>

          <div className="mt-3 p-2 bg-black/30 rounded-xl flex items-center justify-between text-xs font-bold text-red-200">
            <span>₹1,00,000 / ₹1,00,000</span>
            <span className="text-yellow-400">100% Unlocked</span>
          </div>
        </div>

        {/* ---------------- PRIZE WHEEL CONTAINER ---------------- */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Wheel Pointer at Top (12 o'clock) */}
          <div className="absolute -top-4 z-30 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-yellow-400 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" />
          </div>

          {/* Wheel Outer Rim */}
          <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full p-2.5 bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-600 shadow-[0_0_40px_rgba(245,158,11,0.5)] border-4 border-yellow-200/60 relative flex items-center justify-center">
            {/* Rotating Wheel Body */}
            <div
              className="w-full h-full rounded-full overflow-hidden relative shadow-inner"
              style={{
                transform: `rotate(${rotationDegrees}deg)`,
                transition: isSpinning ? 'transform 4.5s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
              }}
            >
              {/* SVG Segment Wheel */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {WHEEL_PRIZES.map((prize, idx) => {
                  const startAngle = (idx * 360) / numSlices;
                  const endAngle = ((idx + 1) * 360) / numSlices;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;

                  const x1 = 50 + 50 * Math.cos(startRad);
                  const y1 = 50 + 50 * Math.sin(startRad);
                  const x2 = 50 + 50 * Math.cos(endRad);
                  const y2 = 50 + 50 * Math.sin(endRad);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  // Alternating slice colors: Red (#E51926) & Dark Carbon (#1E1E1E)
                  const fill = idx % 2 === 0 ? '#E51926' : '#1A1A1A';

                  return (
                    <g key={prize.id}>
                      <path d={pathData} fill={fill} stroke="#FFD700" strokeWidth="0.6" />
                    </g>
                  );
                })}
              </svg>

              {/* Segment Labels Overlay */}
              {WHEEL_PRIZES.map((prize, idx) => {
                const angle = idx * sliceAngle + sliceAngle / 2;
                return (
                  <div
                    key={prize.id}
                    className="absolute inset-0 flex items-start justify-center pt-3 pointer-events-none"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: '50% 50%',
                    }}
                  >
                    <div className="flex flex-col items-center text-center transform rotate-90 translate-y-6">
                      <span className="text-[10px] sm:text-[11px] font-black tracking-tight text-white drop-shadow-sm whitespace-nowrap max-w-[70px] truncate">
                        {prize.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Central Golden Spin Button */}
            <button
              onClick={handleSpinClick}
              disabled={isSpinning}
              className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1 shadow-2xl transition-transform active:scale-95 disabled:opacity-90 flex items-center justify-center cursor-pointer border-2 border-white"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex flex-col items-center justify-center shadow-inner">
                <span className="text-gray-950 font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-xs">
                  {isSpinning ? '...' : 'SPIN'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Spin Instruction */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-bold text-yellow-300">
            {isSpinning ? 'Spinning wheel with backend rules...' : 'Spin the wheel to claim your special gift!'}
          </p>
          <p className="text-[11px] text-red-200">
            Guaranteed reward certified by New Ajeet Vision Showroom.
          </p>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-300 bg-black/40 px-3 py-1.5 rounded-xl">{errorMsg}</p>
        )}
      </div>

      {/* Bottom Store claim note */}
      <div className="max-w-md mx-auto w-full px-6 text-center text-[11px] text-red-300/80 pt-4">
        Gift claimable at New Ajeet Vision Showroom, Obra.
      </div>
    </div>
  );
};
