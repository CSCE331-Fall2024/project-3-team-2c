"use client";

import Header from "~/app/_components/header";
import React from "react";
import { api } from "~/trpc/react";
import { SalesBarChart } from "~/app/manager/reports/SalesBarChart";

export default function ZPage() {
  const { data: xData } = api.reports.xReport.useQuery();
  console.log("data", xData);

  return (
    <>
      <Header />
      <div className="bg-white p-6">
        <h1 className="mb-4 flex justify-center text-xl font-bold">X Report</h1>

        <SalesBarChart chartData={xData ?? []} />
      </div>
    </>
  );
}
