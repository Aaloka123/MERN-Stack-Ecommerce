import React from "react";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Suggestion from "../Component/Suggestion";
import Timg1 from "../assets/Timg1.svg";
import Timg2 from "../assets/Timg2.svg";
import Timg3 from "../assets/Timg3.svg";

const Productdetail = () => {
  const images = [Timg1, Timg2, Timg3];
  const [activeImage, setActiveImage] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);

  return (
    <div className="bg-secondaray min-h-screen flex flex-col">
      <Header />

      {/* Product detail for one product */}
      <main className="flex-1 px-4 sm:px-8 lg:px-24 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs sm:text-sm text-gray-600">
          <span className="cursor-pointer hover:text-[#7b1b2b]">Home</span>
          <span className="mx-1">/</span>
          <span className="cursor-pointer hover:text-[#7b1b2b]">Shop</span>
          <span className="mx-1">/</span>
          <span className="text-[#2b1b1b] font-medium">Product</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 rounded-2xl bg-transparent shadow-none border-none p-0 sm:p-0">
          {/* Left: image + thumbnails */}
          <div>
            <div className="aspect-[4/4] w-full max-w-md overflow-hidden rounded-2xl border border-[#e2c9a5] bg-secondaray mx-auto">
              <img
                src={images[activeImage]}
                alt="Handwoven cotton kurta"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="mt-3 flex justify-center gap-3">
              {images.slice(0, 3).map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border bg-[#fdf7f0] ${
                    activeImage === idx
                      ? "border-[#7b1b2b] ring-2 ring-[#7b1b2b]"
                      : "border-[#e2c9a5]"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Handwoven cotton kurta view ${idx + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: details */}
          <div className="space-y-5 text-sm text-gray-800">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                Product detail
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
                Handwoven cotton kurta
              </h1>
              <p className="text-sm text-gray-600">
                Soft, breathable kurta with subtle embroidery, perfect for daily
                wear and small celebrations.
              </p>
            </div>

            <div className="flex items-baseline gap-3">
              <p className="text-2xl font-bold text-primary">Rs. 2,499</p>
            </div>

            {/* Size + actions (static for now) */}
            <div className="space-y-2">
              <p className="font-medium text-[#2b1b1b]">Available sizes</p>
              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL"].map((size) => {
                  const isActive = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[2.5rem] rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-[#7b1b2b] bg-[#7b1b2b] text-white"
                          : "border-[#e2c9a5] bg-[#fdf7f0] text-gray-800"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                disabled={!selectedSize}
                className={`rounded-full px-6 py-2 text-sm font-semibold tracking-[0.16em] text-white transition-colors ${
                  selectedSize
                    ? "bg-[#7b1b2b] hover:bg-[#5c131f]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        {/* You can keep showing suggested products below */}
        <div className="mt-10">
          <Suggestion />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Productdetail;