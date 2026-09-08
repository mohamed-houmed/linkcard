import Examples from "@/components/home/Examples";
import FAQ from "@/components/home/FAQ";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Navbar from "@/components/home/Navbar";
import Pricing from "@/components/home/Pricing";
import TrustedCompanies from "@/components/home/TrustedCompanies";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050510]">
      <Navbar />
      <Hero />
<TrustedCompanies />
<HowItWorks />
<Features />
<Examples />
<Pricing />
<FAQ />
    </main>
  );
}