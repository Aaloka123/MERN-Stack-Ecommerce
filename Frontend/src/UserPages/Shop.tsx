import React from "react";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Fimg1 from "../assets/Fimg1.svg";
import Fimg2 from "../assets/Fimg2.svg";
import Fimg3 from "../assets/Fimg3.svg";

const productImages = [Fimg1, Fimg2, Fimg3];

const products = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: "Rs. 8,000.00",
  tag: i % 3 === 0 ? "New" : i % 3 === 1 ? "Best Seller" : "Trending",
  image: productImages[i % productImages.length],
}));

const Shop = () => {
  return (
    <div className="min-h-screen bg-[#f3e1c3]">
      <Header />

      <main className="px-6 lg:px-20 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters on the left */}
          <aside className="w-full lg:w-72 lg:shrink-0">
            <div className="rounded-xl bg-[#f7ddbc] p-5 shadow-sm border border-[#e2c9a5]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b1b2b] mb-4">
                Filters
              </h2>

              <div className="space-y-5 text-sm text-gray-800">
                <div>
                  <p className="font-semibold mb-2">Category</p>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-[#7b1b2b]" />
                      <span>Women</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-[#7b1b2b]" />
                      <span>Men</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-[#7b1b2b]" />
                      <span>Accessories</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-2">Price</p>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="price" className="accent-[#7b1b2b]" />
                      <span>Under Rs. 5,000</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="price" className="accent-[#7b1b2b]" />
                      <span>Rs. 5,000 - 10,000</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="price" className="accent-[#7b1b2b]" />
                      <span>Above Rs. 10,000</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-2">Sort by</p>
                  <select className="w-full rounded-full border border-[#e2c9a5] bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#7b1b2b]">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>

                <button className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-[#7b1b2b] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#7b1b2b] hover:bg-[#7b1b2b] hover:text-white transition-colors">
                  CLEAR FILTERS
                </button>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-extrabold text-[#7b1b2b] tracking-tight">
                Shop
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-xl bg-[#f3e1c3] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="h-56 bg-[#e0c79f] flex items-center justify-center overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-1 bg-[#f7ddbc]">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#7b1b2b]">
                      {product.tag}
                    </p>
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-700">{product.price}</p>
                    <button className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#7b1b2b] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors">
                      ADD TO BAG
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;