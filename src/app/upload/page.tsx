
//import Recorder from "../../components/Recorder"
import Breadcrumb from "@/components/Common/Breadcrumb";
import Recorder from "../../components/Recorder/Recorder"

import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Uebermitteln Sie uns Ihre Sprachaufnahme oder Teilen Sie Dokumente mit uns]",
  description: "Hier finden Sie Medien hochladen.",
  // other metadata
};

const UploadPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Audiouebermittlung"
        description="Hier koennen Sie Ihre Sprachnachricht oder andere Doumente mit uns teilen."
      />
      <Recorder />

    </>
  );
};

export default UploadPage;

