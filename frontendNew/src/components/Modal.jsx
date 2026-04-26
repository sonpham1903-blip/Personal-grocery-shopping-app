import React from "react";
import { status } from "../../ultis/config";
const Modal = ({ data, close }) => {
  console.log(data);
  return (
    <div className="h-screen w-screen absolute top-0 left-0 bg-black/50 z-50 flex items-center">
      <div className="bg-white w-1/2 h-1/2 mx-auto rounded overflow-hidden">
        <div className="bg-primary text-white">
          <div className="flex justify-between items-center">
            <h3 className="pl-2">{data.orderNumber}</h3>
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-700"
              onClick={() => close(false)}
            >
              x
            </button>
          </div>
        </div>
        <div className="px-4 py-2 h-full">
          <div className="pb-2">
            <span className="">Trạng thái cuối cùng: </span>
            <span
              className={`${status[data.status].bgColor} ${
                status[data.status].textColor
              } px-1.5 py-0.5 font-semibold rounded`}
            >
              {status[data.status].name}
            </span>
          </div>
          <div className="space-y-2 overflow-auto h-[80%] pb-2">
            {data.tracking.map((t, i) => {
              return (
                <div
                  key={i}
                  className="border-l-4 border-primary px-2 py-1 rounded"
                >
                  <p className="font-semibold">{status[t?.status || 0].name}</p>
                  <p className="italic text-xs">
                    {new Date(t.time).toLocaleString()}
                  </p>
                  <p className="text-sm">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
