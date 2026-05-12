import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ktsConfig } from "../../ultis/config";

const Sidebar = (props) => {
  return (
    props.open && (
      <div className="md:w-1/2 w-full bg-black h-screen absolute z-20 top-0 left-0 opacity-80 flex duration-1000">
        <button
          className="text-white absolute right-3 top-3 "
          onClick={() => props.close(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex flex-col">
          {ktsConfig.navLinks.map((i, index) => {
            return (
              <Link
                className="px-12 py-3 uppercase inline-block text-white font-semibold hover:bg-green-700"
                to={i.path}
                key={index}
              >
                {i.title}
              </Link>
            );
          })}
        </div>
      </div>
    )
  );
};

export default Sidebar;
