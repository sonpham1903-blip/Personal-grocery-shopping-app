import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { adminDashboard, dashboard } from "../../ultis/config";
import { logout } from "../redux/userSlice";
import logo from "../assets/imgs/logo_v4.png";
import { toast } from "react-toastify";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser?.role;
  const navLinks =
    role === "admin" ? adminDashboard.navLinks : dashboard.navLinks;
  const activeLink = `flex items-center gap-5 pl-4 py-1.5 mx-2 rounded text-white`;
  const normalLink = `flex items-center gap-5 pl-4 py-1.5 mx-2 rounded text-sm text-gray-800 hover:text-primary`;

  return (
    <div
      className={`h-screen ${open ? "w-72" : "w-24"} px-3 hidden md:block relative duration-300`}
    >
      <button
        className={`p-3 rounded-full border border-primary bg-white ${open ? "rotate-180" : ""} duration-500 absolute top-5 -right-5`}
        onClick={() => setOpen(!open)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="green"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
      <div className="h-[13vh]">
        <Link className="" to="/admin">
          {open && <img src={logo} className="mx-auto" />}
        </Link>
      </div>
      <div className="flex flex-col gap-1.5 capitalize">
        {navLinks.map((i, index) =>
          i.role.includes(role) ? (
            <NavLink
              key={index}
              to={i.path}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "green" : "",
              })}
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

              {open && (
                <span className="whitespace-pre absolute left-20">
                  {i.title}
                </span>
              )}
            </NavLink>
          ) : null,
        )}
        {role === "shop" ? (
          <>
            <button
              onClick={() => navigate("/admin/bai-viet")}
              className="flex items-center gap-5 pl-4 py-1.5 mx-2 rounded text-sm text-gray-800 hover:text-primary"
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
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h7.5"
                />
              </svg>
              {open && (
                <span className="whitespace-pre absolute left-20">Bài viết</span>
              )}
            </button>
          </>
        ) : null}
        <button
          className="flex items-center gap-5 pl-4 py-2 rounded border-primary border text-sm m-2 font-semibold hover:bg-primary hover:text-white uppercase"
          onClick={(e) => {
            e.preventDefault();
            dispatch(logout());
            toast.success(`bye ${currentUser.displayName}`);
            navigate("/login");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 rotate-180"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>

          {open && (
            <span className="whitespace-pre absolute left-20">đăng xuất</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
