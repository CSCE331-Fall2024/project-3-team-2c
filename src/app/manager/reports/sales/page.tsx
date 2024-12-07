"use client";

import Header from "~/app/_components/header";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { DatePicker } from "~/app/_components/DatePicker";


const [initialStartDate, initialEndDate] = getInitialDates();
function getInitialDates() {
  const tmpDate = new Date();
  tmpDate.setHours(0, 0, 0, 0);
  tmpDate.setFullYear(2024, 12, 1);
  const startDate = new Date(tmpDate);
  tmpDate.setFullYear(2024, 12, 31);
  const endDate = new Date(tmpDate);
  return [startDate, endDate];
}

/**
 * SalesPage Component
 *
 * This component displays a sales report for a specified date range. It includes:
 * - A date range picker for users to set the start and end dates.
 * - Tables displaying the most popular sizes, mains, and sides based on the sales data.
 * - A validation message to ensure the start date is earlier than the end date.
 *
 */
export default function SalesPage() {
  const [startDate, setStartDate] = useState<Date>(new Date(initialStartDate!));
  const [endDate, setEndDate] = useState<Date>(new Date(initialEndDate!));

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
