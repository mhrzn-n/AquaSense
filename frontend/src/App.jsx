import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import PublicLayout from "./components/PublicLayout";
import Loading from "./components/Loading";
import { lazy, Suspense } from "react";


const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const FeaturesSection = lazy(() => import("./pages/FeaturesSection"));
const DemoSection = lazy(() => import("./pages/DemoSection"));
const TeamSection = lazy(() => import("./pages/TeamSection"));
const GallerySection = lazy(() => import("./pages/GallerySection"));
const ContactSection = lazy(() => import("./pages/ContactSection"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));

const DashboardLayout = lazy(() => import("./pages/Dashboard/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Alerts = lazy(() => import("./pages/Dashboard/Alerts"));

const Analytics = lazy(() => import("./pages/Dashboard/Analytics"));
const Reports = lazy(() => import("./pages/Dashboard/Reports"));
const Settings = lazy(() => import("./pages/Dashboard/Settings"));


const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <main className="grow">
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full py-16 text-sm text-gray-500">
                <Loading />
              </div>
            }
          >
            <Routes>
              {/* Public routes */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <PublicLayout />
                  </PublicRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="features" element={<FeaturesSection />} />
                <Route path="subscription" element={<SubscriptionPage />} />
                <Route path="demo" element={<DemoSection />} />
                <Route path="team" element={<TeamSection />} />
                <Route path="gallery" element={<GallerySection />} />
                <Route path="contact" element={<ContactSection />} />
                <Route path="signin" element={<Signin />} />
                <Route path="signup" element={<Signup />} />
              </Route>

              {/* Protected routes */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="subscription" element={<SubscriptionPage />} />
              </Route>
            </Routes>
          </Suspense>
        </main>
      </Router>
    </div>
  );
};

export default App;

