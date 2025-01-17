import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Mailer";
import mailerPageConfig from "@/config/mailerPageConfig.json";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: mailerPageConfig.metadata.title,
    description: mailerPageConfig.metadata.description,
    // other metadata
};

const MailerPage = () => {
    return (
        <>
            <Breadcrumb
                pageName={mailerPageConfig.breadcrumb.pageName}
                description={mailerPageConfig.breadcrumb.description}
            />

            <Contact />
        </>
    );
};

export default MailerPage;
