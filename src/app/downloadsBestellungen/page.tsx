import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";


import DownloadsBestellungen from "@/components/DownloadsBestellungen/";




import Breadcrumb from "@/components/Common/Breadcrumb";
import downloadsBestellungenConfig from "@/config/downloadsBestellungenConfig.json";


import { Metadata } from "next";

export const metadata: Metadata = {
  title: downloadsBestellungenConfig.metadata.title,
  description: downloadsBestellungenConfig.metadata.description,
  // other metadata
};

const DownloadPage = () => {
  const { sections } = downloadsBestellungenConfig;

  return (
    <>
      <Breadcrumb
        pageName={downloadsBestellungenConfig.breadcrumb.pageName}
        description={downloadsBestellungenConfig.breadcrumb.description}
      />
      <DownloadsBestellungen />



      {sections.AboutSectionOne && <AboutSectionOne />}
      {sections.AboutSectionTwo && <AboutSectionTwo />}

    </>
  );
};

export default DownloadPage;
