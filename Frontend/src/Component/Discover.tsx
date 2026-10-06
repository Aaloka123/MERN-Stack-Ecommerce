import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Top from "../assets/Top.svg";
import bgimage from "../assets/bgimage.svg";

const Discover = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-[#fbf5ee] px-4 sm:px-8 lg:px-20 py-16 lg:py-24">
      {/* Background with texture & gradient */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: `url(${bgimage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#fbf5ee] via-[#fbf5ee]/90 to-transparent pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Column: Editorial Philosophy & Feature Chips */}
        <div className="flex-1 flex flex-col text-center lg:text-left items-center lg:items-start max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#c59b27]/40 text-xs font-bold tracking-[0.22em] uppercase text-[#7b1b2b] shadow-xs mb-4">
            <Icon icon="mdi:crown-outline" className="text-[#c59b27]" width={15} />
            <span>The Aaloka Philosophy</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#7b1b2b] leading-[1.18] tracking-tight mb-5">
            Discover the Essence <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#9b2438]">of Effortless Elegance</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light mb-8 max-w-lg">
            From imperial evening wear to sublime everyday essentials, every garment at Aaloka is hand-tailored using time-honored artisanal weaves. Created to celebrate your individuality with graceful comfort and uncompromised luxury.
          </p>

          {/* 3 Luxury Value Proposition Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8">
            <div className="flex flex-col items-center lg:items-start p-3 rounded-xl bg-white/80 border border-[#e8d7c4] shadow-xs">
              <span className="text-lg mb-1">🌿</span>
              <span className="text-xs font-bold text-gray-900">Pure Fabrics</span>
              <span className="text-[11px] text-gray-500">100% Breathable</span>
            </div>
            <div className="flex flex-col items-center lg:items-start p-3 rounded-xl bg-white/80 border border-[#e8d7c4] shadow-xs">
              <span className="text-lg mb-1">✂️</span>
              <span className="text-xs font-bold text-gray-900">Artisanal Fit</span>
              <span className="text-[11px] text-gray-500">Master Stitching</span>
            </div>
            <div className="flex flex-col items-center lg:items-start p-3 rounded-xl bg-white/80 border border-[#e8d7c4] shadow-xs">
              <span className="text-lg mb-1">⚡</span>
              <span className="text-xs font-bold text-gray-900">Swift Delivery</span>
              <span className="text-[11px] text-gray-500">Insured Shipping</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="group inline-flex items-center gap-2.5 bg-[#7b1b2b] text-white px-8 py-3.5 rounded-full font-semibold tracking-wider text-sm shadow-xl transition-all duration-300 hover:bg-[#58101c] hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>EXPLORE ATELIER</span>
              <Icon icon="mdi:arrow-right" width={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/about")}
              className="inline-flex items-center gap-2 bg-white/80 border border-[#d8c3aa] text-[#7b1b2b] px-6 py-3.5 rounded-full font-semibold tracking-wider text-sm shadow-xs transition-all duration-300 hover:bg-white hover:border-[#7b1b2b]/40 cursor-pointer"
            >
              <Icon icon="mdi:book-open-page-variant-outline" width={16} />
              <span>OUR STORY</span>
            </button>
          </div>
        </div>

        {/* Right Column: Elegantly Framed Visual Showcase */}
        <div className="flex-1 relative flex justify-center lg:justify-end w-full max-w-lg lg:max-w-none">
          <div className="relative w-full max-w-md aspect-[3/3.8] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 bg-gradient-to-b from-[#f5ebd9] to-[#eddcc4]">
            <img
              src={Top}
              alt="Aaloka Model Presentation"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />

            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Floating Glassmorphic Social Proof Card */}
            <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-lg text-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[#c59b27] text-sm">
                    {"★".repeat(5)}
                    <span className="text-xs font-bold text-gray-800 ml-1">4.9 / 5.0</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Cherished by over 12,500+ couture enthusiasts
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-[#7b1b2b] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Icon icon="mdi:check-decagram" width={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Discover;
