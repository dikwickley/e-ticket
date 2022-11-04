import Head from "next/head";
import Image from "next/image";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <Layout title={"Home"}>
      <div className="flex flex-col items-center justify-center font-extrabold">
        <Image src={"/small_logo.png"} alt={"logo"} width={200} height={200} />
        <div className="text-8xl lg:text-9xl">eticket</div>
        <div>BVM e-ticket system</div>
      </div>
    </Layout>
  );
}
