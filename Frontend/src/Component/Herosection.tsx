import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import img1 from "../assets/img1.svg";
import img2 from "../assets/img2.svg";
import img3 from "../assets/img3.svg";
import bgimage from "../assets/bgimage.svg";
import heroImage from "../assets/hero.png";

// Carousel slides configuration
interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  hotspot: {
    title: string;
    price: string;
    tag: string;
    link: string;
    coords: { top: string; left: string };
  };
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "signature",
    badge: "★ SIGNATURE PIECES ★",
    title: "Wear What Speaks Your Story",
    subtitle: "Hand-finished silhouettes celebrating bespoke artistry and modern heritage.",
    image: img3,
    ctaText: "EXPLORE ALL",
    ctaLink: "/shop",
    hotspot: {
      title: "Royal Silk Sherwani Set",
      price: "Rs. 9,499",
      tag: "Bespoke Weave",
      link: "/shop?search=sherwani",
      coords: { top: "45%", left: "62%" },
    },
  },
  {
    id: "festive",
    badge: "✦ FESTIVE ROYALE '26 ✦",
    title: "Timeless Grandeur in Pure Silk",
    subtitle: "Draped in gold-accented zari embroidery, tailored for ceremonial splendor.",
    image: heroImage,
    ctaText: "SHOP FESTIVE",
    ctaLink: "/shop?category=festive",
    hotspot: {
      title: "Zari Embellished Kurta",
      price: "Rs. 6,899",
      tag: "Limited Stock",
      link: "/shop?search=kurta",
      coords: { top: "38%", left: "48%" },
    },
  },
  {
    id: "heritage",
    badge: "♦ ATELIER HERITAGE ♦",
    title: "The Poetry of Handcrafted Grace",
    subtitle: "Woven by master looms across ancient craft corridors, finished by hand.",
    image: img1,
    ctaText: "VIEW COUTURE",
    ctaLink: "/new",
    hotspot: {
      title: "Imperial Handloom Dupatta",
      price: "Rs. 3,499",
      tag: "Artisan Made",
      link: "/shop?search=dupatta",
      coords: { top: "52%", left: "40%" },
    },
  },
];

// Seasonal collection pill options
const SEASONS = [
  { id: "autumn", label: "Autumn / Winter 2026", icon: "mdi:leaf" },
  { id: "festive", label: "Festive Royale '26", icon: "mdi:sparkles" },
  { id: "spring", label: "Couture Prelude", icon: "mdi:crown-outline" },
];

// Quick navigation categories
const QUICK_TAGS = [
  { label: "Women's Silk", path: "/shop?category=women" },
  { label: "Men's Sherwanis", path: "/shop?category=men" },
  { label: "Festive Couture", path: "/shop?category=festive" },
  { label: "Handcrafted Zari", path: "/shop?search=zari" },
  { label: "New Arrivals", path: "/new" },
];

