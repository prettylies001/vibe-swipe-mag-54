
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import VideosPage from "./pages/VideosPage";
import ArticlePage from "./pages/ArticlePage";
import NotFound from "./pages/NotFound";

// Create the query client
const queryClient = new QueryClient();

// Define the App component as a function component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <main className="pt-0 md:pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
