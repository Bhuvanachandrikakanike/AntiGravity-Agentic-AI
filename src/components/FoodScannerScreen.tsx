import React, { useState, useRef, useEffect } from 'react';
import { SAMPLE_PRESET_SCANS } from '../data/initialData';
import { playMechanicalClick, playStampSound } from '../utils/audio';
import { MealItem } from '../types';

interface FoodScannerScreenProps {
  onCommitMeal: (category: 'breakfast' | 'lunch' | 'dinner' | 'snacks', item: MealItem) => void;
  onBackToLog: () => void;
  soundEnabled: boolean;
}

export const FoodScannerScreen: React.FC<FoodScannerScreenProps> = ({
  onCommitMeal,
  onBackToLog,
  soundEnabled,
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [targetCategory, setTargetCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('lunch');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customPlateName, setCustomPlateName] = useState('');
  const [customCalories, setCustomCalories] = useState<number | null>(null);
  const [isLiveCamera, setIsLiveCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [committedSuccess, setCommittedSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentPreset = SAMPLE_PRESET_SCANS[selectedPresetIndex];
  const activeImage = uploadedImage || currentPreset.imageUrl;
  const activeName = customPlateName || currentPreset.name;
  const activeCalories = customCalories !== null ? customCalories : currentPreset.calories;

  // Camera stream cleanup
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isLiveCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          setCameraError('Optical lens feed unavailable. Please upload a plate image or choose a preset.');
          setIsLiveCamera(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isLiveCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setIsLiveCamera(false);
        triggerOpticalScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerOpticalScan = () => {
    playMechanicalClick(soundEnabled);
    setIsScanning(true);
    setScanProgress(0);
    setCommittedSuccess(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      if (progress >= 100) {
        clearInterval(interval);
        setScanProgress(100);
        setIsScanning(false);
        playMechanicalClick(soundEnabled);
      } else {
        setScanProgress(progress);
      }
    }, 120);
  };

  const handleCommit = () => {
    playStampSound(soundEnabled);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newItem: MealItem = {
      id: `ai-${Date.now()}`,
      name: activeName,
      subtitle: currentPreset.subtitle,
      calories: activeCalories,
      macros: currentPreset.macros,
      imageUrl: activeImage,
      altText: activeName,
      loggedTime: timeStr,
      stampedTime: timeStr,
      chronoverified: true,
    };

    onCommitMeal(targetCategory, newItem);
    setCommittedSuccess(true);
    setTimeout(() => {
      onBackToLog();
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Viewfinder Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#d8c3b4]/30 gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToLog}
            className="p-2 rounded-lg bg-[#ffe9e2] text-[#894d0d] hover:bg-[#ffe2d8] border border-[#d8c3b4]/40 flex items-center justify-center cursor-pointer"
            title="Return to Master Log"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div>
            <h2 className="font-['Newsreader',serif] text-2xl font-semibold text-[#2a170f] leading-tight">
              AI Chrono-Optic Food Spectrometer
            </h2>
            <span className="font-['Fira_Sans',sans-serif] text-xs text-[#857467]">
              Multispectral Caloric &amp; Macronutrient Volumetric Analysis
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-[#ffe9e2] text-[#2a170f] font-['Fira_Sans',sans-serif] text-xs font-semibold hover:bg-[#ffe2d8] border border-[#d8c3b4]/40 flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            <span>Upload Image</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLiveCamera(!isLiveCamera);
              playMechanicalClick(soundEnabled);
            }}
            className={`px-3 py-1.5 rounded-lg font-['Fira_Sans',sans-serif] text-xs font-semibold border flex items-center gap-1 cursor-pointer ${
              isLiveCamera
                ? 'bg-[#176a30] text-white border-[#176a30]'
                : 'bg-[#ffe9e2] text-[#2a170f] border-[#d8c3b4]/40 hover:bg-[#ffe2d8]'
            }`}
          >
            <span className="material-symbols-outlined text-base">videocam</span>
            <span>{isLiveCamera ? 'Stop Lens' : 'Optical Lens'}</span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="p-3 rounded-lg bg-[#ffe2d8] text-[#894d0d] text-xs flex items-center gap-2 border border-[#d8c3b4]">
          <span className="material-symbols-outlined text-base">info</span>
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Optical Chassis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Viewfinder Column (7 Cols) */}
        <div className="lg:col-span-7 bg-[#fff1ec] rounded-xl p-5 shadow-lg relative flex flex-col justify-between border border-[#d8c3b4]/40">
          {/* Top Reticle Status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-pulse" />
              <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#894d0d] font-bold uppercase tracking-widest">
                VIEWFINDER RETICLE • MK. IV
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#857467]">
              SPECTRO: 580nm — ISO 200
            </span>
          </div>

          {/* Viewfinder Frame */}
          <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-[#2a170f] shadow-inner flex items-center justify-center border-2 border-[#894d0d]/40">
            {isLiveCamera ? (
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={activeImage}
                alt="Selected Food Plate"
                className="w-full h-full object-cover"
              />
            )}

            {/* Brass Horological Crosshairs & Corner Brackets */}
            <div className="absolute inset-4 pointer-events-none border border-[#ffdcc2]/40 rounded-lg">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ffb77b]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ffb77b]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ffb77b]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ffb77b]" />
              
              {/* Center Reticle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-dashed border-[#ffdcc2]/60 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#ffb77b] shadow-[0_0_8px_#ffb77b]" />
              </div>
            </div>

            {/* Scanning Laser Sweep Animation */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                  className="w-full h-1 bg-gradient-to-r from-transparent via-[#ffdcc2] to-transparent shadow-[0_0_12px_#ffb77b] transition-all duration-150"
                  style={{ top: `${scanProgress}%`, position: 'absolute' }}
                />
                <div className="absolute inset-0 bg-[#ffdcc2]/10 backdrop-contrast-125" />
              </div>
            )}

            {/* In-Frame Recognition HUD Badge */}
            <div className="absolute bottom-3 left-3 right-3 bg-[#2a170f]/85 backdrop-blur-sm p-2 rounded-lg border border-[#d8c3b4]/30 flex items-center justify-between text-white">
              <div className="flex flex-col">
                <span className="font-['Newsreader',serif] text-sm font-semibold text-[#ffdcc2] truncate">
                  {activeName}
                </span>
                <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#d8c3b4]">
                  Caloric Density: 2.1 kcal/g • Confidence: 98.4%
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#894d0d] font-['Newsreader',serif] text-sm text-[#ffdcc2] font-bold">
                {activeCalories} kcal
              </span>
            </div>
          </div>

          {/* Preset Plate Selector Bar */}
          <div className="mt-4">
            <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] font-bold uppercase tracking-wider block mb-2">
              Select Curated Artisanal Plate or Upload
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_PRESET_SCANS.map((preset, idx) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    playMechanicalClick(soundEnabled);
                    setSelectedPresetIndex(idx);
                    setUploadedImage(null);
                    setCustomPlateName('');
                    setCustomCalories(null);
                    setIsLiveCamera(false);
                    triggerOpticalScan();
                  }}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedPresetIndex === idx && !uploadedImage
                      ? 'bg-[#ffe2d8] border-[#894d0d] shadow-sm'
                      : 'bg-[#ffe9e2] border-[#d8c3b4]/30 hover:bg-[#ffe2d8]'
                  }`}
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.name}
                    className="w-full h-12 object-cover rounded mb-1"
                  />
                  <div className="font-['Newsreader',serif] text-xs font-semibold text-[#2a170f] truncate">
                    {preset.name}
                  </div>
                  <div className="font-['Fira_Sans',sans-serif] text-[10px] text-[#894d0d] font-bold">
                    {preset.calories} kcal
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chrono-Analysis Breakdown & Stamping Column (5 Cols) */}
        <div className="lg:col-span-5 bg-[#fff1ec] rounded-xl p-5 shadow-lg flex flex-col justify-between border border-[#d8c3b4]/40">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#d8c3b4]/30 mb-4">
              <span className="font-['Newsreader',serif] text-lg font-semibold text-[#2a170f]">
                Metabolic Decomposition
              </span>
              <span className="px-2 py-0.5 rounded bg-[#358446] text-white font-['Fira_Sans',sans-serif] text-[9px] uppercase font-bold tracking-wider">
                CHRONO-VERIFIED
              </span>
            </div>

            {/* Food Name & Subtitle */}
            <div className="mb-4 bg-[#ffe9e2] p-3 rounded-lg border border-[#d8c3b4]/30 shadow-inner">
              <label className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] uppercase font-bold tracking-wider block mb-1">
                Identified Repast Title
              </label>
              <input
                type="text"
                value={activeName}
                onChange={(e) => setCustomPlateName(e.target.value)}
                className="w-full bg-white px-2.5 py-1.5 rounded border border-[#d8c3b4] font-['Newsreader',serif] text-base text-[#2a170f] font-semibold focus:outline-[#894d0d]"
              />
              <span className="font-['Fira_Sans',sans-serif] text-xs text-[#857467] italic block mt-1">
                {currentPreset.subtitle}
              </span>
            </div>

            {/* Calorie & Macro Decomposition */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-[#ffe9e2] p-2.5 rounded-lg text-center border border-[#d8c3b4]/30">
                <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#176a30] font-bold uppercase block">
                  Protein
                </span>
                <span className="font-['Newsreader',serif] text-xl font-bold text-[#176a30]">
                  {currentPreset.macros.protein}g
                </span>
              </div>
              <div className="bg-[#ffe9e2] p-2.5 rounded-lg text-center border border-[#d8c3b4]/30">
                <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#894d0d] font-bold uppercase block">
                  Carbs
                </span>
                <span className="font-['Newsreader',serif] text-xl font-bold text-[#894d0d]">
                  {currentPreset.macros.carbs}g
                </span>
              </div>
              <div className="bg-[#ffe9e2] p-2.5 rounded-lg text-center border border-[#d8c3b4]/30">
                <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#8c4f10] font-bold uppercase block">
                  Lipids/Fat
                </span>
                <span className="font-['Newsreader',serif] text-xl font-bold text-[#8c4f10]">
                  {currentPreset.macros.fat}g
                </span>
              </div>
            </div>

            {/* Target Meal Folio Selector */}
            <div className="mb-4">
              <label className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] uppercase font-bold tracking-wider block mb-1">
                Designate Meal Category Folio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'breakfast', label: 'Entry I • Breakfast' },
                  { id: 'lunch', label: 'Entry II • Lunch' },
                  { id: 'dinner', label: 'Entry III • Dinner' },
                  { id: 'snacks', label: 'Entry IV • Snacks' },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      playMechanicalClick(soundEnabled);
                      setTargetCategory(slot.id as 'breakfast' | 'lunch' | 'dinner' | 'snacks');
                    }}
                    className={`py-1.5 px-2 rounded-lg font-['Fira_Sans',sans-serif] text-xs font-semibold border transition-all cursor-pointer ${
                      targetCategory === slot.id
                        ? 'bg-[#a76526] text-white border-[#894d0d] shadow-sm'
                        : 'bg-[#ffe9e2] text-[#2a170f] border-[#d8c3b4]/40 hover:bg-[#ffe2d8]'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2 pt-3 border-t border-[#d8c3b4]/30">
            {committedSuccess ? (
              <div className="p-3 rounded-lg bg-[#358446] text-white font-['Newsreader',serif] text-center font-semibold animate-bounce">
                ✓ Stamped &amp; Transcribed to Journal!
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={triggerOpticalScan}
                  disabled={isScanning}
                  className="w-full py-2 rounded-lg bg-[#ffe9e2] hover:bg-[#ffe2d8] text-[#894d0d] font-['Fira_Sans',sans-serif] text-xs font-bold uppercase tracking-wider border border-[#d8c3b4] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  <span>{isScanning ? 'Spectrometer Active...' : 'Re-compute Optical Scan'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCommit}
                  disabled={isScanning}
                  className="w-full py-3 rounded-lg bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] text-[#2e1500] font-['Fira_Sans',sans-serif] text-sm font-bold uppercase tracking-wider shadow-lg hover:brightness-105 active:translate-y-0.5 active:shadow-inner flex items-center justify-center gap-2 cursor-pointer border border-[#ffdcc2]/40"
                >
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Chronostamp &amp; Commit to Ledger</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
