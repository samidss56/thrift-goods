import Toaster from "@/components/ui/Toaster";
import { Lato } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../Navbar";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { ToasterContext } from "@/contexts/ToasterContext";
import { ToasterType } from "@/types/toaster.type";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const disableNavbar = ["auth", "admin", "member"];

type Proptypes = {
  children: React.ReactNode;
};


const AppShell = (props: Proptypes) => {
  const { children } = props;
  const { toaster }: ToasterType = useContext(ToasterContext);
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </Head>
      <div className={lato.className}>
        {!disableNavbar.includes(pathname.split("/")[1]) && <Navbar />}
        {children}
        {Object.keys(toaster).length > 0 && <Toaster />}
      </div>
    </>
  );
};

export default AppShell;
