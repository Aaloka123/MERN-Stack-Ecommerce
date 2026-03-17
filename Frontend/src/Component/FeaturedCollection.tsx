import React from "react";
import Timg1 from "../assets/Timg1.svg";
import Timg2 from "../assets/Timg2.svg";
import Timg3 from "../assets/Timg3.svg";
import Timg4 from "../assets/Timg4.svg";
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";

const FeaturedCollection = () => {
  const items = [
    { id: 1, img: Timg1, name: "Marron Long Coat", price: "RS. 8000.0" },
    { id: 2, img: Timg2, name: "Marron Long Coat", price: "RS. 8000.0" },
    { id: 3, img: Timg3, name: "Marron Long Coat", price: "RS. 8000.0" },
    { id: 4, img: Timg4, name: "White Tshirt", price: "RS. 8000.0" },
  ];

  return (
    <div className="bg-secondaray px-4 sm:px-8 lg:px-20 py-12">
      <div className="h-1 bg-primary w-full" />

      <p className="text-primary font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-center mt-6">
        Featured Collection
      </p>

      <div className="flex justify-end mt-4">
        <button className="flex items-center font-normal text-primary text-sm sm:text-base">
          Trending <Icon icon="mdi:chevron-down" className="ml-1" />
        </button>
      </div>

      {/* Responsive flex like Top Picks JSON */}
      <div className="flex flex-wrap justify-between gap-4 mt-6">
        {items.map(({ id, img, name, price }) => (
          <div
            key={id}
            className="w-full sm:w-[48%] lg:w-[23%] text-center group cursor-pointer transition-all duration-300"
          >
            <Link to={`/`}>
              <div className="overflow-hidden rounded-lg">
                <img
                  src={img}
                  alt={name}
                  className="w-full h-auto max-h-96 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            <p className="mt-2 font-semibold text-lg text-gray-800 transition-colors duration-300 group-hover:text-primary">
              {name}
            </p>
            <p className="text-gray-500 transition-colors duration-300 group-hover:text-primary">
              {price}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link to="/">
          <button className="inline-flex items-center justify-center rounded-full bg-[#7b1b2b] text-white font-semibold h-12 sm:h-14 text-sm sm:text-base px-8 sm:px-12 py-3 mt-6 mb-8 transition-all duration-300 hover:bg-[#5c131f] hover:shadow-lg hover:scale-105 hover:underline tracking-[0.12em]">
            SHOP NOW
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedCollection;
