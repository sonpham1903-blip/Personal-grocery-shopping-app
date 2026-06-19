import React, { useEffect, useState } from "react";
import ktsRequest from "../../../ultis/ktsrequest";
import { ToastContainer, toast } from "react-toastify";

import { Footer, Header, ItemCard, Navbar, Promotion } from "../../components";
import { useSearchParams } from "react-router-dom";

const products = () => {
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const query = (searchParams.get("q") || "").trim();
  const filterOcop = ["1", "true"].includes(
    (searchParams.get("ocop") || "").toLowerCase(),
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const params = [];
        if (query) params.push(`search=${encodeURIComponent(query)}`);
        if (filterOcop) params.push("ocop=1");

        const url = params.length
          ? `/products?${params.join("&")}`
          : "/products";
        const res = await ktsRequest.get(url);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        err.response
          ? toast.error(err.response.data)
          : toast.error("Network Error!");
        setLoading(false);
      }
    };
    fetchData();
  }, [query, filterOcop]);

  const handleOcopChange = (event) => {
    const nextParams = new URLSearchParams(searchParams);
    if (event.target.checked) {
      nextParams.set("ocop", "1");
    } else {
      nextParams.delete("ocop");
    }
    setSearchParams(nextParams);
  };

  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />
      <div className="max-w-screen-xl mx-auto py-4 px-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <input
              id="ocop-filter"
              type="checkbox"
              checked={filterOcop}
              onChange={handleOcopChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="ocop-filter"
              className="text-sm font-medium text-gray-700"
            >
              Chỉ hiển thị sản phẩm OCOP
            </label>
          </div>
          {filterOcop && (
            <button
              type="button"
              onClick={() => {
                const nextParams = new URLSearchParams(searchParams);
                nextParams.delete("ocop");
                setSearchParams(nextParams);
              }}
              className="text-sm text-primary hover:text-green-700"
            >
              Bỏ lọc OCOP
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[30vh]">
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
              stroke="green"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="green"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="max-w-screen-xl mx-auto py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full px-4">
          {data.map((p, i) => {
            return <ItemCard data={p} key={i} />;
          })}
        </div>
      )}
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default products;
