import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ktsRequest from "../../../ultis/ktsrequest";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !phone || !password || !confirmPassword) {
      return toast.error("Vui lòng điền đầy đủ thông tin");
    }

    if (password !== confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp");
    }

    if (password.length < 6) {
      return toast.error("Mật khẩu phải có ít nhất 6 ký tự");
    }

    setLoading(true);
    try {
      await ktsRequest.post("/auth/signup", {
        username,
        phone,
        password,
      });
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      err.response
        ? toast.error(err.response.data)
        : toast.error("Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center bg-login bg-cover bg-fixed bg-center bg-no-repeat">
      <div className="mx-auto flex w-full flex-col items-center justify-center px-6 py-8 md:h-screen md:w-4/6 lg:w-8/12 lg:py-0">
        <div className="w-full rounded-lg bg-white shadow border border-primary sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <div className="flex justify-center">
              <h3 className="uppercase font-bold text-xl text-primary">
                đăng ký tài khoản
              </h3>
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  name="username"
                  className="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="Username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  className="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="Số điện thoại"
                  required
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full uppercase rounded bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${loading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>

              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Trang chủ
                </Link>
                <p className="text-sm font-light text-gray-500">
                  Đã có tài khoản?
                  <Link
                    to="/login"
                    className="ml-2 font-medium text-primary hover:underline"
                  >
                    Đăng nhập
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

export default Register;
