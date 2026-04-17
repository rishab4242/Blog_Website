import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllBlogs from "./pages/AllBlogs";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import ViewBlogs from "./pages/ViewBlogs";
import SearchBlogs from "./pages/SearchBlogs";
import Navbar from "./components/Navbar";
import SignupForm from "./pages/SignupForm";
import LoginForm from "./pages/LoginForm";
import CartPage from "./pages/CartPage";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

 

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route
          path="/blogs"
          element={<AllBlogs setCartItems={setCartItems} />}
        />
        <Route path="/blogs/search/:query" element={<SearchBlogs />} />
        <Route path="/blogs/create" element={<CreateBlog />} />
        <Route path="/blogs/:id" element={<EditBlog />} />
        <Route path="/blogs/:id/view" element={<ViewBlogs />} />
        <Route path="/blogs/signup" element={<SignupForm />} />
        <Route path="/blogs/login" element={<LoginForm />} />
        <Route
          path="/blogs/add_to_cart"
          element={
            <CartPage cartItems={cartItems} setCartItems={setCartItems} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
