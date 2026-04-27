import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminAccessGate } from "./components/AdminAccessGate";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { JournalCreatePage } from "./pages/JournalCreatePage";
import { JournalEditPage } from "./pages/JournalEditPage";
import { JournalListPage } from "./pages/JournalListPage";
import { LeadsPage } from "./pages/LeadsPage";
import { OneTimeOrdersPage } from "./pages/OneTimeOrdersPage";
import { PortfolioCreatePage } from "./pages/PortfolioCreatePage";
import { PortfolioEditPage } from "./pages/PortfolioEditPage";
import { PortfolioListPage } from "./pages/PortfolioListPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TestimonialsPage } from "./pages/TestimonialsPage";

export default function App() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <AdminAccessGate>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="one-time-orders" element={<OneTimeOrdersPage />} />
              <Route path="portfolio" element={<PortfolioListPage />} />
              <Route path="portfolio/new" element={<PortfolioCreatePage />} />
              <Route path="portfolio/:id" element={<PortfolioEditPage />} />
              <Route path="journal" element={<JournalListPage />} />
              <Route path="journal/new" element={<JournalCreatePage />} />
              <Route path="journal/:id" element={<JournalEditPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="testimonials" element={<TestimonialsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AdminAccessGate>
      </SignedIn>
    </>
  );
}
