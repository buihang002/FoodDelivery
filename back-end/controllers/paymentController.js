import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../config/apiKey.js";
import {
  VNPAY_COMMAND,
  VNPAY_HASH_SECRET,
  VNPAY_PMN_CODE,
  VNPAY_RETURN_URL,
  VNPAY_URL,
  VNPAY_VERSION,
} from "../config/vnpay.js";
import crypto from "crypto";
import moment from "moment";

const stripe = new Stripe(STRIPE_SECRET_KEY);
const frontend_url = "http://localhost:3000";
const exchangeRate = 25500;

//STRIPE method
const processStripePayment = async (order, items) => {
  try {
    const line_items = items.map((item) => ({
      price_data: {
        currency: "vnd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * exchangeRate),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "vnd",
        product_data: { name: "Delivery Charges" },
        unit_amount: exchangeRate * 2,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${order._id}`,
    });

    return session.url;
  } catch (error) {
    console.log(error);
  }
};

//VNPAY method
const processVNPayPayment = (order, amount) => {
  const vnp_TmnCode = VNPAY_PMN_CODE;
  const vnp_HashSecret = VNPAY_HASH_SECRET;
  const vnp_Url = VNPAY_URL;
  const vnp_ReturnUrl = VNPAY_RETURN_URL;
  const orderId = order._id.toString();
  const vnp_Amount = Math.round(amount * 100 * 25500);

  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");
  const expireDate = moment(date).add(15, "minutes").format("YYYYMMDDHHmmss");

  let vnp_Params = {
    vnp_Version: VNPAY_VERSION,
    vnp_Command: VNPAY_COMMAND,
    vnp_TmnCode,
    vnp_Amount,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl,
    vnp_IpAddr: "127.0.0.1",
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  const sortedParams = sortParams(vnp_Params);

  const urlParams = new URLSearchParams();
  for (let [key, value] of Object.entries(sortedParams)) {
    urlParams.append(key, value);
  }

  const querystring = urlParams.toString();

  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(querystring).digest("hex");

  urlParams.append("vnp_SecureHash", signed);

  const paymentUrl = `${vnp_Url}?${urlParams.toString()}`;

  return paymentUrl;
};

export const sortParams = (obj) => {
  const sortedObj = Object.entries(obj)
    .filter(
      ([key, value]) => value !== "" && value !== undefined && value !== null
    )
    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  return sortedObj;
};

export { processVNPayPayment, processStripePayment };
