"use client";

import Header from "~/app/_components/header";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/app/_components/DatePicker";
import { SalesBarChart } from "~/app/manager/reports/SalesBarChart";

export default function ZPage() {
  const { data: zData } = api.reports.zReport.useQuery();
  console.log("data", zData);

  return (
    <>
      <Header />
      <div className="bg-white p-6">
        <h1 className="mb-4 flex justify-center text-xl font-bold">Z Report</h1>

        <SalesBarChart chartData={zData ?? []} />
      </div>
    </>
  );
}
