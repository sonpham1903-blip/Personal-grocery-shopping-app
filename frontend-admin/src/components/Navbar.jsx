import React from "react";
import { ktsConfig } from "../../ultis/config";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="bg-primary">
      {ktsConfig.navLinks.map((i) => {
        return (
          <Link
            className="p-3 uppercase inline-block text-white font-semibold"
            to={i.path}
          >
            {i.title}
          </Link>
        );
      })}
    </div>
  );
};

export default Navbar;
