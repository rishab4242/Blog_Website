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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import toast from "react-hot-toast";
import Collapse from "@mui/material/Collapse";
import RemoveIconExpand from "@mui/icons-material/Remove";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";


const CartPage = ({ cartItems, setCartItems }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openRows, setOpenRows] = useState({});
  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.error("Item removed", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleIncrease = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item,
      ),
    );
    toast("Quantity increased ➕");
    toast.dismiss();
    toast("Quantity updated", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      icon: "📈",
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
    toast("Quantity decreased ➖");
    toast.dismiss();
    toast("Quantity decreased", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      icon: "📉",
    });
  };

  const handleEmptyCart = () => {
    setCartItems([]);

    toast.success("Cart cleared 🧹", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
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
        }}
      >
        <Typography variant="h5" color="text.secondary">
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
        amount: totalAmount * 100, // bcoz amount will be in razorpay like Subunits(paisa) *100 = in Rs
        currency,
        receipt: receiptId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await res.json();

    // verify the payement
    var options = {
      key: "rzp_test_SccIO2qO4Jepzu", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits.
      currency,
      name: "Acme Corp", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const body = {
          ...response,
        };

        const validateRes = await fetch(
          "${import.meta.env.VITE_API_URL}/order/validate",
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const jsonRes = await validateRes.json();
        // console.log(jsonRes);
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: "Rishab Dakhale", //your customer's name
        email: "rishab@mspl.io",
        contact: "+917666938815", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
  };

  return (
    <Box sx={{ p: 2 }}>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "none",
          border: "1px solid #e0e0e0",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#1a2233",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 1.8,
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: 16 }}>
            Cart Calculation ({cartItems.length})
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
            onClick={handleEmptyCart}
            sx={{
              backgroundColor: "#e05c3a",
              textTransform: "none",
              fontSize: 14,
              px: 2,
              py: 0.8,
              minHeight: "unset",
              borderRadius: 1.5,
              boxShadow: "none",
              "&:hover": { backgroundColor: "#c94e30", boxShadow: "none" },
            }}
          >
            Empty Cart
          </Button>
        </Box>

        {/* Table */}
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
              {["Action", "Product", "Name"].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    py: 1.5,
                    px: 2,
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  {h}
                </TableCell>
              ))}

              {/* ✅ MORE COLUMN RIGHT AFTER NAME */}
              {isMobile && (
                <TableCell
                  align="right"
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  More
                </TableCell>
              )}

              {!isMobile && (
                <>
                  {["Price", "Qty"].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        py: 1.5,
                        px: 2,
                        borderBottom: "1px solid #e8e8e8",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}

                  <TableCell
                    align="right"
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      py: 1.5,
                      px: 2,
                    }}
                  >
                    Total Amount
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {cartItems.map((item) => {
              const qty = item.qty || 1;

              return (
                <React.Fragment key={item.id}>
                  <TableRow sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    {/* DELETE */}
                    <TableCell sx={{ py: 1.2, px: 2 }}>
                      <IconButton
                        onClick={() => handleRemove(item.id)}
                        sx={{
                          backgroundColor: "#fde8e8",
                          borderRadius: 1.5,
                          width: 38,
                          height: 38,
                          "&:hover": { backgroundColor: "#f8d0d0" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 20, color: "#c0392b" }} />
                      </IconButton>
                    </TableCell>

                    {/* IMAGE */}
                    <TableCell sx={{ py: 1.2, px: 2 }}>
                      <img
                        src={`${item.image}`}
                        alt={item.title}
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 8,
                          display: "block",
                          objectFit: "cover",
                        }}
                      />
                    </TableCell>

                    {/* NAME */}
                    <TableCell
                      sx={{
                        fontSize: 14,
                        py: 1.2,
                        px: 2,
                        maxWidth: isMobile ? 120 : "auto",
                      }}
                    >
                      {item.title}
                    </TableCell>

                    {/* ✅ MORE COLUMN (MOBILE ONLY) */}
                    {isMobile && (
                      <TableCell align="right">
                        <IconButton
                          onClick={() =>
                            setOpenRows((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                          sx={{
                            backgroundColor: "#eef2ff",
                            width: 34,
                            height: 34,
                            borderRadius: 2,
                          }}
                        >
                          {openRows[item.id] ? (
                            <RemoveIcon
                              sx={{ fontSize: 20, color: "#1e40af" }}
                            />
                          ) : (
                            <AddIcon sx={{ fontSize: 20, color: "#1e40af" }} />
                          )}
                        </IconButton>
                      </TableCell>
                    )}

                    {/* DESKTOP ONLY */}
                    {!isMobile && (
                      <>
                        {/* PRICE */}
                        <TableCell sx={{ fontSize: 14, py: 1.2, px: 2 }}>
                          ₹ {item.price}
                        </TableCell>

                        {/* QTY */}
                        <TableCell sx={{ py: 1.2, px: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              onClick={() => handleDecrease(item.id)}
                              sx={{
                                backgroundColor: "#dbeafe",
                                borderRadius: 1.5,
                                width: 32,
                                height: 32,
                                "&:hover": { backgroundColor: "#bfdbfe" },
                              }}
                            >
                              <RemoveIcon
                                sx={{
                                  fontSize: 16,
                                  color: "#1e40af",
                                }}
                              />
                            </IconButton>

                            <Typography
                              sx={{
                                minWidth: 24,
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
                                borderRadius: 1.5,
                                width: 32,
                                height: 32,
                                "&:hover": { backgroundColor: "#bfdbfe" },
                              }}
                            >
                              <AddIcon
                                sx={{
                                  fontSize: 16,
                                  color: "#1e40af",
                                }}
                              />
                            </IconButton>
                          </Box>
                        </TableCell>

                        {/* TOTAL */}
                        <TableCell
                          align="right"
                          sx={{ fontSize: 14, py: 1.2, px: 2 }}
                        >
                          ₹ {Number(item.price) * qty}
                        </TableCell>
                      </>
                    )}
                  </TableRow>

                  {/* MOBILE DROPDOWN */}
                  {isMobile && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        sx={{
                          py: 0,
                          borderBottom: 0,
                        }}
                      >
                        <Collapse
                          in={openRows[item.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "#f9fafb",
                              borderRadius: 2,
                              mb: 2,
                            }}
                          >
                            {/* PRICE */}
                            <Typography sx={{ mb: 1 }}>
                              <b>Price:</b> ₹ {item.price}
                            </Typography>

                            {/* QUANTITY */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <Typography>
                                <b>Qty:</b>
                              </Typography>

                              <IconButton
                                onClick={() => handleDecrease(item.id)}
                                sx={{
                                  backgroundColor: "#dbeafe",
                                  width: 30,
                                  height: 30,
                                }}
                              >
                                <RemoveIcon
                                  sx={{
                                    fontSize: 16,
                                    color: "#1e40af",
                                  }}
                                />
                              </IconButton>

                              <Typography>{qty}</Typography>

                              <IconButton
                                onClick={() => handleIncrease(item.id)}
                                sx={{
                                  backgroundColor: "#dbeafe",
                                  width: 30,
                                  height: 30,
                                }}
                              >
                                <AddIcon
                                  sx={{
                                    fontSize: 16,
                                    color: "#1e40af",
                                  }}
                                />
                              </IconButton>
                            </Box>

                            {/* TOTAL */}
                            <Typography>
                              <b>Total:</b> ₹ {Number(item.price) * qty}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 3,
            px: 3,
            py: 1.5,
            borderTop: "1px solid #e8e8e8",
            backgroundColor: "#fff",
          }}
        >
          <Typography fontSize={14}>
            <b>Items In Cart :</b>{" "}
            <span style={{ color: "#e05c3a", fontWeight: 600 }}>
              {cartItems.length}
            </span>
          </Typography>
          <Typography fontSize={14}>
            <b>Total Price :</b>{" "}
            <span style={{ color: "#e05c3a", fontWeight: 600 }}>
              ₹ {totalPrice}
            </span>
          </Typography>
          <Button
            onClick={payementHandler}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#1a2233",
              textTransform: "none",
              fontSize: 14,
              px: 2.5,
              py: 0.9,
              borderRadius: 1.5,
              boxShadow: "none",
              "&:hover": { backgroundColor: "#111827", boxShadow: "none" },
            }}
          >
            Checkout
          </Button>
        </Box>
      </TableContainer>
    </Box>
  );
};

export default CartPage;
