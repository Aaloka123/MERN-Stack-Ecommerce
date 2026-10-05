import React from "react";
import { useNavigate } from "react-router-dom";
import Top from "../assets/Top.svg";
import bgimage from "../assets/bgimage.svg";

const Discover = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full px-4 sm:px-8 lg:px-20 pt-8 h-[550px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgimage})` }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch max-w-7xl mx-auto">
        {/* Left Text Section */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left mb-8 md:mb-0 md:pr-12">
          <span className="inline-block self-center md:self-start mb-3 px-3.5 py-1 text-xs font-semibold tracking-[0.2em] uppercase rounded-full bg-[#7a1e2c]/10 text-[#7a1e2c]">
            Curated Collection
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[42px] font-extrabold text-[#7a1e2c] mb-5 leading-tight tracking-tight">
            Discover the Essence <br /> of Effortless Elegance
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-7 max-w-xs sm:max-w-sm md:max-w-md mx-auto md:mx-0 leading-relaxed">
            From everyday staples to statement pieces, our curated collections
            are designed to celebrate your individuality with comfort, class,
            and confidence.
          </p>
          <div className="flex justify-center md:justify-start">
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="bg-[#7a1e2c] text-white px-8 py-3.5 rounded-full font-semibold tracking-wider hover:bg-[#5c1621] hover:scale-105 active:scale-95 shadow-md hover:shadow-xl transition-all duration-300 text-sm sm:text-base cursor-pointer"
            >
              BUY NOW
            </button>
          </div>
        </div>

        {/* Right Image Section (unchanged) */}
        <div className="flex-1 flex justify-center md:justify-end relative mt-6 md:m-0">
          <img
            src={Top}
            alt="Fashion"
            className="relative w-[49%] sm:w-[40%] md:w-[140%] lg:w-[150%] object-contain"
            style={{ transform: "translateY(-20%)" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Discover;
