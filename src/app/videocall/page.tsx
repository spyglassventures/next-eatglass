import Videocall from "@/components/Videocall/videocall"; // Corrected import statement
import Breadcrumb from "@/components/Common/Breadcrumb";
import videocallConfig from "@/config/videocallConfig.json"; // Uncommented and corrected

import { Metadata } from "next";

export const metadata: Metadata = {
  title: videocallConfig.metadata.title,
  description: videocallConfig.metadata.description,
  // other metadata
};

const VideocallPage = () => {
  return (
    <>
      <Breadcrumb
        pageName={videocallConfig.pageContent.Breadcrumb.pageName}
        description={videocallConfig.pageContent.Breadcrumb.description}
      />
      <Videocall /> {/* Corrected component name */}
    </>
  );
};

export default VideocallPage;
