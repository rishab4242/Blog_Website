import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Collapse,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import toast from "react-hot-toast";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// ── Mobile expandable row ──────────────────────────────────────────────────
const MobileRow = ({ item, onRemove, onIncrease, onDecrease }) => {
  const [open, setOpen] = useState(false);
  const qty = item.qty || 1;

  return (
    <>
      {/* Collapsed: Action | Product | Name | chevron */}
      <TableRow
        sx={{
          cursor: "default",
          backgroundColor: open ? "" : "inherit",
          "&:last-child td": { borderBottom: 0 },
        }}
      >
        {/* Action */}
        <TableCell sx={{ py: 1, px: 1 }} onClick={(e) => e.stopPropagation()}>
          <IconButton
            onClick={() => onRemove(item.id)}
            size="small"
            sx={{
              backgroundColor: "#fde8e8",
              borderRadius: 1.5,
              width: 32,
              height: 32,
              "&:hover": { backgroundColor: "#f8d0d0" },
            }}
          >
            <DeleteIcon sx={{ fontSize: 16, color: "#c0392b" }} />
          </IconButton>
        </TableCell>

        {/* Product image */}
        <TableCell sx={{ py: 1, px: 1 }}>
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              objectFit: "cover",
              display: "block",
            }}
          />
        </TableCell>

        {/* Name */}
        <TableCell
          sx={{
            fontSize: 12,
            fontWeight: 500,
            py: 1,
            px: 1,
            maxWidth: 140,
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 500,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.title}
          </Typography>
        </TableCell>

        {/* Toggle expand button */}
        <TableCell
          sx={{ py: 1, px: 0.5, width: 36 }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            onClick={() => setOpen((p) => !p)}
            size="small"
            sx={{
              width: 32,
              height: 32,
              backgroundColor: open ? "#" : "#1a2233",
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: open ? "#" : "#",
                transform: "scale(1.08)",
              },
            }}
          >
            {open ? (
              <RemoveCircleIcon sx={{ fontSize: 18, color: "#1a2233" }} />
            ) : (
              <AddCircleIcon sx={{ fontSize: 18, color: "#fff" }} />
            )}
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Expanded: Price | Qty | Total */}
      <TableRow>
        <TableCell
          colSpan={4}
          sx={{ py: 0, px: 0, borderBottom: open ? undefined : 0 }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.5,
                py: 1.2,
                backgroundColor: "#f5f7ff",
                borderTop: "1px dashed #dde3f5",
              }}
            >
              {/* Price */}
              <Box>
                <Typography sx={{ fontSize: 10, color: "#888", mb: 0.2 }}>
                  Price
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                  ₹ {item.price}
                </Typography>
              </Box>

              {/* Qty controls */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <Typography sx={{ fontSize: 10, color: "#888", mr: 0.5 }}>
                  Qty
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecrease(item.id);
                  }}
                  size="small"
                  sx={{
                    backgroundColor: "#dbeafe",
                    width: 26,
                    height: 26,
                    "&:hover": { backgroundColor: "#bfdbfe" },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 13, color: "#1e40af" }} />
                </IconButton>

                <Typography
                  sx={{
                    minWidth: 18,
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {qty}
                </Typography>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onIncrease(item.id);
                  }}
                  size="small"
                  sx={{
                    backgroundColor: "#dbeafe",
                    width: 26,
                    height: 26,
                    "&:hover": { backgroundColor: "#bfdbfe" },
                  }}
                >
                  <AddIcon sx={{ fontSize: 13, color: "#1e40af" }} />
                </IconButton>
              </Box>

              {/* Total */}
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: 10, color: "#888", mb: 0.2 }}>
                  Total
                </Typography>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 700, color: "#e05c3a" }}
                >
                  ₹ {Number(item.price) * qty}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// ── Main CartPage ──────────────────────────────────────────────────────────
