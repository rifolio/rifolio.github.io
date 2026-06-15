import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner.jsx";
import Home from "@/components/pages/Home.jsx";
import Blog from "@/components/pages/Blog.jsx";
import BlogPost from "@/components/pages/BlogPost.jsx";
import NotFound from "@/components/pages/NotFound.jsx";
import LoadingScreen from "@/components/layout/LoadingScreen.jsx";
import ScrollToHash from "@/components/layout/ScrollToHash.jsx";

export default function App() {
  return (
    <>
      <ScrollToHash />
      <LoadingScreen />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="bottom-right" />
    </>
  );
}
