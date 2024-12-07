"use client";

import Header from "~/app/_components/header";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/app/_components/DatePicker";

export default function XPage() {
  const [startDate, setStartDate] = useState<Date>(new Date("2021-01-01"));
  const [endDate, setEndDate] = useState<Date>(new Date("2025-01-01"));
  const { data: salesData } = api.reports.salesReport.useQuery({
    startDate: startDate,
    endDate: endDate,
  });
  console.log("sizes", salesData?.popularSizes.at(0));
  return (
    <>
      <Header />
      <div className="bg-white p-6">
        <h1 className="mb-4 flex justify-center text-xl font-bold">
          Sales Report
        </h1>

        {/*Date Range*/}
        <div className="justify-center">
          <div className="mb-4 flex justify-center">
            {/*Start Date*/}
            <div>
              <label className="mb-2 block">Start Date</label>
              <DatePicker
                dateValue={startDate}
                setDateFunction={setStartDate}
              />
            </div>

            {/*End Date*/}
            <div>
              <label className="mb-2 block">End Date</label>
              <DatePicker dateValue={endDate} setDateFunction={setEndDate} />
            </div>
          </div>
          {/*Error Message*/}
          {startDate > endDate && (
            <div className="flex justify-center text-red-500">
              Start date must be before end date
            </div>
          )}
        </div>
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