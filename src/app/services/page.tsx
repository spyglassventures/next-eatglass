import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Openinghours from "@/components/About/Openinghours";
import Breadcrumb from "@/components/Common/Breadcrumb";
import servicesPageConfig from "@/config/servicesPageConfig.json";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: servicesPageConfig.metadata.title,
  description: servicesPageConfig.metadata.description,
  // other metadata
};

const ServicesPage = () => {
  const { sections } = servicesPageConfig;

  return (
    <>
      <Breadcrumb
        pageName={servicesPageConfig.breadcrumb.pageName}
        description={servicesPageConfig.breadcrumb.description}
      />
      {sections.AboutSectionOne && <AboutSectionOne />}
      {sections.AboutSectionTwo && <AboutSectionTwo />}
      {sections.Openinghours && <Openinghours />}
    </>
  );
};

export default ServicesPage;
