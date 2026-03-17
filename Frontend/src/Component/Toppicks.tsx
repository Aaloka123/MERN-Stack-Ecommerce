import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image: string;
};

const Toppicks = () => {
  const [toppickItems, setToppickItems] = useState<Product[]>([]);

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/products");
        const data = await res.json();
        if (res.ok && Array.isArray(data.products)) {
          setToppickItems(
            data.products.slice(0, 4).map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              image: p.image,
            }))
          );
        }
      } catch {
        // ignore
      }
    };
    fetchTopPicks();
  }, []);

  return (
    <div className="bg-secondaray px-4 sm:px-8 lg:px-20 py-12">
      <div className="h-1 bg-primary w-full" />

      <p className="text-primary font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-center mt-6">
        Top Picks
      </p>

      <div className="flex justify-end mt-4">
        <button className="flex items-center font-normal text-primary text-sm sm:text-base">
          Trending <Icon icon="mdi:chevron-down" className="ml-1" />
        </button>
      </div>

      {/* Responsive grid like Featured Collection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10 mt-6">
        {toppickItems.map(({ id, image, name, price }) => (
          <div
            key={id}
            className="text-center group cursor-pointer transition-all duration-300"
          >
            <Link to={`/productdetail/${id}`}>
              <div className="overflow-hidden rounded-lg">
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
              Rs. {price.toLocaleString("en-IN")}
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

export default Toppicks;
