import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Openinghours from "@/components/About/Openinghours";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import NewsTicker from "@/components/Hero/NewsTicker";

import AboutSectionOne from "@/components/About/AboutSectionOne";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";

import Contact from "@/components/Contact";
import homePageConfig from "@/config/homePageConfig.json";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: homePageConfig.metadata.title,
  description: homePageConfig.metadata.description,
  // other metadata
};

export default function Home() {
  const { modules } = homePageConfig;

  return (
    <>
      {modules.ScrollUp && <ScrollUp />}
      {modules.Hero && <Hero />}
      {modules.NewsTicker && <NewsTicker />}
      {modules.AboutSectionTwo && <AboutSectionTwo />}
      {modules.Openinghours && <Openinghours />}
      {modules.Features && <Features />}

      {modules.Brands && <Brands />}
      {modules.AboutSectionOne && <AboutSectionOne />}
      {modules.Testimonials && <Testimonials />}
      {modules.Pricing && <Pricing />}

      {modules.Contact && <Contact />}
    </>
  );
}
