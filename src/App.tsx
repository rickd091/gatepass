import { Suspense, useEffect } from "react";
import { startReminderWorker } from "@/lib/reminder-worker";
import { AssetRequestProvider } from "./contexts/AssetRequestContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { Toaster } from "@/components/ui/toaster";
import { ExchangeLoginForm } from "@/components/auth/ExchangeLoginForm";

function App() {
  useEffect(() => {
    startReminderWorker();
  }, []);

  return (
    <AssetRequestProvider>
      <NotificationProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <div className="min-h-screen bg-background">
            <ExchangeLoginForm />
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Toaster />
          </div>
        </Suspense>
      </NotificationProvider>
    </AssetRequestProvider>
  );
}

export default App;
