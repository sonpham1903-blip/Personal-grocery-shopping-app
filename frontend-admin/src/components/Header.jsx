import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { dashboard } from "../../ultis/config";
import { logout } from "../redux/userSlice";
import { setMsg } from "../redux/msgSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [header, setHeader] = useState("");
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    setHeader(dashboard.navLinks.find((i) => i.path === pathname)?.title);
  }, [pathname]);

  const textAvatar = (text) => {
    if (!text) return "A";
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

  const handleLogout = () => {
    dispatch(setMsg(`Tạm biệt! ${currentUser?.displayName || currentUser?.username}`));
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-ful">
      <div className="bg-white rounded px-2 h-[12vh] flex justify-between items-center">
        <h3 className="uppercase font-bold pl-4">{header}</h3>
        <div className="flex gap-3 items-center">
          <h3 className="font-bold hidden md:block">
            {currentUser?.displayName || currentUser?.username}
          </h3>
          
          <div className="relative">
            <div 
              className="rounded-full h-12 w-12 bg-orange-500 flex justify-center items-center text-white font-bold overflow-hidden border-2 border-primary cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {currentUser?.img ? (
                <img
                  src={currentUser.img}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                textAvatar(currentUser?.username || currentUser?.displayName)
              )}
            </div>

            {openMenu && (
              <div className="absolute top-14 right-0 z-50 rounded border border-gray-200 bg-white shadow-lg flex flex-col w-48 divide-y divide-gray-100 overflow-hidden">
                <button
                  className="px-4 py-3 text-left text-sm text-gray-700 hover:bg-primary hover:text-white flex items-center gap-2 transition-colors"
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/admin/thong-tin-tai-khoan");
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Trang cá nhân
                </button>
                <button
                  className="px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
                  onClick={() => {
                    setOpenMenu(false);
                    handleLogout();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
