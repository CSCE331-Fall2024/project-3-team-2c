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
import Header from "~/app/_components/header";
import { api } from "~/trpc/react";
interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface EmployeeOptional {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
}

/**
 * EmployeesPage Component
 *
 * This component provides a user interface for managing employees in the system.
 * It supports functionality to view, add, edit, and delete employee records.
 *
 * **Key Features:**
 * - **View Employees:** Displays all employees in a table format with their `ID`, `Name`, `Email`, and `Role`.
 * - **Add Employee:** Opens a dialog to input new employee details and saves them to the backend.
 * - **Edit Employee:** Opens a dialog pre-filled with employee details for editing.
 * - **Delete Employee:** Removes an employee after confirmation.
 * - **Real-Time Updates:** Refreshes the table after every add, edit, or delete operation.
 *
 * @returns {JSX.Element} A responsive page for managing employees in the system.
 */
export default function EmployeesPage() {
  const updateMutation = api.employees.updateEmployee.useMutation();
  const addMutation = api.employees.addEmployee.useMutation();
  const deleteMutation = api.employees.deleteEmployee.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<EmployeeOptional>({});
  const { data: employees, refetch } = api.employees.getAllEmployees.useQuery();

  const fetchEmployees = async () => {
    await refetch();
  };

  const handleEdit = (employee: Employee) => {
    setFormValues(employee);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setFormValues({});
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (formValues.id) {
      const tmp = { ...formValues, id: formValues.id };
      updateMutation.mutate(tmp);
    } else {
      const tmp = {
        name: formValues.name ?? "",
        email: formValues.email ?? "",
        role: formValues.role ?? "cashier",
      };
      addMutation.mutate(tmp);
    }

    setIsDialogOpen(false);
    await fetchEmployees();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteMutation.mutate(id);
      await fetchEmployees();
    }
  };

  return (
    <>
      <Header />
      <div className="bg-white p-6">
        <h1 className="mb-4 flex justify-center text-xl font-bold">
          Manage Employees
        </h1>

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Role
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((employee) => (
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
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(employee)}
                  >
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
    </>
  );
}
