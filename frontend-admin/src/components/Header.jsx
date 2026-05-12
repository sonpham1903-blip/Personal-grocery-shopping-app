import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { dashboard } from "../../ultis/config";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [header, setHeader] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    setHeader(dashboard.navLinks.find((i) => i.path === pathname)?.title);
  }, [pathname]);

  const textAvatar = (text) => {
    let name = text.split(" ");
    if (name.length === 1) {
      return name[0].charAt().toUpperCase();
    } else {
      return (
        name[0].charAt(0).toUpperCase() +
        name[name.length - 1].charAt(0).toUpperCase()
      );
    }
  };
  return (
    <div className="w-ful">
      <div className="bg-white rounded px-2 h-[12vh] flex justify-between items-center">
        <h3 className="uppercase font-bold pl-4">{header}</h3>
        <div className="flex gap-3 items-center">
          <h3 className="font-bold hidden md:block">
            {" "}
            {currentUser.displayName}
          </h3>
          <img src="" alt="" />
          <div className="rounded-full h-12 w-12 bg-orange-500 flex justify-center items-center text-white font-bold overflow-hidden border-2 border-primary">
            {currentUser.img ? (
              <img
                src={currentUser.img}
                alt=""
                className="w-full h-full object-cover object-center"
              />
            ) : (
              textAvatar(currentUser.username)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
