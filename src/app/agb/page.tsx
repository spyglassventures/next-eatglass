import Breadcrumb from "@/components/Common/Breadcrumb";
import Agb from "@/components/AGB";
import agbPageConfig from "@/config/agbPageConfig.json";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: agbPageConfig.metadata.title,
  description: agbPageConfig.metadata.description,
  // other metadata
};

const AgbPage = () => {
  return (
    <>
      <Breadcrumb
        pageName={agbPageConfig.breadcrumb.pageName}
        description={agbPageConfig.breadcrumb.description}
      />
      <Agb
        medicalServiceName={agbPageConfig.agb.medicalServiceName}
        locationAddress={agbPageConfig.agb.locationAddress}
        validFromDate={agbPageConfig.agb.validFromDate}
        platformUrl={agbPageConfig.agb.platformUrl}
      />
    </>
  );
};

export default AgbPage;
