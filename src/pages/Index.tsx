import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SEO from "@/components/SEO";
import ToolsGrid from "@/components/ToolsGrid";
import FeaturesSection from "@/components/FeaturesSection";
import PrivacySection from "@/components/PrivacySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ToolsGrid />
        <FeaturesSection />
        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
