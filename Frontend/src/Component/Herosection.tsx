import { useNavigate } from "react-router-dom";
import img1 from "../assets/img1.svg";
import img2 from "../assets/img2.svg";
import img3 from "../assets/img3.svg";
import bgimage from "../assets/bgimage.svg";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{ backgroundImage: `url(${bgimage})`, backgroundSize: "cover" }}
      className="w-full bg-cover bg-center"
    >
      <div className="sm:px-8 lg:px-20 py-12">
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-center">
          <div className="flex flex-col items-center">
            <img
              src={img1}
              alt="Hero 1"
              className="w-auto max-w-[350px] h-auto lg:h-[550px] rounded-2xl shadow-md transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            />
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="inline-flex items-center justify-center rounded-full bg-[#7b1b2b] text-white h-[54px] text-[18px] sm:text-[20px] font-semibold tracking-wider px-8 sm:px-10 py-3 mt-6 lg:mt-12 shadow-lg transition-all duration-300 hover:bg-[#5c131f] hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              SHOP NOW
            </button>
          </div>

          {/* Center image + overlay text */}
          <div className="relative w-full lg:w-[550px] h-auto lg:h-[700px] flex justify-center">
            <img
              src={img3}
              alt="Hero Center"
              className="w-full h-auto rounded-2xl shadow-md transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
            />
            <div className="absolute bottom-6 lg:bottom-10 left-0 w-full text-white px-4 lg:px-9 pb-4 text-center transition-transform duration-300 hover:scale-105">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide drop-shadow-lg">
                Wear what speaks your Story
              </p>
            </div>
          </div>

          {/* Right image + button */}
          <div className="flex flex-col items-center">
            <img
              src={img2}
              alt="Hero 3"
              className="w-auto max-w-[350px] h-auto lg:h-[550px] rounded-2xl shadow-md transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            />
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="inline-flex items-center justify-center rounded-full bg-[#7b1b2b] text-white h-[54px] text-[18px] sm:text-[20px] font-semibold tracking-wider px-8 sm:px-10 py-3 mt-6 lg:mt-12 shadow-lg transition-all duration-300 hover:bg-[#5c131f] hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              EXPLORE MORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