const HeroSection = () => {
  const navigate = useNavigate();

  // State 1: Active Season Tab
  const [activeSeason, setActiveSeason] = useState("autumn");

  // State 2: Center Showcase Carousel Slide
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // State 3: Interactive Hotspot Expansion
  const [isHotspotOpen, setIsHotspotOpen] = useState(false);

  // State 4 & 5: Interactive Wishlist Heart Toggles
  const [savedWomens, setSavedWomens] = useState(false);
  const [savedMens, setSavedMens] = useState(false);

  // State 6: Promo Code Copied Feedback
  const [copiedPromo, setCopiedPromo] = useState(false);

  // State 7: Lookbook Video / Editorial Teaser Modal
  const [lookbookOpen, setLookbookOpen] = useState(false);

  // Carousel auto-slide effect
  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isCarouselPaused, nextSlide]);

  // Copy promo coupon code handler
  const handleCopyCode = () => {
    navigator.clipboard?.writeText("ROYAL10");
    setCopiedPromo(true);
    setTimeout(() => setCopiedPromo(false), 2400);
  };

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section className="relative w-full overflow-hidden bg-[#fbf5ee]">
      {/* Background Texture & Warm Lighting Gradient */}
      <div
        style={{ backgroundImage: `url(${bgimage})`, backgroundSize: "cover", backgroundPosition: "center" }}
        className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#f6e9d6]/60 via-transparent to-[#fbf5ee] pointer-events-none" />

      {/* ── CHANGE 1: Animated Interactive Promo Ribbon with 1-Click Voucher Copy ── */}
      <div className="relative z-10 w-full bg-gradient-to-r from-[#58101c] via-[#7b1b2b] to-[#58101c] text-[#fdf4ee] py-2 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium">
          <span className="flex items-center gap-1.5 text-[#dfb743]">
            <Icon icon="mdi:sparkles" className="animate-spin" style={{ animationDuration: "6s" }} width={16} />
            <span className="font-bold tracking-wider uppercase text-[11px]">Limited Atelier Offer:</span>
          </span>
          <span className="text-[#f7efe6]/90 hidden sm:inline">
            Enjoy complimentary silk stole & 10% privilege on orders over Rs. 3,999
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-[#dfb743] hover:text-white transition-all text-[11px] font-bold tracking-widest uppercase cursor-pointer active:scale-95"
            title="Click to copy coupon code"
          >
            <Icon icon={copiedPromo ? "mdi:check-circle" : "mdi:content-copy"} width={13} />
            <span>{copiedPromo ? "COPIED: ROYAL10" : "CODE: ROYAL10"}</span>
          </button>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-12 lg:pt-12 lg:pb-16">
        {/* Editorial Eyebrow Header */}
        <div className="text-center mb-6 lg:mb-8">
          {/* ── CHANGE 2: Interactive Seasonal Story Switcher Tabs ── */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-full bg-white/90 border border-[#c59b27]/40 shadow-xs backdrop-blur-md mb-4">
            {SEASONS.map((season) => {
              const isActive = activeSeason === season.id;
              return (
                <button
                  key={season.id}
                  type="button"
                  onClick={() => setActiveSeason(season.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#7b1b2b] text-white shadow-sm scale-100"
                      : "text-[#7b1b2b]/80 hover:text-[#7b1b2b] hover:bg-black/5"
                  }`}
                >
                  <Icon icon={season.icon} width={13} className={isActive ? "text-[#dfb743]" : "text-[#c59b27]"} />
                  <span>{season.label}</span>
                </button>
              );
            })}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#7b1b2b] tracking-tight">
            {activeSeason === "festive"
              ? "The Splendor of Regal Festivities"
              : activeSeason === "spring"
              ? "Couture Whispers of Modern Grace"
              : "The Poetry of Contemporary Grace"}
          </h1>
          <p className="text-xs sm:text-sm text-[#7b1b2b]/75 mt-2 max-w-xl mx-auto font-normal">
            Bespoke loom-woven silhouettes uniting timeless royal heritage with effortless modern sensibility.
          </p>

          {/* ── CHANGE 3: Interactive Editorial Quick-Navigation Tag Bar ── */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => navigate(tag.path)}
                className="px-3.5 py-1 rounded-full text-xs font-semibold text-[#58101c] bg-white/60 hover:bg-white border border-[#c59b27]/30 hover:border-[#c59b27] transition-all duration-200 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Editorial Fashion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* ── Left Panel: Women's Showcase with Wishlist & Glass Sheen ── */}
          <div className="lg:col-span-3 flex flex-col items-center group">
            <div className="relative w-full max-w-[340px] aspect-[3/4.4] rounded-3xl overflow-hidden shadow-lg border border-white/70 bg-white/40 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1.5">
              <img
                src={img1}
                alt="Women's Collection - Bespoke handloom silk ensembles"
                width={340}
                height={500}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />

              {/* Editorial Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/90 text-[#7b1b2b] backdrop-blur-md shadow-xs border border-white/40">
                  WOMEN'S EDIT
                </span>
              </div>

              {/* ── CHANGE 4: Interactive Wishlist / Save Quick-Action ── */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSavedWomens(!savedWomens);
                }}
                className={`absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 shadow-md cursor-pointer ${
                  savedWomens
                    ? "bg-[#7b1b2b] text-[#dfb743] border-[#dfb743]"
                    : "bg-black/30 hover:bg-black/50 text-white border-white/30"
                }`}
                aria-label={savedWomens ? "Remove from wishlist" : "Save to wishlist"}
                title={savedWomens ? "Saved in wishlist" : "Save collection"}
              >
                <Icon icon={savedWomens ? "mdi:heart" : "mdi:heart-outline"} width={18} />
              </button>

              {/* Subtle Bottom Accent Tag */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white/90 text-xs font-medium">
                <span className="bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                  50+ Silhouettes
                </span>
                <span className="text-[#dfb743] font-bold text-xs">From Rs. 2,499</span>
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

          {/* ── Center Showcase: Multi-Slide Carousel & Interactive Shoppable Hotspot ── */}
          <div
            className="lg:col-span-6 flex flex-col items-center"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
          >
            {/* ── CHANGE 5: Dynamic Carousel Container with LCP fetchpriority ── */}
            <div className="relative w-full max-w-[540px] aspect-[3/4] sm:aspect-[4/4.8] lg:aspect-[4/4.9] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#dfb743]/50 bg-white/50 group transition-all duration-500">
              <img
                key={currentSlide.id}
                src={currentSlide.image}
                alt={currentSlide.title}
                width={540}
                height={660}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />

              {/* Gradient Vignette for Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 pointer-events-none" />

              {/* Floating Top Badge */}
              <div className="absolute top-5 inset-x-0 flex justify-center pointer-events-none">
                <span className="px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-[0.2em] uppercase bg-[#7b1b2b]/95 text-[#dfb743] border border-[#dfb743]/50 backdrop-blur-md shadow-lg transition-transform duration-300">
                  {currentSlide.badge}
                </span>
              </div>

              {/* ── CHANGE 6: Carousel Previous & Next Controls ── */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer shadow-md z-10"
                aria-label="Previous featured look"
              >
                <Icon icon="mdi:chevron-left" width={24} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer shadow-md z-10"
                aria-label="Next featured look"
              >
                <Icon icon="mdi:chevron-right" width={24} />
              </button>

              {/* ── CHANGE 7: Interactive Shoppable Hotspot ("Shop The Look") ── */}
              <div
                style={{ top: currentSlide.hotspot.coords.top, left: currentSlide.hotspot.coords.left }}
                className="absolute z-20"
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsHotspotOpen(!isHotspotOpen)}
                    className="relative flex items-center justify-center h-8 w-8 rounded-full bg-[#dfb743] text-[#58101c] shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    aria-label="View product details in this look"
                  >
                    <span className="absolute inset-0 rounded-full bg-[#dfb743] animate-ping opacity-60" />
                    <Icon icon="mdi:tag-outline" width={16} />
                  </button>

                  {/* Hotspot Floating Tooltip / Card */}
                  {isHotspotOpen && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-52 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-[#dfb743]/50 text-white shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between text-[10px] text-[#dfb743] font-bold uppercase tracking-wider mb-1">
                        <span>{currentSlide.hotspot.tag}</span>
                        <button
                          type="button"
                          onClick={() => setIsHotspotOpen(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-xs font-bold leading-snug">{currentSlide.hotspot.title}</p>
                      <p className="text-xs text-[#dfb743] font-extrabold mt-1">{currentSlide.hotspot.price}</p>
                      <button
                        type="button"
                        onClick={() => navigate(currentSlide.hotspot.link)}
                        className="mt-2 w-full py-1 text-[11px] font-bold rounded-lg bg-[#c59b27] hover:bg-[#dfb743] text-[#58101c] transition-colors cursor-pointer"
                      >
                        VIEW ITEM
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Frosted Glass Floating Caption Card */}
              <div className="absolute bottom-5 inset-x-4 sm:inset-x-6 p-5 sm:p-6 rounded-2xl bg-black/45 backdrop-blur-md border border-white/20 text-white text-center transition-all duration-300 group-hover:bg-black/55">
                <p className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold leading-tight drop-shadow-md tracking-wide">
                  {currentSlide.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-200 mt-2 max-w-sm mx-auto font-light leading-relaxed">
                  {currentSlide.subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => navigate(currentSlide.ctaLink)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#c59b27] text-white px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wider shadow-lg transition-all duration-300 hover:bg-[#dfb743] hover:text-[#58101c] hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>{currentSlide.ctaText}</span>
                    <Icon icon="mdi:arrow-right" width={16} />
                  </button>

                  {/* ── CHANGE 8: Interactive Lookbook Teaser / Video Film Trigger ── */}
                  <button
                    type="button"
                    onClick={() => setLookbookOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/35 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold tracking-wider border border-white/40 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:border-[#dfb743]"
                  >
                    <Icon icon="mdi:play-circle-outline" width={17} className="text-[#dfb743]" />
                    <span>RUNWAY FILM</span>
                  </button>
                </div>

                {/* Carousel Progress Indicators */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  {HERO_SLIDES.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        index === activeSlide ? "w-6 bg-[#dfb743]" : "w-1.5 bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Panel: Men's Showcase with Wishlist & Pricing ── */}
          <div className="lg:col-span-3 flex flex-col items-center group">
            <div className="relative w-full max-w-[340px] aspect-[3/4.4] rounded-3xl overflow-hidden shadow-lg border border-white/70 bg-white/40 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1.5">
              <img
                src={img2}
                alt="Men's Collection - Handcrafted sherwanis and bandhgalas"
                width={340}
                height={500}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />

              {/* Editorial Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/90 text-[#7b1b2b] backdrop-blur-md shadow-xs border border-white/40">
                  MEN'S EDIT
                </span>
              </div>

              {/* Interactive Wishlist / Save Quick-Action */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSavedMens(!savedMens);
                }}
                className={`absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 shadow-md cursor-pointer ${
                  savedMens
                    ? "bg-[#7b1b2b] text-[#dfb743] border-[#dfb743]"
                    : "bg-black/30 hover:bg-black/50 text-white border-white/30"
                }`}
                aria-label={savedMens ? "Remove from wishlist" : "Save to wishlist"}
                title={savedMens ? "Saved in wishlist" : "Save collection"}
              >
                <Icon icon={savedMens ? "mdi:heart" : "mdi:heart-outline"} width={18} />
              </button>

              {/* Subtle Bottom Accent Tag */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white/90 text-xs font-medium">
                <span className="bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                  40+ Tailored Styles
                </span>
                <span className="text-[#dfb743] font-bold text-xs">From Rs. 3,199</span>
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

        {/* ── CHANGE 9: Luxury Atelier Value & Trust Metrics Bar ── */}
        <div className="mt-12 pt-8 border-t border-[#c59b27]/30 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/50 backdrop-blur-xs border border-white/60 transition-transform hover:-translate-y-0.5">
            <Icon icon="mdi:certificate-outline" width={24} className="text-[#c59b27] mb-1" />
            <h4 className="text-xs sm:text-sm font-bold text-[#7b1b2b]">100% Certified Handloom</h4>
            <p className="text-[11px] text-gray-600 mt-0.5">Directly sourced weaver clusters</p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/50 backdrop-blur-xs border border-white/60 transition-transform hover:-translate-y-0.5">
            <Icon icon="mdi:ruler-square-compass" width={24} className="text-[#c59b27] mb-1" />
            <h4 className="text-xs sm:text-sm font-bold text-[#7b1b2b]">Bespoke Made-to-Measure</h4>
            <p className="text-[11px] text-gray-600 mt-0.5">Custom fits & bridal consults</p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/50 backdrop-blur-xs border border-white/60 transition-transform hover:-translate-y-0.5">
            <Icon icon="mdi:truck-fast-outline" width={24} className="text-[#c59b27] mb-1" />
            <h4 className="text-xs sm:text-sm font-bold text-[#7b1b2b]">Free Express Shipping</h4>
            <p className="text-[11px] text-gray-600 mt-0.5">Dispatched within 24 hours</p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/50 backdrop-blur-xs border border-white/60 transition-transform hover:-translate-y-0.5">
            <Icon icon="mdi:shield-star-outline" width={24} className="text-[#c59b27] mb-1" />
            <h4 className="text-xs sm:text-sm font-bold text-[#7b1b2b]">4.9/5 Atelier Rating</h4>
            <p className="text-[11px] text-gray-600 mt-0.5">Loved by 12,000+ patrons</p>
          </div>
        </div>
      </div>

      {/* ── CHANGE 10: Interactive Runway Lookbook Film Modal ── */}
      {lookbookOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lookbook-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setLookbookOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#480d17] border border-[#dfb743]/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLookbookOpen(false)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Close lookbook preview"
            >
              <Icon icon="mdi:close" width={20} />
            </button>

            <div className="text-center">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#dfb743] uppercase">
                Aaloka Atelier Experience
              </span>
              <h3 id="lookbook-modal-title" className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Autumn / Winter 2026 Runway
              </h3>
              <p className="text-xs sm:text-sm text-[#f8e1d6]/80 mt-2 max-w-md mx-auto">
                Step inside the loom sanctuary: witness how traditional artisans craft raw Mulberry silk into bespoke garments.
              </p>
            </div>

            {/* Video / Editorial Preview Poster */}
            <div className="relative mt-6 aspect-video rounded-2xl overflow-hidden border border-white/20 bg-black/60 flex items-center justify-center">
              <img
                src={img3}
                alt="Runway lookbook presentation"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute flex flex-col items-center text-center p-4">
                <div className="h-16 w-16 rounded-full bg-[#dfb743] text-[#480d17] flex items-center justify-center shadow-xl animate-pulse">
                  <Icon icon="mdi:play" width={34} />
                </div>
                <span className="text-xs font-bold tracking-widest text-[#dfb743] uppercase mt-3">
                  Atelier Docu-Series • 02:45
                </span>
                <span className="text-[11px] text-gray-300 mt-1">Sound on for craft ambience</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-white/15">
              <div className="flex items-center gap-2 text-xs text-[#dfb743]">
                <Icon icon="mdi:sparkles" width={16} />
                <span>Private screenings available at our atelier stores</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLookbookOpen(false);
                  navigate("/shop");
                }}
                className="px-5 py-2 rounded-full bg-[#c59b27] hover:bg-[#dfb743] text-[#480d17] text-xs font-bold tracking-wider transition-all cursor-pointer"
              >
                BROWSE COLLECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;

