import React, { useEffect, useState } from "react";
import ktsRequest from "../../../ultis/ktsrequest";
import { ToastContainer, toast } from "react-toastify";

import { Footer, Header, ItemCard, Navbar, Promotion } from "../../components";
import { useSearchParams } from "react-router-dom";

const products = () => {
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const query = searchParams.get("q") || "";
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(`/products?q=${query}`);
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
  }, [searchParams]);
  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />
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
        <div className="max-w-screen-xl mx-auto py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
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
