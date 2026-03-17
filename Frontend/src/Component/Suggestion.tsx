import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image: string;
};

const Suggestion: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/products");
        const data = await res.json();
        if (res.ok && Array.isArray(data.products)) {
          setItems(
            data.products.slice(0, 4).map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              image: p.image,
            }))
          );
        }
      } catch {
        // ignore, keep empty
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="bg-secondaray px-0 sm:px-2 lg:px-4 py-10">
      <div className="h-1 bg-primary w-full" />

      <p className="text-primary font-extrabold text-2xl sm:text-3xl md:text-4xl text-left mt-6">
        You may also like
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10 mt-6">
        {items.map(({ id, image, name, price }) => (
          <div
            key={id}
            className="text-center group cursor-pointer transition-all duration-300"
          >
            <Link to={`/productdetail/${id}`}>
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
              Rs. {price.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestion;