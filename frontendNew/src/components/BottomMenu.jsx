import { NavLink } from "react-router-dom";
import { dashboard } from "../../ultis/config";

const BottomMenu = () => {
  const activeLink =
    "w-full py-3 flex flex-col gap-1 justify-center items-center text-white text-xs font-semibold";
  const normalLink =
    "w-full py-3 flex flex-col gap-1 justify-center items-center text-gray-500 text-xs  hover:text-green-500 font-semibold";
  return (
    <div className="bg-white h-[8vh] md:hidden flex items-center">
      <div className="grid auto-cols-fr grid-flow-col w-full h-full">
        {dashboard.navLinks.map((i, index) => {
          return (
            <NavLink
              key={index}
              to={i.path}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "green" : "",
              })}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={i.d} />
              </svg>

              <span className="">{i.title}</span>
            </NavLink>
          );
        })}
        {/* <button
            className="flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded  border-primary border text-md m-2 font-semibold mt-12 hover:bg-primary hover:text-white uppercase "
            onClick={(e) => {
              e.preventDefault();
              dispatch(logout());
              navigate("/");
            }}
          >
            đăng xuất
          </button> */}
      </div>
    </div>
  );
};

export default BottomMenu;
