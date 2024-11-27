"use client";

import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    id: null,
    name: "",
    email: "",
    role: "",
  });

  const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  };

  const handleEdit = (employee) => {
    setFormValues(employee);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setFormValues({ id: null, name: "", email: "", role: "" });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (formValues.id) {
      await fetch("/api/employees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
    } else {
      const { id, ...newEmployee } = formValues;
      await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
    }

    setIsDialogOpen(false);
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      const response = await fetch(`/api/employees`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchEmployees();
      } else {
        console.error("Failed to delete employee");
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">Manage Employees</h1>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Email
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {employee.id}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {employee.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {employee.email}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {employee.role}
              </td>
              <td className="flex gap-2 border border-gray-300 px-4 py-2">
                <Button variant="outline" onClick={() => handleEdit(employee)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(employee.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button className="mt-4" onClick={handleAdd}>
        Add Employee
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formValues.id ? "Edit Employee" : "Add Employee"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={formValues.name}
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues({ ...formValues, email: e.target.value })
              }
            />
            <Input
              placeholder="Role"
              value={formValues.role}
              onChange={(e) =>
                setFormValues({ ...formValues, role: e.target.value })
              }
            />
          </div>
          <Button className="mt-4" onClick={handleSave}>
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
