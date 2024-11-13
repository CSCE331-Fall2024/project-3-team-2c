"use client";

import { useEffect, useState } from "react";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  // useEffect(() => {
  //   fetch("/api/employees")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("API Response:", data);
  //       setEmployees(data);
  //     })
  //     .catch((err) => console.error("Error fetching employees:", err));
  // }, []);

  return (
    <div>
      <h1>Employees</h1>
      <ul></ul>
    </div>
  );
}
