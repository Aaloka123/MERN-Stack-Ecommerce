import React from "react";
import Men from "../assets/Men.svg";
import women from "../assets/women.svg";
import Accessories from "../assets/Accessories.svg";

// Your CollectionCard component
const CollectionCard = ({ title, image, buttonLabel }: { title: string, image: string, buttonLabel: string }) => {
  const words = title.split(" ");
  return (
    <div
      className="relative w-full h-full bg-cover bg-center overflow-hidden "
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
      <h2 className="text-[28px] font-extrabold drop-shadow-md leading-tight">
          {words.map((word: string, i: number) => (
            <div key={i}>{word}</div>
          ))}
        </h2>
        <button className="mt-4 bg-primary px-6 py-2 text-white text-[16px] hover:bg-primary/80 transition">
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
    <div className="flex flex-wrap gap-1 px-20 py-12 justify-between">
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
