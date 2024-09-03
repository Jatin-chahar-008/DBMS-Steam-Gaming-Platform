import React from "react";

const Categories = () => {
  return (
    <div className="gradient mx-[2rem] pl-4 pr-2 mt-8 flex items-center justify-between rounded-full  py-[0.1rem]  ">
      <ul className="flex items-center py-1.5 text-white text-[14px] gap-10">
        <li>
          <p>Racing</p>
        </li>
        <li>
          <p>Gun Games</p>
        </li>
        <li>
          <p>Action</p>
        </li>
        <li>
          <p>Story</p>
        </li>
        <li>
          <p>Classics</p>
        </li>
      </ul>
      
    </div>
  );
};

export default Categories;
