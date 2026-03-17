import React from "react";
import { Link } from "react-router-dom";
import Timg1 from "../assets/Timg1.svg";
import Timg2 from "../assets/Timg2.svg";
import Timg3 from "../assets/Timg3.svg";
import Timg4 from "../assets/Timg4.svg";

const products = [
  {
    id: "P-101",
    name: "Handwoven cotton kurta",
    price: "Rs. 2,499.00",
    image: Timg1,
  },
  {
    id: "P-102",
    name: "Floral print dress",
    price: "Rs. 2,899.00",
    image: Timg2,
  },
  {
    id: "P-103",
    name: "Embroidered dupatta",
    price: "Rs. 1,599.00",
    image: Timg3,
  },
  {
    id: "P-104",
    name: "Classic linen shirt",
    price: "Rs. 1,999.00",
    image: Timg4,
  },
];

const Suggestion: React.FC = () => {
  return (
    <div className="bg-secondaray px-0 sm:px-2 lg:px-4 py-10">
      <div className="h-1 bg-primary w-full" />

      <p className="text-primary font-extrabold text-2xl sm:text-3xl md:text-4xl text-left mt-6">
        You may also like
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10 mt-6">
        {products.map(({ id, image, name, price }) => (
          <div
            key={id}
            className="text-center group cursor-pointer transition-all duration-300"
          >
            <Link to="/productdetail">
              <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-[#e6ddd0]">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-auto max-h-96 transition-transform duration-300 group-hover:scale-105 object-contain"
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
    </div>
  );
};

export default Suggestion;