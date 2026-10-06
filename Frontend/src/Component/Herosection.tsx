import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import img1 from "../assets/img1.svg";
import img2 from "../assets/img2.svg";
import img3 from "../assets/img3.svg";
import bgimage from "../assets/bgimage.svg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-[#fbf5ee]">
      {/* Background with subtle warm gradient & texture */}
      <div
        style={{ backgroundImage: `url(${bgimage})`, backgroundSize: "cover", backgroundPosition: "center" }}
        className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#f6e9d6]/60 via-transparent to-[#fbf5ee] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-16">
        {/* Editorial Eyebrow Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#c59b27]/40 shadow-xs backdrop-blur-sm mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c59b27] animate-ping" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#7b1b2b] uppercase">
              Autumn / Winter 2026 Collection
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#7b1b2b] tracking-tight">
            The Poetry of Contemporary Grace
          </h1>
        </div>

        {/* 3-Column Editorial Fashion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Panel: Women's Showcase */}
          <div className="lg:col-span-3 flex flex-col items-center group">
            <div className="relative w-full max-w-[340px] aspect-[3/4.4] rounded-3xl overflow-hidden shadow-lg border border-white/70 bg-white/40 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1">
              <img
                src={img1}
                alt="Women's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/85 text-[#7b1b2b] backdrop-blur-md shadow-xs">
                  WOMEN'S EDIT
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/shop?category=women")}
              className="mt-5 w-full max-w-[340px] inline-flex items-center justify-center gap-2 rounded-full bg-[#7b1b2b] text-white h-12 text-sm font-semibold tracking-wider px-6 shadow-md transition-all duration-300 hover:bg-[#58101c] hover:shadow-xl hover:gap-3 active:scale-95 cursor-pointer"
            >
              <span>SHOP WOMENSWEAR</span>
              <Icon icon="mdi:arrow-right" width={18} />
            </button>
          </div>

          {/* Center Showcase: Main Statement Feature */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-[540px] aspect-[3/4] sm:aspect-[4/4.8] lg:aspect-[4/4.9] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#dfb743]/40 bg-white/50 group transition-all duration-500">
              <img
                src={img3}
                alt="Wear what speaks your story"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Vignette for Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 pointer-events-none" />

              {/* Floating Top Badge */}
              <div className="absolute top-5 inset-x-0 flex justify-center pointer-events-none">
                <span className="px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-[0.2em] uppercase bg-[#7b1b2b]/90 text-[#dfb743] border border-[#dfb743]/40 backdrop-blur-md shadow-md">
                  ★ SIGNATURE PIECES ★
                </span>
              </div>

              {/* Frosted Glass Floating Caption Card */}
              <div className="absolute bottom-5 inset-x-4 sm:inset-x-6 p-5 sm:p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white text-center transition-all duration-300 group-hover:bg-black/50">
                <p className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight drop-shadow-md tracking-wide">
                  Wear What Speaks Your Story
                </p>
                <p className="text-xs sm:text-sm text-gray-200 mt-2 max-w-sm mx-auto font-light leading-relaxed">
                  Hand-finished silhouettes celebrating bespoke artistry and modern heritage.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/shop")}
                    className="inline-flex items-center gap-2 rounded-full bg-[#c59b27] text-white px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wider shadow-lg transition-all duration-300 hover:bg-[#dfb743] hover:text-[#58101c] hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>EXPLORE ALL</span>
                    <Icon icon="mdi:arrow-right" width={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/new")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/35 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wider border border-white/40 backdrop-blur-sm transition-all duration-300 cursor-pointer"
                  >
                    <Icon icon="mdi:sparkles" width={14} className="text-[#dfb743]" />
                    <span>NEW IN</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Men's Showcase */}
          <div className="lg:col-span-3 flex flex-col items-center group">
            <div className="relative w-full max-w-[340px] aspect-[3/4.4] rounded-3xl overflow-hidden shadow-lg border border-white/70 bg-white/40 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1">
              <img
                src={img2}
                alt="Men's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/85 text-[#7b1b2b] backdrop-blur-md shadow-xs">
                  MEN'S EDIT
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/shop?category=men")}
              className="mt-5 w-full max-w-[340px] inline-flex items-center justify-center gap-2 rounded-full bg-[#7b1b2b] text-white h-12 text-sm font-semibold tracking-wider px-6 shadow-md transition-all duration-300 hover:bg-[#58101c] hover:shadow-xl hover:gap-3 active:scale-95 cursor-pointer"
            >
              <span>SHOP MENSWEAR</span>
              <Icon icon="mdi:arrow-right" width={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
