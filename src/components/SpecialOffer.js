import React from "react";
import Card from "./Card";
import gaming from "../assets/gaming.jpg";
import one from "../assets/cod mw3.jpg";
import two from "../assets/cod mw2.jpg";
import three from "../assets/cod1.jpg";
import four from "../assets/cod2.jpg";
import five from "../assets/cod3.jpg";
import six from "../assets/cod4.jpg";
import seven from "../assets/forza1.jpg";
import eight from "../assets/forza2.png";
import nine from "../assets/gta5.jpg";
import ten from "../assets/gta6.jpg";

const SpecialOffer = () => {
  const cards = [
    { wallpaper: one, title: "COD Modern Warfare 3" },
    { wallpaper: two, title: "COD Modern Warfare 2" },
    { wallpaper: three, title: "COD 1" },
    { wallpaper: four, title: "COD 2" },
    { wallpaper: five, title: "COD 3" },
    { wallpaper: six, title: "COD 4" },
    { wallpaper: seven, title: "Forza Horizon 5" },
    { wallpaper: eight, title: "Forza Horizon 6" },
    { wallpaper: nine, title: "GTA 5" },
    { wallpaper: ten, title: "GTA 6" },
  ];
  return (
    <div className="mx-[2rem]  ">
      <p className="text-white pt-6">Games on Discount</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3">
        {cards.map((card) => (
          <Card wallpaper={card.wallpaper} title={card.title} />
        ))}
      </div>
    </div>
  );
};

export default SpecialOffer;
