import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import contactPageConfig from "@/config/contactPageConfig.json";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: contactPageConfig.metadata.title,
  description: contactPageConfig.metadata.description,
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName={contactPageConfig.breadcrumb.pageName}
        description={contactPageConfig.breadcrumb.description}
      />

      <Contact />
    </>
  );
};

export default ContactPage;
