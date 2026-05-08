import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../redux/userSlice";
import ktsRequest from "../../../ultis/ktsrequest";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const AdminLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      toast.success(`Chào sếp ${currentUser?.displayName}`, {
        position: "top-center",
      });
      return navigate("/admin");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    setLoading(true);
    try {
      const res = await ktsRequest.post("/auth/signin", {
        username: name,
        password,
      });
      dispatch(loginSuccess(res.data));
      toast.success(`Xin chào ${res.data.displayName}!`, {
        position: "top-center",
      });
      setLoading(false);
      navigate("/admin");
    } catch (err) {
      dispatch(loginFailure());
      setLoading(false);
      toast.error(err.response ? err.response.data : "Network Error!");
    }
  };
  return (
    // <div className="flex h-screen items-center bg-primary bg-cover bg-fixed bg-center bg-no-repeat">
    <div className="bg-login bg-cover bg-fixed bg-center bg-no-repeat h-screen flex justify-center items-center">
      <div className="mx-auto flex w-full flex-col items-center justify-center px-6 py-8 md:h-screen md:w-4/6 lg:w-8/12 lg:py-0">
        <div className="w-full rounded-lg shadow sm:max-w-md md:mt-0 xl:p-0 bg-white">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <div className="flex justify-center">
              {/* <img src={logo} className="mr-3 h-8 lg:h-16" alt="ktscorp Logo" /> */}
              <h3 className="uppercase font-bold">đăng nhập hệ thống</h3>
            </div>
            <form className="space-y-4 md:space-y-6" action="#">
              <input
                type="text"
                name="name"
                className="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
                placeholder="User name"
                required="a-z"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />

              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                required="abc"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <button
                type="submit"
                className="w-full rounded bg-primary px-5 py-3 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none"
                onClick={handleLogin}
              >
                {loading ? (
                  <svg
                    className="h-5  w-5 animate-spin text-white mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Đăng nhập"
                )}
              </button>
              <div className="flex items-center justify-between">
                <a
                  href="https://dichoho.top"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Trang chủ
                </a>
                <p className="text-sm font-light text-gray-500">
                  Chưa có tài khoản?
                  <Link
                    to="/register"
                    className="ml-2 font-medium text-primary hover:underline"
                  >
                    Đăng ký
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

