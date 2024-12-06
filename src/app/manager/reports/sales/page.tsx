"use client";

import Header from "~/app/_components/header";
import React from "react";
import { api } from "~/trpc/react";

export default function SalesPage() {
  const { data: salesData, refetch } = api.reports.salesReport.useQuery({
    startDate: new Date("2021-01-01"),
    endDate: new Date("2025-01-01"),
  });
  console.log("sizes", salesData?.popularSizes.at(0));
  return (
    <>
      <Header />
      <div className="bg-white p-6">
        <h1 className="mb-4 flex justify-center text-xl font-bold">
          Sales Report
        </h1>

        {/*Sizes*/}
        <div>
          <h2 className="justify-left mb-4 flex text-xl font-bold">
            Most Popular Sizes
          </h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Quantity Sold
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                {/*<th className="border border-gray-300 px-4 py-2 text-left">*/}
                {/*  Type*/}
                {/*</th>*/}
              </tr>
            </thead>
            <tbody>
              {salesData?.popularSizes?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.name}
                  </td>
                  {/*<td className="border border-gray-300 px-4 py-2">*/}
                  {/*  {item.type}*/}
                  {/*</td>*/}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*Mains*/}
        <div>
          <h2 className="justify-left mb-4 flex text-xl font-bold">
            Most Popular Mains
          </h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Quantity Sold
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                {/*<th className="border border-gray-300 px-4 py-2 text-left">*/}
                {/*  Type*/}
                {/*</th>*/}
              </tr>
            </thead>
            <tbody>
              {salesData?.popularMains?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.name}
                  </td>
                  {/*<td className="border border-gray-300 px-4 py-2">*/}
                  {/*  {item.type}*/}
                  {/*</td>*/}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*Sides*/}
        <div>
          <h2 className="justify-left mb-4 flex text-xl font-bold">
            Most Popular Sides
          </h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Quantity Sold
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                {/*<th className="border border-gray-300 px-4 py-2 text-left">*/}
                {/*  Type*/}
                {/*</th>*/}
              </tr>
            </thead>
            <tbody>
              {salesData?.popularSides?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.name}
                  </td>
                  {/*<td className="border border-gray-300 px-4 py-2">*/}
                  {/*  {item.type}*/}
                  {/*</td>*/}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
