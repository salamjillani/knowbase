import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SearchInformation } from "@/pages/SearchInformation";
import { DataList } from "@/pages/DataList";
import { HotTopics } from "@/pages/HotTopics";
import { NotFound } from "@/pages/NotFound";
import { AuthModal } from "@/components/AuthModal";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { FAQ } from "@/components/FAQ";
import Index from "./pages/Index";

const ProtectedRoute = ({ children }) => {
  const  isAuthenticated  = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search-information" element={<ProtectedRoute><SearchInformation /></ProtectedRoute>} />
            <Route path="/data-list" element={<ProtectedRoute><DataList /></ProtectedRoute>} />
            <Route path="/hot-topics" element={<ProtectedRoute><HotTopics /></ProtectedRoute>} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AuthModal
            isOpen={false}
            onClose={() => {}}
            mode="login"
            onModeChange={() => {}}
          />
          <Toaster />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}