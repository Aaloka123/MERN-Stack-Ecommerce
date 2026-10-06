import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Men from "../assets/Men.svg";
import women from "../assets/women.svg";
import Accessories from "../assets/Accessories.svg";

type CardProps = {
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  buttonLabel: string;
  to: string;
};

const CollectionCard = ({ title, subtitle, tag, image, buttonLabel, to }: CardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(to)}
      className="group relative w-full h-full overflow-hidden rounded-3xl shadow-lg border border-white/60 bg-cover bg-center cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Dynamic gradient overlay: darker on bottom and on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 transition-all duration-500 group-hover:from-black/90 group-hover:via-black/45" />

      {/* Floating Tag */}
      <div className="absolute top-5 left-5 z-10">
        <span className="px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-white/90 text-[#7b1b2b] backdrop-blur-md shadow-xs transition-transform duration-300 group-hover:scale-105">
          {tag}
        </span>
      </div>

      {/* Center / Bottom Content Area */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 lg:p-10 text-white">
        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#dfb743] font-semibold mb-2 drop-shadow-sm">
          {subtitle}
        </p>

        <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide leading-tight drop-shadow-md transition-transform duration-300 group-hover:translate-x-1">
          {title}
        </h3>

        <div className="mt-5 flex items-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(to);
            }}
            className="inline-flex items-center gap-2.5 rounded-full bg-white text-gray-900 font-bold tracking-wider px-6 py-3 text-xs sm:text-sm shadow-xl transition-all duration-300 group-hover:bg-[#7b1b2b] group-hover:text-white group-hover:gap-3.5 group-hover:shadow-2xl active:scale-95 cursor-pointer"
          >
            <span>{buttonLabel}</span>
            <Icon icon="mdi:arrow-right" width={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const collections: CardProps[] = [
  {
    title: "Men's Collection",
    subtitle: "Refined Sartorial Tailoring",
    tag: "120+ STYLES",
    image: Men,
    buttonLabel: "DISCOVER MEN",
    to: "/shop?category=men",
  },
  {
    title: "Women's Collection",
    subtitle: "Regal Drapes & Silhouettes",
    tag: "NEW SEASON",
    image: women,
    buttonLabel: "DISCOVER WOMEN",
    to: "/shop?category=women",
  },
  {
    title: "Accessories & Accents",
    subtitle: "Handcrafted Jewelry, Shawls & Heritage Bags",
    tag: "STATEMENT PIECES",
    image: Accessories,
    buttonLabel: "EXPLORE ACCESSORIES",
    to: "/shop?category=accessories",
  },
];

const CollectionsSection = () => {
  return (
    <section className="w-full bg-[#fbf5ee] px-4 sm:px-8 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#c59b27] uppercase">
            Signature Departments
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#7b1b2b] mt-1 tracking-tight">
            Curated Collections
          </h2>
          <div className="h-[2px] w-16 bg-[#c59b27]/60 mx-auto mt-3 rounded-full" />
        </div>

        {/* Responsive Editorial Layout */}
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Top Row: Men & Women Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="aspect-[3/4] sm:aspect-[4/4.8] lg:aspect-[4/4.6]">
              <CollectionCard {...collections[0]} />
            </div>
            <div className="aspect-[3/4] sm:aspect-[4/4.8] lg:aspect-[4/4.6]">
              <CollectionCard {...collections[1]} />
            </div>
          </div>

          {/* Bottom Row: Panoramic Accessories Card */}
          <div className="w-full aspect-[16/8] sm:aspect-[16/6] lg:aspect-[21/7]">
            <CollectionCard {...collections[2]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
