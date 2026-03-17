import React from "react";
import Top from "../assets/Top.svg";
import bgimage from "../assets/bgimage.svg";

const Discover = () => {
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[40px] font-bold text-[#7a1e2c] mb-6 leading-snug">
            Discover the Essence <br /> of Effortless Elegance
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 max-w-xs sm:max-w-sm md:max-w-md mx-auto md:mx-0">
            From everyday staples to statement pieces, our curated collections
            are designed to celebrate your individuality with comfort, class,
            and confidence.
          </p>
          <button className="bg-[#7a1e2c] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-[#5c1621] transition text-sm sm:text-base">
            BUY NOW
          </button>
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
