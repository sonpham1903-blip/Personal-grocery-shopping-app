import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import ktsRequest from "../../../ultis/ktsrequest";
import { vnd } from "../../../ultis/ktsFunc";
import { addToCartServer } from "../../redux/cartReducer";
import { Footer, Header, Navbar, Promotion } from "../../components";

const ShopAssistance = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Dạ xin chào anh/chị! Em là Trợ lý Đi chợ Hộ AI. Em ở đây để giúp anh/chị lên thực đơn hoàn chỉnh và lựa chọn nguyên liệu sạch, tươi ngon nhất từ kho nông sản phù hợp với số người, ngân sách và sở thích. Nhà mình hôm nay dự kiến chuẩn bị bữa ăn cho mấy người thế ạ?",
      quickReplies: [
        "2 người ăn",
        "4 người ăn",
        "6 người ăn",
        "Ăn cơm văn phòng",
      ],
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Real-time Meal Planner Parameters State
  const [mealParams, setMealParams] = useState({
    pax: null,
    budget: null,
    preference: null,
  });

  const [comboProducts, setComboProducts] = useState([]);
  const [alternativeProducts, setAlternativeProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [budgetStatus, setBudgetStatus] = useState("within");
  const [addingCombo, setAddingCombo] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    if (!textToSend) {
      setInputValue("");
    }

    // Add user message to UI
    const updatedMessages = [...messages, { sender: "user", text }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Map message history to standard Gemini model API contents format
      const history = updatedMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const res = await ktsRequest.post("/assistant/chat", {
        messages: history,
      });

      if (res.data?.success) {
        const { status, ai_message, quick_replies } = res.data;

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: ai_message,
            quickReplies: quick_replies || [],
          },
        ]);

        if (status === "complete") {
          // Store extracted data
          setMealParams({
            pax: res.data.pax,
            budget: res.data.budget,
            preference: res.data.preference,
          });
          setComboProducts(res.data.comboProducts || []);
          setAlternativeProducts(res.data.alternativeProducts || []);
          setTotalPrice(res.data.totalPrice || 0);
          setBudgetStatus(res.data.budgetStatus || "within");

          toast.success(
            "💡 Đã lên thực đơn & chuẩn bị nguyên liệu thành công!",
          );
        }
      } else {
        toast.error("Đã xảy ra sự cố khi trao đổi với trợ lý.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi kết nối mạng!");
    } finally {
      setLoading(false);
    }
  };

  // Add individual product to cart
  const handleAddSingleItem = (product, quantity) => {
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    dispatch(
      addToCartServer({ productId: product._id, quantity }, currentUser),
    );
    toast.success(`Đã thêm ${quantity} x ${product.productName} vào giỏ hàng!`);
  };

  // Add entire suggested combo to cart in one-click
  const handleAddAllToCart = async () => {
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để thêm combo vào giỏ hàng");
      return;
    }
    if (comboProducts.length === 0) return;

    setAddingCombo(true);
    try {
      for (const item of comboProducts) {
        await dispatch(
          addToCartServer(
            { productId: item.product._id, quantity: item.quantity },
            currentUser,
          ),
        );
      }
      toast.success(
        "🎉 Tuyệt vời! Toàn bộ combo nông sản đã được đưa vào giỏ hàng!",
      );
    } catch (err) {
      toast.error("Không thể thêm toàn bộ sản phẩm vào giỏ hàng");
    } finally {
      setAddingCombo(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Helper for computing progress bar width
  const budgetPercentage = mealParams.budget
    ? Math.min(100, (totalPrice / mealParams.budget) * 100)
    : 0;

  return (
    <div className="flex flex-col font-sans min-h-screen">
      <Promotion />
      <Header />
      <Navbar />

      {/* Main Section */}
      <main className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-200 py-8 flex-grow">
        <div className="max-w-screen-xl w-full mx-auto px-4">
          {/* Banner Title */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                🥦 Trợ Lý Đi Chợ Hộ AI
              </h1>
              <p className="text-green-100 mt-2 text-sm md:text-base">
                Lên thực đơn hoàn hảo, cân đối dinh dưỡng và tối ưu ngân sách
                của gia đình bạn.
              </p>
            </div>
          </div>

          {/* Workspace Layout: Split Screen */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT SIDE: Chat Interface (7 cols) */}
            <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-[650px]">
              {/* Chat Header */}
              <div className="bg-green-700 px-6 py-4 flex items-center justify-between text-white border-b border-green-800">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-700 font-bold shadow-md">
                      AI
                    </div>
                    <div className="absolute right-0 bottom-0 w-3 h-3 bg-green-400 border-2 border-green-700 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">
                      Trợ Lý KTS Crop
                    </h3>
                    <p className="text-xs text-green-200">
                      Luôn sẵn sàng hỗ trợ bạn
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMessages([
                      {
                        sender: "ai",
                        text: "Dạ em đã làm mới cuộc trò chuyện. Hãy cho em biết số người ăn, ngân sách và món ăn yêu thích để bắt đầu nhé!",
                        quickReplies: [
                          "4 người ăn",
                          "Ngân sách 150k",
                          "Thịt ba chỉ heo",
                        ],
                      },
                    ]);
                    setMealParams({
                      pax: null,
                      budget: null,
                      preference: null,
                    });
                    setComboProducts([]);
                    setAlternativeProducts([]);
                    setTotalPrice(0);
                  }}
                  className="text-xs bg-green-800 hover:bg-green-900 transition-colors px-3 py-1.5 rounded-lg border border-green-600 flex items-center gap-1.5"
                  title="Làm mới cuộc hội thoại"
                >
                  🔄 Làm mới
                </button>
              </div>

              {/* Message Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 ${
                        msg.sender === "user"
                          ? "bg-green-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                      }`}
                    >
                      {/* Text Message */}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>

                      {/* Quick Replies for AI */}
                      {msg.sender === "ai" &&
                        msg.quickReplies &&
                        msg.quickReplies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-100">
                            {msg.quickReplies.map((reply, rid) => (
                              <button
                                key={rid}
                                onClick={() => handleSend(reply)}
                                className="bg-green-50 hover:bg-green-100 text-green-700 font-medium text-xs px-3 py-1.5 rounded-full transition-all border border-green-200 active:scale-95"
                              >
                                {reply}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-none border border-gray-100 px-4 py-3 shadow-sm flex items-center space-x-1.5">
                      <span
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ví dụ: 4 người ăn, ngân sách 200k, thích ăn thịt ba chỉ..."
                  disabled={loading}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !inputValue.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1 border-b-2 border-green-800"
                >
                  Gửi 🚀
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: Interactive Meal Planner Dashboard (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Panel 1: Parameter State Tracker */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center justify-between">
                  📊 Thông Số Bữa Ăn
                  <span className="text-xs text-gray-400 font-normal">
                    Cập nhật tự động
                  </span>
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                    <span className="text-xl">👥</span>
                    <p className="text-xs text-blue-700 mt-1 font-medium">
                      Số Người
                    </p>
                    <p className="text-base font-bold text-gray-800 mt-0.5">
                      {mealParams.pax ? `${mealParams.pax} người` : "Chưa có"}
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-center">
                    <span className="text-xl">💰</span>
                    <p className="text-xs text-yellow-700 mt-1 font-medium">
                      Ngân Sách
                    </p>
                    <p className="text-base font-bold text-gray-800 mt-0.5">
                      {mealParams.budget ? vnd(mealParams.budget) : "Chưa có"}
                    </p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
                    <span className="text-xl">🥗</span>
                    <p className="text-xs text-purple-700 mt-1 font-medium">
                      Sở Thích
                    </p>
                    <p
                      className="text-sm font-bold text-gray-800 mt-0.5 truncate"
                      title={mealParams.preference || ""}
                    >
                      {mealParams.preference || "Chưa có"}
                    </p>
                  </div>
                </div>

                {/* Progress gauge for input data completion */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-gray-500">
                    <span>Trạng thái thu thập thông tin</span>
                    <span>
                      {(
                        ((Boolean(mealParams.pax) +
                          Boolean(mealParams.budget) +
                          Boolean(mealParams.preference)) /
                          3) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-green-600 h-full transition-all duration-500"
                      style={{
                        width: `${((Boolean(mealParams.pax) + Boolean(mealParams.budget) + Boolean(mealParams.preference)) / 3) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Panel 2: Combo Meal Recommendations */}
              {comboProducts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 space-y-6">
                  {/* Budget Comparison Section */}
                  <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">
                        Tổng chi phí thực tế:
                      </span>
                      <span className="text-lg font-bold text-green-700">
                        {vnd(totalPrice)}
                      </span>
                    </div>

                    {/* Budget Slider/Progress bar comparison */}
                    {mealParams.budget && (
                      <div className="space-y-1">
                        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden relative">
                          <div
                            className={`h-full transition-all duration-500 ${
                              budgetStatus === "over"
                                ? "bg-red-500"
                                : budgetStatus === "under"
                                  ? "bg-yellow-500"
                                  : "bg-green-600"
                            }`}
                            style={{ width: `${budgetPercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                          <span>Chi phí: {budgetPercentage.toFixed(0)}%</span>
                          <span className="flex items-center gap-1">
                            {budgetStatus === "over" && (
                              <span className="text-red-600">
                                ⚠️ Vượt ngân sách!
                              </span>
                            )}
                            {budgetStatus === "within" && (
                              <span className="text-green-600">
                                ✅ Khớp ngân sách!
                              </span>
                            )}
                            {budgetStatus === "under" && (
                              <span className="text-yellow-600">
                                💡 Dưới ngân sách!
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggested Products list */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
                      🛒 Combo Nguyên Liệu Đề Xuất
                    </h4>

                    <div className="space-y-3 divide-y divide-gray-100">
                      {comboProducts.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center pt-3 first:pt-0"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                item.product?.thumbnail ||
                                item.product?.imgs?.[0] ||
                                "https://via.placeholder.com/60.png"
                              }
                              alt={item.product?.productName}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-100 shadow-sm"
                            />
                            <div>
                              <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                                {item.product?.productName}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                SL: {item.quantity} |{" "}
                                {vnd(item.product?.currentPrice)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleAddSingleItem(item.product, item.quantity)
                            }
                            className="bg-green-50 hover:bg-green-600 text-green-700 hover:text-white transition-all text-xs font-semibold py-1.5 px-3 rounded-lg border border-green-200 hover:border-transparent active:scale-95"
                          >
                            + Thêm
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Primary One-Click combo add-to-cart button */}
                    <button
                      onClick={handleAddAllToCart}
                      disabled={addingCombo || comboProducts.length === 0}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg border-b-4 border-green-800 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:bg-gray-300 flex items-center justify-center gap-2"
                    >
                      {addingCombo ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
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
                          Đang chuẩn bị...
                        </span>
                      ) : (
                        <>🛒 ĐẶT MUA CẢ COMBO THỰC ĐƠN</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Panel 3: Alternative Suggestions */}
              {alternativeProducts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 space-y-4">
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    💡 Có Thể Bạn Muốn Thay Thế / Thêm:
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    {alternativeProducts.map((prod, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50/50 rounded-xl p-2.5 border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div>
                          <img
                            src={
                              prod.thumbnail ||
                              prod.imgs?.[0] ||
                              "https://via.placeholder.com/120.png"
                            }
                            alt={prod.productName}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                          />
                          <p className="text-[11px] font-bold text-gray-800 line-clamp-1">
                            {prod.productName}
                          </p>
                          <p className="text-[10px] text-green-700 font-semibold mt-0.5">
                            {vnd(prod.currentPrice)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddSingleItem(prod, 1)}
                          className="w-full bg-white hover:bg-green-600 text-green-700 hover:text-white transition-all text-[10px] font-bold py-1.5 px-2 rounded-lg border border-green-200 hover:border-transparent mt-2 active:scale-95"
                        >
                          + Thay thế
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default ShopAssistance;