const CartPage = ({ cartItems, setCartItems }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.error("Item removed", {
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  const handleIncrease = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item,
      ),
    );

    toast.dismiss(); // remove old toast

    toast.success("Quantity increased ➕", {
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  const handleDecrease = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && (item.qty || 1) > 1
          ? { ...item, qty: item.qty - 1 }
          : item,
      ),
    );

    toast.dismiss(); // remove old toast

    toast.success("Quantity decreased ➖", {
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  const handleEmptyCart = () => {
    setCartItems([]);
    toast.success("Cart cleared 🧹", {
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * (item.qty || 1),
    0,
  );

  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1rem", sm: "1.5rem" },
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          🛒 Your cart is empty
        </Typography>
      </Box>
    );
  }

  const currency = "INR";
  const receiptId = "qwsaq1";

  const payementHandler = async (e) => {
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + Number(item.price) * (item.qty || 1),
      0,
    );

    const res = await fetch(`${import.meta.env.VITE_API_URL}/order`, {
      method: "POST",
      body: JSON.stringify({
        amount: totalAmount * 100,
        currency,
        receipt: receiptId,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const order = await res.json();

    var options = {
      key: "rzp_test_SccIO2qO4Jepzu",
      amount: order.amount,
      currency,
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id,

      handler: async function (response) {
        const body = { ...response };
        const validateRes = await fetch(
          `${import.meta.env.VITE_API_URL}/order/validate`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          },
        );
        await validateRes.json();
      },

      prefill: {
        name: "Rishab Dakhale",
        email: "rishab@mspl.io",
        contact: "+917666938815",
      },

      notes: { address: "Razorpay Corporate Office" },
      theme: { color: "#3399cc" },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.description);
    });
    rzp1.open();
    e.preventDefault();
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: 10,
          },
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            minWidth: { xs: "unset", sm: "100%" },
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* ── HEADER ── */}
          <Box
            sx={{
              backgroundColor: "#1a2233",
              display: "flex",
              flexDirection: { xs: "row", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              px: { xs: 1.5, sm: 3 },
              py: { xs: 1.2, sm: 2 },
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 600,
                fontSize: { xs: 13, sm: 16 },
                whiteSpace: "nowrap",
              }}
            >
              🛒 Cart ({cartItems.length})
            </Typography>

            <Button
              variant="contained"
              size="small"
              startIcon={
                <DeleteOutlineIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
              }
              onClick={handleEmptyCart}
              sx={{
                backgroundColor: "#e05c3a",
                textTransform: "none",
                fontSize: { xs: 11, sm: 14 },
                px: { xs: 1.2, sm: 2 },
                py: { xs: 0.6, sm: 1 },
                borderRadius: 2,
                boxShadow: "none",
                minWidth: "unset",
                whiteSpace: "nowrap",
                "&:hover": { backgroundColor: "#c94e30", boxShadow: "none" },
              }}
            >
              Empty Cart
            </Button>
          </Box>

          {/* ── TABLE ── */}
          {isMobile ? (
            // MOBILE: compact collapsible table
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                  {["Action", "Product", "Name", "More"].map((h, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        py: 1,
                        px: i === 3 ? 0.5 : 1,
                        whiteSpace: "nowrap",
                        width: i === 3 ? 36 : "auto",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {cartItems.map((item) => (
                  <MobileRow
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            // DESKTOP: full table (unchanged)
            <Table size="small" sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                  {[
                    "Action",
                    "Product",
                    "Name",
                    "Price",
                    "Qty",
                    "Total Amount",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        py: 1.5,
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {cartItems.map((item) => {
                  const qty = item.qty || 1;
                  return (
                    <TableRow
                      key={item.id}
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      {/* DELETE */}
                      <TableCell sx={{ py: 1.5, px: 2 }}>
                        <IconButton
                          onClick={() => handleRemove(item.id)}
                          sx={{
                            backgroundColor: "#fde8e8",
                            borderRadius: 2,
                            width: 38,
                            height: 38,
                            "&:hover": { backgroundColor: "#f8d0d0" },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 20, color: "#c0392b" }} />
                        </IconButton>
                      </TableCell>

                      {/* IMAGE */}
                      <TableCell sx={{ py: 1.5, px: 2 }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: 8,
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </TableCell>

                      {/* NAME */}
                      <TableCell
                        sx={{ fontSize: 14, py: 1.5, px: 2, minWidth: 180 }}
                      >
                        {item.title}
                      </TableCell>

                      {/* PRICE */}
                      <TableCell sx={{ fontSize: 14, whiteSpace: "nowrap" }}>
                        ₹ {item.price}
                      </TableCell>

                      {/* QTY */}
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <IconButton
                            onClick={() => handleDecrease(item.id)}
                            sx={{
                              backgroundColor: "#dbeafe",
                              width: 32,
                              height: 32,
                              "&:hover": { backgroundColor: "#bfdbfe" },
                            }}
                          >
                            <RemoveIcon
                              sx={{ fontSize: 16, color: "#1e40af" }}
                            />
                          </IconButton>

                          <Typography
                            sx={{
                              minWidth: 20,
                              textAlign: "center",
                              fontSize: 14,
                            }}
                          >
                            {qty}
                          </Typography>

                          <IconButton
                            onClick={() => handleIncrease(item.id)}
                            sx={{
                              backgroundColor: "#dbeafe",
                              width: 32,
                              height: 32,
                              "&:hover": { backgroundColor: "#bfdbfe" },
                            }}
                          >
                            <AddIcon sx={{ fontSize: 16, color: "#1e40af" }} />
                          </IconButton>
                        </Box>
                      </TableCell>

                      {/* TOTAL */}
                      <TableCell
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        ₹ {Number(item.price) * qty}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* ── FOOTER ── */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: { xs: 1.5, sm: 2 },
              px: { xs: 1.5, sm: 3 },
              py: { xs: 1.5, sm: 2 },
              borderTop: "1px solid #e8e8e8",
              backgroundColor: "#fff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "row" },
                justifyContent: { xs: "space-between", sm: "flex-start" },
                gap: { xs: 0, sm: 3 },
              }}
            >
              <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>
                <b>Items:</b>{" "}
                <span style={{ color: "#e05c3a", fontWeight: 600 }}>
                  {cartItems.length}
                </span>
              </Typography>

              <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>
                <b>Total:</b>{" "}
                <span style={{ color: "#e05c3a", fontWeight: 600 }}>
                  ₹ {totalPrice}
                </span>
              </Typography>
            </Box>

            <Button
              onClick={payementHandler}
              variant="contained"
              sx={{
                backgroundColor: "#1a2233",
                textTransform: "none",
                width: { xs: "100%", sm: "auto" },
                fontSize: { xs: 13, sm: 14 },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1 },
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": { backgroundColor: "#111827", boxShadow: "none" },
              }}
            >
              Checkout
            </Button>
          </Box>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CartPage;
