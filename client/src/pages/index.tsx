import type { ReactElement } from "react";
import { Layout } from "app/components/layout";
// import NestedLayout from '../components/nested-layout'
import type { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  return <p>hello world</p>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  console.log("index");
  return <Layout>{page}</Layout>;
};

export default Page;
