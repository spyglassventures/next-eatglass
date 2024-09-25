import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Interner Bereich - Login erforderlich",
  description: "Hier finden Sie praxisinterne Dokumente und Tools",
  // other metadata
};

export default async function DownloadPage() {
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated();
  if (!isLoggedIn) {
    redirect("/api/auth/login");
  }

  return (
    <>
      <Breadcrumb
        pageName="Interner Bereich"
        description="Hier sind die wichtigsten internen Tools und Dokumente."
      />
      <ClientPage />
    </>
  );
}
