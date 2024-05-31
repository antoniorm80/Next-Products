import Navbar from "@/components/navbar";
import { Metadata } from "next";
import Items from "./components/items";
import  ShowDrawer  from "./components/show-drawer";

export const metadata: Metadata = {
  title: "Tablero",
  description: "Getiona tus productos",
};

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="md:border border-solid border-gray-300 rounded-3xl p-3 md:m-6 lg:mx-36">
        <Items />
        {/* <ShowDrawer/> */}
      </div>      
    </>
  );
};

export default Dashboard;
