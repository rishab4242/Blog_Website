import Razorpay from "razorpay";
import crypto from "crypto";

// -------------------- CREATE ORDER --------------------
export const createOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    // expects: amount, currency, receipt etc.

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Order creation failed" });
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

// -------------------- VALIDATE PAYMENT --------------------
export const validatePayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

  const digest = sha.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({
      message: "Transaction is not legit!",
    });
  }

  res.json({
    message: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
};
