import HomePosters from "@/app/components/home/HomePosters";
import TodaysDeals from "@/app/components/home/TodaysDeals";
import React from "react";
import HomeHero from "../app/components/home/HomeHero";
import { getPageServer } from "../app/utils/helpers";
import Products from "@/app/components/home/products";
import HomeCategory from "@/app/components/home/HomeCategory";


const Home = ({ page }) => {
  // if (page === "admin") return <AdmainMain />;

  return (
    <>
      <HomeHero />
      <HomeCategory />
      <TodaysDeals />
      <Products />
      <HomePosters />
    </>
  );
};

export default Home;
export async function getServerSideProps(context) {
  let page;
  const { req } = context;
  if (req) {
    let host = req.headers.host;
    page = getPageServer(host) || null;
  }

  return {
    props: {
      page: page,
    },
  };
}
