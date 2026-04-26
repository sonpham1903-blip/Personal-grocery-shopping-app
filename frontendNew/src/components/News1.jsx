import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ktsRequest from '../../ultis/ktsrequest';

const Events = (props)=>{
    return (
        <div className="px-2.5 mb-4">
            <div className="h-full bg-white border solid border-[#FBFAFA] shadow rounded-xl overflow-hidden">
                <Link to={`/news/${props.id}`} className="block overflow-hidden w-full h-px pt-[60%] relative">
                    <img
                        src={props.picNews}
                        alt=""
                        className="absolute w-full h-full top-0 right-0 left-0 bottom-0 object-cover object-top"
                    />
                </Link>
                <div className="my-3 px-1.5">
                    <h3 className="text-base line-clamp-2 font-semibold mb-2.5">
                        <Link to={`/news/${props.id}`}>{props.title}</Link>
                    </h3>
                    
                    <div className="line-clamp-2">{props.description}</div>
                    <div className='flex justify-between mt-4'>
                    <span className="text-gray-600 text-sm mb-2.5">{new Date(props.date).toLocaleString()}</span>
                    <Link to={`/news/${props.id}`} className="text-[#D7480E] relative pr-5 arrow-news">
                        Chi tiết
                    </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
const News1 = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await ktsRequest.get(`/posts`);
                setData(res.data);
            } catch (err) {
                err.response ? toast.error(err.response.data.message) : toast.error('Network Error!');
            }
        };
        fetchData();
    }, []);
    const hot = data.length > 4 ? data.slice(0, 4) : data;

    return (
      
            <div className="max-w-screen-xl mx-auto px-2">
                <div className="flex justify-between">
                    <h2 className="text-lg font-bold mb-3.5">TIN TỨC & SỰ KIỆN</h2>
                    <Link to="/news" className="font-medium text-lg text-[#D7480E]">
                        Xem tất cả
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 -mx-2.5">
                    {hot ? hot.map((p, i) => {
                        return (
                            <Events
                                id={p._id}
                                picNews={p.thumbnail}
                                title={p.title}
                                date={p.createdAt}
                                description={p.description}
                                key={i}
                            />
                        );
                    }): <div className='text-center my-4'>Đang tải dữ liệu...</div>}
                </div>
            </div>
      )
}

export default News1