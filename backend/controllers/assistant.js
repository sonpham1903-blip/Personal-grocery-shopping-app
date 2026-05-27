import axios from "axios";
import Product from "../models/Product.js";

// Text normalization helper for robust Vietnamese matching
const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const getTokens = (value = "") =>
  normalizeText(value).split(/\s+/).filter(Boolean);

// Helper to retry Gemini API calls with exponential backoff on 429 or 503 errors
const callGeminiWithRetry = async (url, payload, headers, maxRetries = 3, initialDelay = 1500) => {
  let delay = initialDelay;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(url, payload, { headers });
      return response;
    } catch (error) {
      const status = error.response?.status;
      if ((status === 429 || status === 503) && attempt < maxRetries) {
        console.warn(`[Gemini API] Request failed with status ${status} (Attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Double the wait time for the next attempt
      } else {
        throw error;
      }
    }
  }
};

export const handleAssistantChat = async (req, res, next) => {
  try {
    const { messages } = req.body; // Array of { role: 'user' | 'model', parts: [{ text: '...' }] }
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: "Lịch sử trò chuyện không hợp lệ" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Thiếu cấu hình GEMINI_API_KEY trên máy chủ" });
    }

    // System prompt directing Gemini to perform NLU and parameter collection
    const systemPrompt = `Bạn là trợ lý ảo đi chợ hộ thông minh (AI Shop Assistant) của một nền tảng phân phối nông sản sạch địa phương. Nhiệm vụ của bạn là hỗ trợ khách hàng lên thực đơn và chuẩn bị các nguyên liệu nấu ăn thô cần thiết hiện có trong kho.

Để đưa ra gợi ý combo sản phẩm tối ưu nhất, bạn CẦN THU THẬP ĐỦ 3 THÔNG TIN từ người dùng qua cuộc trò chuyện:
1. Số người ăn (pax) - Ví dụ: 2 người, 4 người.
2. Ngân sách dự kiến (budget) bằng VNĐ - Ví dụ: 150000, 200000.
3. Sở thích ăn uống hoặc món ăn, nguyên liệu chính mong muốn (preference) - Ví dụ: ăn nhiều rau, thích thịt heo ba chỉ, muốn nấu canh cua, v.v.

Quy trình xử lý:
- Phân tích tin nhắn mới nhất và lịch sử trò chuyện.
- Nếu thông tin chưa đủ (thiếu 1 trong 3 yếu tố số người ăn, ngân sách, hoặc sở thích món ăn):
  + Trả về JSON có status là "pending".
  + Đặt câu hỏi tiếp theo một cách tự nhiên, ngắn gọn, thân thiện bằng tiếng Việt để thu thập phần thông tin thiếu đó.
  + Gợi ý một số lựa chọn nhanh (quick_replies) có định dạng ngắn gọn (dưới 15 ký tự) để người dùng bấm chọn dễ dàng.
- Nếu thông tin ĐÃ ĐỦ:
  + Trả về JSON có status là "complete".
  + Trích xuất các thuộc tính: pax (số người), budget (ngân sách), preference (sở thích).
  + Gợi ý một bữa ăn/thực đơn hoàn chỉnh, ngon miệng và cân đối dinh dưỡng trong trường "ai_message" (ví dụ: "Dạ tuyệt vời, với ngân sách 200k cho 4 người ăn nhiều rau, tôi xin gợi ý thực đơn gồm: Thịt ba chỉ luộc chấm mắm tôm, Rau muống luộc lấy nước làm canh chua cà chua. Dưới đây là các nguyên liệu tươi ngon nhất tôi đã chọn sẵn cho bạn...").
  + Tạo danh sách các nguyên liệu thô cần thiết dưới dạng một mảng các cụm từ tìm kiếm tiếng Việt ngắn gọn trong trường "suggested_ingredients" (ví dụ: ["rau muong", "thit ba chi", "ca chua"]). Hãy đề xuất tối đa 3-5 nguyên liệu chính.

ĐỊNH DẠNG PHẢN HỒI BẮT BUỘC: Bạn chỉ được phản hồi duy nhất một chuỗi JSON hợp lệ. Không được thêm bất kỳ ký tự nào ngoài JSON như \`\`\`json hay \`\`\`.

Ví dụ phản hồi JSON khi CHƯA ĐỦ THÔNG TIN:
{
  "status": "pending",
  "ai_message": "Dạ em chào anh/chị! Em có thể giúp anh/chị chuẩn bị bữa ăn hôm nay ạ. Nhà mình dự kiến nấu bữa ăn cho mấy người ăn thế ạ?",
  "quick_replies": ["2 người ăn", "4 người ăn", "6 người ăn"]
}

Ví dụ phản hồi JSON khi ĐÃ ĐỦ THÔNG TIN:
{
  "status": "complete",
  "meal_type": "dinner",
  "pax": 4,
  "budget": 200000,
  "preference": "thịt ba chỉ, rau muống",
  "ai_message": "Tuyệt vời! Thực đơn hôm nay của nhà mình sẽ là Thịt heo ba chỉ luộc ăn kèm rau muống luộc chấm kho quẹt thơm ngon. Em đã tìm và chuẩn bị các nguyên liệu tươi mới nhất từ kho nông sản sạch cho anh/chị ngay bên dưới rồi ạ!",
  "suggested_ingredients": ["thịt heo", "rau muống", "cà chua"],
  "quick_replies": []
}`;

    // Prepare content structure for Gemini API
    const response = await callGeminiWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: messages,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      },
      {
        "Content-Type": "application/json"
      }
    );

    const geminiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!geminiText) {
      return res.status(500).json({ success: false, message: "Không nhận được phản hồi từ mô hình AI" });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(geminiText.trim());
    } catch (parseErr) {
      console.error("Gemini JSON Parse Error:", geminiText);
      return res.status(500).json({ success: false, message: "Không thể phân tích dữ liệu trả về từ AI" });
    }

    // If conversation is pending, return directly
    if (parsedResult.status === "pending") {
      return res.json({
        success: true,
        status: "pending",
        ai_message: parsedResult.ai_message,
        quick_replies: parsedResult.quick_replies || []
      });
    }

    // If status is complete, proceed to MERN Local Scoring & Querying
    const { pax, budget, preference, suggested_ingredients, ai_message } = parsedResult;

    // Fetch all active, in-stock products
    const availableProducts = await Product.find({ active: true, inStock: { $gt: 0 } });

    const preferenceTokens = getTokens(preference);
    const comboProducts = [];
    const alternatives = new Set();

    if (suggested_ingredients && Array.isArray(suggested_ingredients)) {
      for (const ingredient of suggested_ingredients) {
        const ingredientTokens = getTokens(ingredient);
        if (ingredientTokens.length === 0) continue;

        let bestProduct = null;
        let highestScore = 0;

        for (const product of availableProducts) {
          let score = 0;
          const prodNameNorm = normalizeText(product.productName);
          const prodDescNorm = normalizeText(product.description || "");
          const prodTagsNorm = (product.tags || []).map(t => normalizeText(t));
          const prodCat = product.cat || "";

          // 1. Match ingredient tokens in product details
          let isMatched = false;
          for (const token of ingredientTokens) {
            if (prodNameNorm.includes(token)) {
              score += 50;
              isMatched = true;
            } else if (prodTagsNorm.some(t => t.includes(token))) {
              score += 25;
              isMatched = true;
            } else if (prodDescNorm.includes(token)) {
              score += 15;
              isMatched = true;
            }
          }

          if (!isMatched) continue; // Skip product if it doesn't match the ingredient

          // 2. Broad preference matching boost
          for (const prefToken of preferenceTokens) {
            if (prodNameNorm.includes(prefToken)) {
              score += 10;
            }
          }

          // Category-specific boosting for Vietnamese staples
          if (["rau", "cai", "muong", "bau", "bi", "cu", "qua"].some(t => prodNameNorm.includes(t)) && prodCat === "CAT001") {
            score += 20;
          }
          if (["thit", "ca", "tom", "ga", "bo", "heo", "trung"].some(t => prodNameNorm.includes(t)) && prodCat === "CAT002") {
            score += 20;
          }

          // 3. Stock levels boost to prioritize high inventory items
          score += Math.min(product.inStock, 50) * 0.1;

          if (score > highestScore) {
            highestScore = score;
            bestProduct = product;
          }
        }

        if (bestProduct) {
          // Calculate dynamic realistic quantity based on guest count (pax)
          let quantity = 1;
          const nameLower = bestProduct.productName.toLowerCase();
          if (nameLower.includes("rau") || nameLower.includes("cải") || nameLower.includes("muống") || nameLower.includes("bí") || nameLower.includes("bầu")) {
            quantity = Math.max(1, Math.ceil(pax / 2)); // 1 bundle per 2 people
          } else if (nameLower.includes("thịt") || nameLower.includes("heo") || nameLower.includes("bò") || nameLower.includes("gà") || nameLower.includes("cá")) {
            quantity = Math.max(1, Math.ceil(pax / 4)); // 1 pack per 4 people
          }

          // Avoid duplicate main products in combo
          if (!comboProducts.some(p => p.product._id.toString() === bestProduct._id.toString())) {
            comboProducts.push({
              product: bestProduct,
              quantity: quantity
            });
          }
        }
      }

      // Populate alternative items from available products that matched but weren't selected
      const selectedIds = new Set(comboProducts.map(cp => cp.product._id.toString()));
      for (const product of availableProducts) {
        if (selectedIds.has(product._id.toString())) continue;

        let isAltMatch = false;
        const prodNameNorm = normalizeText(product.productName);

        for (const ingredient of suggested_ingredients) {
          const ingredientTokens = getTokens(ingredient);
          if (ingredientTokens.some(token => prodNameNorm.includes(token))) {
            isAltMatch = true;
            break;
          }
        }

        if (isAltMatch) {
          alternatives.add(product);
        }
      }
    }

    // Compute total combo price
    const totalPrice = comboProducts.reduce((sum, item) => sum + (item.product.currentPrice * item.quantity), 0);
    
    let budgetStatus = "within";
    if (totalPrice > budget) {
      budgetStatus = "over";
    } else if (totalPrice < budget * 0.8) {
      budgetStatus = "under";
    }

    return res.json({
      success: true,
      status: "complete",
      ai_message: ai_message,
      pax: pax,
      budget: budget,
      preference: preference,
      totalPrice: totalPrice,
      budgetStatus: budgetStatus,
      comboProducts: comboProducts,
      alternativeProducts: Array.from(alternatives).slice(0, 4) // Return top 4 alternative suggestions
    });

  } catch (error) {
    const status = error.response?.status;
    if (status === 429 || status === 503) {
      console.error(`[Gemini API] Request failed with rate limit error ${status}. Returning friendly conversational notice.`);
      return res.json({
        success: true,
        status: "pending",
        ai_message: "Dạ, hệ thống AI đang nhận được rất nhiều yêu cầu đi chợ cùng lúc nên tạm thời hơi bận một chút. Anh/chị vui lòng gửi lại tin nhắn vừa rồi sau khoảng vài giây giúp em nhé ạ! Phục vụ bữa ăn cho nhà mình là niềm vinh hạnh của em ạ. ❤️",
        quick_replies: []
      });
    }
    next(error);
  }
};
