import { Suspense, lazy } from "react";
import HeroSection from "./HeroSection";

const FeaturesSection = lazy(() => import("./FeaturesSection"));
const TeamSection = lazy(() => import("./TeamSection"));
const SubscriptionPage = lazy(() => import("./SubscriptionPage"));
const ViedoSection = lazy(() => import("./H20Viedo"));

const SectionFallback = () => (
  <div className="w-full h-64 my-12 rounded-3xl bg-slate-100/80 animate-pulse" />
);

const Home = () => {
  return (
    <div className="relative w-full min-h-screen">
      <div
        className="absolute inset-0 -z-1"
        style={{
          background: "#ffffff",
          backgroundImage: `
        radial-gradient(
          circle at top right,
          rgba(70, 130, 180, 0.5),
          transparent 70%
        )
      `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ViedoSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TeamSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <SubscriptionPage />
      </Suspense>
    </div>
  );
};

export default Home;
