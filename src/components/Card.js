// Card.js
import React from "react";

const Card = ({ wallpaper, title }) => {
  // Set a fixed sale percentage for all games
  const fixedSalePercentage = -50;

  // Generate random prices between 1000 and 4000
  const originalPrice = Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000;
  const discountedPrice = Math.round(originalPrice * (1 + fixedSalePercentage / 100));

  const textColor = "text-green-500";
  const textColor2 = "text-red-500";

  return (
    <div className="card">
      <div>
        <img src={wallpaper} alt={title} style={{ height: "200px", width: "100%" }} />
        <div className="bg-blue-800 h-[8rem]">
          <p className="text-[18px] text-white pl-4 pt-2">{title}</p>
          <p className={`text-[px] ${textColor} pl-4 pt-2`}>{`${fixedSalePercentage}% Off`}</p>
          <div className="max-w-[10rem]">
            <p className={`ml-4 text-[18px] ${textColor2} mt-2`}>
              <span className="line-through">₹{originalPrice}</span>{" "}
              ₹{discountedPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
