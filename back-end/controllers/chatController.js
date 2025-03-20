import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Received message:", message);

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `You are an AI assistant for our food delivery website ONLY. You must:
              1. ONLY discuss features and information about our website
              2. NEVER mention or compare with other food delivery services
              3. NEVER make up information that isn't provided
              4. If asked about something you don't know, say "Xin lỗi, tôi không có thông tin về vấn đề này"
              5. Always be friendly and concise
              Our website information:
              About Us:
              - Website được phát triển bởi nhóm 5 thành viên:
                + Tài 97: fan anh chách
                + Huy 3D: gay
                + Hằng: xinh
                + Nga: xinh
                + Tuấn: đẹp trai nhất.
              
              Website Features:
              - Food ordering from multiple restaurants
              - Categories: Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles
              - Shopping cart functionality
              - Online payment via Stripe
              - Order tracking
              - User registration/login
                
              Ordering Process:
              1. Select food items and add to cart
              2. Fill delivery information
              3. Pay via Stripe
              4. Track order status

              Policies:
              - Delivery fee: 2/3 USD
              - Delivery time: 30-45 minutes
              - Payment: Online and COD
              - Order cancellation within 5 minutes

              Best sellers:
              1. Greek Salad - $12
              2. Chicken Rolls - $20
              3. Vanilla Ice Cream - $12
              4. Chicken Sandwich - $12
              5. Butterscotch Cake - $20`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Xin chào! Tôi là trợ lý AI của website đặt đồ ăn này. Tôi có thể giúp bạn tìm hiểu về các món ăn, cách đặt hàng và các chính sách của chúng tôi.",
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "có website nào tốt hơn không?" }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Tôi chỉ có thể tư vấn về website của chúng tôi. Với các tính năng đặt hàng đa dạng, giao hàng nhanh trong 30-45 phút và nhiều lựa chọn thanh toán, chúng tôi luôn cố gắng mang đến trải nghiệm tốt nhất cho khách hàng. Bạn muốn tìm hiểu thêm về dịch vụ nào của chúng tôi không?",
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "món nào ngon nhất?" }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Các món best-seller được khách hàng yêu thích nhất của chúng tôi bao gồm:\n1. Greek Salad ($12) - Salad kiểu Hy Lạp tươi ngon\n2. Chicken Rolls ($20) - Cuốn gà thơm ngon\n3. Vanilla Ice Cream ($12) - Kem vani mát lạnh\n4. Chicken Sandwich ($12) - Bánh mì kẹp gà\n5. Butterscotch Cake ($20) - Bánh bơ scotch đặc biệt\n\nBạn muốn đặt thử món nào không?",
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(message);
    console.log("AI response:", result.response.text());

    res.json({
      success: true,
      message: result.response.text(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi xử lý yêu cầu của bạn",
    });
  }
};

export { chatWithAI };
