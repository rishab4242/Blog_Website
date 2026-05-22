import Razorpay from "razorpay";
import { pool } from "../config/db.js";

export const createOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;

    // STEP 1: CREATE ORDER IN RAZORPAY
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({
        message: "Order creation failed",
      });
    }

    // STEP 2: SAVE ORDER IN DB
    const query = `
      INSERT INTO orders (
        user_id,
        razorpay_order_id,
        amount,
        currency,
        receipt,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
    `;

    const values = [
      req.user?.id || null, // if auth exists
      order.id,
      order.amount,
      order.currency,
      order.receipt,
      "pending",
    ];

    const result = await pool.query(query, values);

    res.json({
      success: true,
      order,
      dbOrder: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const validatePayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // ==============================
    // INIT RAZORPAY
    // ==============================

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // ==============================
    // VERIFY SIGNATURE
    // ==============================

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // ==============================
    // FIND ORDER
    // ==============================

    const orderResult = await pool.query(
      `
      SELECT * FROM orders
      WHERE razorpay_order_id = $1
      `,
      [razorpay_order_id],
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderResult.rows[0];

    // ==============================
    // DUPLICATE PAYMENT CHECK
    // ==============================

    const existingPayment = await pool.query(
      `
      SELECT * FROM payments
      WHERE razorpay_payment_id = $1
      `,
      [razorpay_payment_id],
    );

    if (existingPayment.rows.length > 0) {
      return res.json({
        success: true,
        message: "Payment already processed",
      });
    }

    // ==============================
    // FETCH PAYMENT FROM RAZORPAY
    // ==============================

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // ==============================
    // EXTRACT REAL PAYMENT DATA
    // ==============================

    const paymentMethod = payment.method;

    const email = payment.email;

    const contact = payment.contact;

    const paymentStatus = payment.status;

    // ==============================
    // SAVE PAYMENT
    // ==============================

    const paymentQuery = `
      INSERT INTO payments (
        order_id,
        razorpay_payment_id,
        razorpay_signature,
        payment_method,
        email,
        contact,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
    `;

    const paymentValues = [
      order.id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod,
      email,
      contact,
      paymentStatus,
    ];

    const paymentResult = await pool.query(paymentQuery, paymentValues);

    // ==============================
    // UPDATE ORDER STATUS
    // ==============================

    await pool.query(
      `
      UPDATE orders
      SET status = $1
      WHERE razorpay_order_id = $2
      `,
      [paymentStatus, razorpay_order_id],
    );

    // ==============================
    // SUCCESS RESPONSE
    // ==============================

    res.json({
      success: true,
      message: "Payment verified successfully",
      payment: paymentResult.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
