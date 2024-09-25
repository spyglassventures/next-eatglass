import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";
import aboutPageContent from "@/config/aboutPageContent.json";

export const metadata: Metadata = {
  title: aboutPageContent.metadata.title,
  description: aboutPageContent.metadata.description,
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName={aboutPageContent.pageContent.Breadcrumb.pageName}
        description={aboutPageContent.pageContent.Breadcrumb.description}
      />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
