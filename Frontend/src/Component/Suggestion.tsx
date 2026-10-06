import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Fimg1 from "../assets/Fimg1.svg";
import Fimg2 from "../assets/Fimg2.svg";
import Fimg3 from "../assets/Fimg3.svg";
import Fimg4 from "../assets/Fimg4.svg";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image: string;
};

const fallbackSuggestions: Product[] = [
  { id: "s1", name: "Handcrafted Zari Kurta", price: 3899, image: Fimg1 },
  { id: "s2", name: "Crimson Silk Sherwani", price: 9299, image: Fimg2 },
  { id: "s3", name: "Imperial Bandhgala Suit", price: 7499, image: Fimg3 },
  { id: "s4", name: "Bespoke Royal Dupatta", price: 2999, image: Fimg4 },
];

const Suggestion = () => {
  const [items, setItems] = useState<Product[]>(fallbackSuggestions);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/products");
        const data = await res.json();
        if (res.ok && Array.isArray(data.products) && data.products.length > 0) {
          setItems(
            data.products.slice(0, 4).map((p: any, idx: number) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              image: p.image || [Fimg1, Fimg2, Fimg3, Fimg4][idx % 4],
            }))
          );
        }
      } catch {
        // keep fallbackSuggestions
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="bg-[#fbf5ee] px-4 sm:px-8 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-[#c59b27]/30" />
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#7b1b2b] tracking-tight">
            You May Also Like
          </h3>
          <div className="h-px flex-1 bg-[#c59b27]/30" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ id, image, name, price }) => (
            <div
              key={id}
              className="group flex flex-col rounded-2xl bg-white p-3.5 shadow-sm border border-[#ede2d4] transition-all duration-300 hover:shadow-xl hover:border-[#c59b27]/40 hover:-translate-y-1"
            >
              <Link to={`/productdetail/${id}`} className="block overflow-hidden rounded-xl bg-[#f7efe6] aspect-[3/3.8]">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              <div className="pt-3 pb-1 text-center">
                <Link
                  to={`/productdetail/${id}`}
                  className="font-medium text-base text-gray-800 line-clamp-1 group-hover:text-[#7b1b2b] transition-colors"
                >
                  {name}
                </Link>
                <p className="mt-1 font-bold text-sm text-[#7b1b2b]">
                  Rs. {price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;