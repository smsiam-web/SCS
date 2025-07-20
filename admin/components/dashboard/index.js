import React, { useEffect } from "react";
import PriceOverview from "./PriceOverview";
import OrderOverview from "./OrderOverview";
import Percentage from "./Percentage";
import OrderTable from "../placeOrder/OrderTable";
import LineChart from "./LineChart";

const DashBoard = () => {
  return (
    <main className="h-full overflow-y-auto">
      <div className=" grid mx-auto">
        <h1 className="mb-3 text-lg font-bold text-gray-700 ">
          Dashboard Overview
        </h1>
        <div className="w-full">
          <PriceOverview />
        </div>
        <div className="w-full">
          <OrderOverview />
        </div>
        <div className="grid gap-4 md:grid-cols-2 my-4">
          <LineChart />
          <Percentage />
        </div>
        <div className="py-6 w-full ">
            <h2 className="text-title pb-3 font-medium text-lg md:text-xl">Recent Order</h2>
          <OrderTable />
          </div>
      </div>
    </main>
  );
};

export default DashBoard;
