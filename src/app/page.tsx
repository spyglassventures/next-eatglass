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
  const modules = homePageConfig.modules ?? {};

  return (
    <>
      {(modules.ScrollUp ?? true) && <ScrollUp />}
      {(modules.Hero ?? true) && <Hero />}
      {(modules.NewsTicker ?? true) && <NewsTicker />}
      {(modules.AboutSectionTwo ?? true) && <AboutSectionTwo />}
      {(modules.Openinghours ?? true) && <Openinghours />}
      {(modules.Features ?? true) && <Features />}
      {(modules.Brands ?? true) && <Brands />}
      {(modules.AboutSectionOne ?? true) && <AboutSectionOne />}
      {(modules.Testimonials ?? true) && <Testimonials />}
      {(modules.Pricing ?? true) && <Pricing />}
      {(modules.Contact ?? true) && <Contact />}
    </>
  );
}
