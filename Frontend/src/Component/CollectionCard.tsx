import React from "react";
import Men from "../assets/Men.svg";
import women from "../assets/women.svg";
import Accessories from "../assets/Accessories.svg";

// Your CollectionCard component
const CollectionCard = ({ title, image, buttonLabel }: { title: string, image: string, buttonLabel: string }) => {
  const words = title.split(" ");
  return (
    <div
      className="relative w-full h-full bg-cover bg-center overflow-hidden rounded-2xl shadow-md group transition-all duration-500"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10 flex flex-col items-center justify-center text-white text-center p-4 transition-all duration-300 group-hover:from-black/85">
        <h2 className="text-[26px] sm:text-[30px] font-extrabold drop-shadow-lg leading-tight tracking-wider transition-transform duration-300 group-hover:scale-105">
          {words.map((word: string, i: number) => (
            <div key={i}>{word}</div>
          ))}
        </h2>
        <button className="mt-5 rounded-full bg-white text-gray-900 font-semibold tracking-wider px-7 py-2.5 text-sm shadow-lg hover:bg-[#7b1b2b] hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

// Collections data
const collections = [
  {
    title: "MEN'S COLLECTION",
    image: Men,
    buttonLabel: "SHOP NOW",
  },
  {
    title: "WOMEN'S COLLECTION",
    image: women,
    buttonLabel: "SHOP NOW",
  },
  {
    title: "ACCESSORIES",
    image: Accessories,
    buttonLabel: "SHOP NOW",
  },
];

// CollectionsSection component
const CollectionsSection = () => {
  return (
    <div className="flex flex-wrap gap-4 px-4 sm:px-8 lg:px-20 py-12 justify-between">
      {collections.map((item, index) => {
        if (item.title === "ACCESSORIES") {
          return (
            <div
              key={index}
              className="basis-full"
              style={{ height: "400px", width: "100%" }}
            >
              <CollectionCard
                title={item.title}
                image={item.image}
                buttonLabel={item.buttonLabel}
              />
            </div>
          );
        }
        return (
          <div
            key={index}
            className="flex-1 w-[635px] "
            style={{ height: "735px" }}
          >
            <CollectionCard
              title={item.title}
              image={item.image}
              buttonLabel={item.buttonLabel}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CollectionsSection;
