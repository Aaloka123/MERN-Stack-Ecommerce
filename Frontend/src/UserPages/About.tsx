import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import Header from "../Component/Header";
import Footer from "../Component/Footer";

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3e1c3]">
      <Header />

      <div className="bg-[#f3e1c3]">
        {/* Hero Section */}
        <section className="relative bg-[#7b1b2b] text-white py-16 md:py-20">
          <div className="max-w-6xl mx-auto text-center px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              About <span className="text-[#f3e1c3]">Aaloka Store</span>
            </h1>
            <p className="text-lg md:text-xl text-[#fdf4ee] max-w-3xl mx-auto">
              More than fashion — we create timeless stories stitched with love,
              confidence, and conscious design.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <h2 className="text-3xl font-bold text-[#7b1b2b] mb-6 text-center">
            Our Story
          </h2>
          <p className="text-lg leading-relaxed text-gray-800 mb-6 text-center max-w-3xl mx-auto">
            Welcome to <span className="font-semibold">Aaloka Store</span>,
            where style meets comfort. Clothing is not just fabric — it is a
            voice, a mood, and your identity. Every piece in our collection is
            designed with care, detail, and modern elegance.
          </p>
          <p className="text-lg leading-relaxed text-gray-800 text-center max-w-3xl mx-auto">
            What started as a dream to celebrate individuality is now a
            community that embraces confidence, creativity, and mindful living.
          </p>
        </section>

        {/* Values Section */}
        <section className="bg-[#f7ddbc] py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Quality First",
                desc: "Every stitch, cut, and fabric is chosen with care for comfort and durability.",
                icon: (
                  <Icon icon="mdi:scissors" className="w-14 h-14 mx-auto mb-4 text-[#7b1b2b]" />
                ),
              },
              {
                title: "Conscious Fashion",
                desc: "We lean into thoughtful choices to keep fashion kinder to people and the planet.",
                icon: (
                  <Icon icon="mdi:leaf" className="w-14 h-14 mx-auto mb-4 text-[#7b1b2b]" />
                ),
              },
              {
                title: "For Everyone",
                desc: "From everyday staples to statement pieces, our collections fit many moods and stories.",
                icon: (
                  <Icon icon="mdi:users" className="w-14 h-14 mx-auto mb-4 text-[#7b1b2b]" />
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#f3e1c3] hover:bg-[#fdf4ee] hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 rounded-2xl p-8 text-center border border-[#e2c9a5]"
              >
                {item.icon}
                <h3 className="text-xl font-semibold mb-3 text-[#7b1b2b]">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join Us */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7b1b2b] mb-4">
            Join the Journey
          </h2>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto mb-8">
            Wearing <span className="font-semibold">Aaloka</span> means joining
            a movement that values individuality, self-expression, and effortless
            elegance.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-[#7b1b2b] text-white text-sm md:text-base font-semibold rounded-full shadow-md hover:bg-[#5c131f] hover:shadow-lg transition tracking-[0.16em]"
          >
            EXPLORE COLLECTION
          </button>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;