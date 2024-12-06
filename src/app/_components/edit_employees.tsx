import { useState } from "react";

interface Employee {
  id: number;
  name: string;
  hours: number;
}


/**
 * EditEmployees Component
 * 
 * This component allows users to manage a list of employees. Users can:
 * 
 * - View all employees with their names and hours.
 * - Edit an employee's hours.
 * - Delete an employee from the list.
 * - Add a new employee by specifying their name and hours.
 * 
 * @returns {JSX.Element} The rendered EditEmployees component.
 */
const EditEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "Eric Liu", hours: 10 },
    { id: 2, name: "Vincent Nguyen", hours: 20 },
    { id: 3, name: "Jonathan Herrera", hours: 30 },
  ]);

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: 0,
    name: "",
    hours: 0,
  });

  const handleInputChange = (
    field: keyof Employee,
    value: string | number,
    isNew = false,
  ) => {
    if (isNew) {
      setNewEmployee({ ...newEmployee, [field]: value });
    } else if (editingEmployee) {
      setEditingEmployee({ ...editingEmployee, [field]: value });
    }
  };

  const handleSave = () => {
    if (editingEmployee) {
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === editingEmployee.id ? editingEmployee : emp,
        ),
      );
      setEditingEmployee(null);
      alert("Employee data saved successfully!");
    }
  };

  const handleDelete = (id: number) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((emp) => emp.id !== id),
    );
  };

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.hours >= 0) {
      setEmployees((prevEmployees) => [
        ...prevEmployees,
        { ...newEmployee, id: Date.now() },
      ]);
      setNewEmployee({ id: 0, name: "", hours: 0 });
      alert("New employee added successfully!");
    } else {
      alert("Please provide a name and valid hours for the new employee.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Employee Management</h1>

      <ul>
        {employees.map((employee) => (
          <li key={employee.id} style={{ marginBottom: "10px" }}>
            <span>
              {employee.name} - Hours: {employee.hours}
            </span>
            <button
              onClick={() => setEditingEmployee(employee)}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(employee.id)}
              style={{ marginLeft: "10px", padding: "5px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {editingEmployee && (
        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #ddd",
            paddingTop: "10px",
          }}
        >
          <h2>Edit Employee</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>Name:</label>
            <input
              type="text"
              value={editingEmployee.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Hours:</label>
            <input
              type="number"
              value={editingEmployee.hours}
              onChange={(e) =>
                handleInputChange("hours", Number(e.target.value))
              }
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <button
            onClick={handleSave}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Save
          </button>
          <button
            onClick={() => setEditingEmployee(null)}
            style={{
              padding: "10px 20px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          borderTop: "1px solid #ddd",
          paddingTop: "10px",
        }}
      >
        <h2>Add New Employee</h2>
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <input
            type="text"
            value={newEmployee.name}
            onChange={(e) => handleInputChange("name", e.target.value, true)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>Hours:</label>
          <input
            type="number"
            value={newEmployee.hours}
            onChange={(e) =>
              handleInputChange("hours", Number(e.target.value), true)
            }
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          onClick={handleAddEmployee}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Add Employee
        </button>
      </div>
    </div>
  );
};

export default EditEmployees;
