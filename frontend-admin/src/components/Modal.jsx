import React from "react";
import ktsRequest from "../../ultis/ktsrequest";
import { toast } from "react-toastify";
const Modal = (props) => {
  const handleAction = async () => {
    try {
      const res = await ktsRequest.put(
        `${props.to}/${props.data._id}`,
        { ...props.data, ...props.editedData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      toast.success(res.data, {
        onClose: () => props.refreshData(true),
      });
    } catch (error) {
      toast.error(error.response ? error.response.data : "Network Error!", {
        onClose: () => props.refreshData(true),
      });
    }
    props.close(false);
  };
  return (
    <div className="w-screen h-full bg-black/10 z-30 absolute flex justify-center items-center top-0 left-0">
      <div className="w-1/3 bg-white rounded-md overflow-hidden border-2 border-white">
        <div className="bg-red-500 p-2 uppercase font-bold text-white">
          {props.title || "cảnh báo!"}
        </div>
        <div className="py-4">{props.message || "nội dung"}</div>
        <div className="flex gap-2 justify-end p-2">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            onClick={handleAction}
          >
            Xác nhận
          </button>
          <button
            className="px-4 py-2 text-white bg-primary rounded hover:bg-green-700"
            onClick={() => props.close(false)}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
