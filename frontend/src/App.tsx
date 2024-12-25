import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { BlogsList } from "./pages/BlogsList";
import React, { Suspense, useEffect } from "react";
import { CreateBlog } from "./pages/CreateBlog";
const Blog = React.lazy(() => import("./pages/Blog"));

export const SERVER_URL = "";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavigateToSignupByDefault />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blogs" element={<BlogsList />} />
          <Route path="/blog/create" element={<CreateBlog />} />
          <Route
            path="/blogs/blog/:id"
            element={
              <Suspense fallback={"loading"}>
                <Blog />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const NavigateToSignupByDefault = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === "/") navigate("/signup");
  }, []);
  return <div></div>;
};

export default App;
