import React, { useState, useEffect } from "react";
import "../../../assets/styles/admin/accounts/configurations/invoiceConfigurationAllocate.css";

const InvoiceConfigurationAllocate = () => {
  const [defaultTemplate, setDefaultTemplate] = useState("");
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "SAIFUL ISLAM",
      studentId: "2514010030063",
      section: "1st Year",
      roll: "1202526033046",
      category: "",
      prevTemplate: "",
      template: "", // Empty initially
    },
    {
      id: 2,
      name: "MD. NASIMUL ISLAM RADOAN",
      studentId: "2514010030064",
      section: "1st Year",
      roll: "1202526033047",
      category: "",
      prevTemplate: "",
      template: "",
    },
    {
      id: 3,
      name: "MD. MAHARAB HOSSEN",
      studentId: "2514010030065",
      section: "1st Year",
      roll: "1202526033048",
      category: "",
      prevTemplate: "",
      template: "",
    },
  ]);

  const templateOptions = [
    "HSC Admission Fee ..( HSC-Science - 2025-2026 )",
    "HSC Exam Fee ..( HSC-Science - 2025-2026 )",
    "Library Fee ..( HSC-Science - 2025-2026 )",
  ];

  // Handle default template change
  const handleDefaultTemplateChange = (e) => {
    const newDefault = e.target.value;
    setDefaultTemplate(newDefault);

    // Update students who haven't selected a template manually
    const updatedStudents = students.map((s) =>
      !s.template ? { ...s, template: newDefault } : s
    );
    setStudents(updatedStudents);
  };

  // Handle individual student template change
  const handleStudentTemplateChange = (id, value) => {
    const updatedStudents = students.map((s) =>
      s.id === id ? { ...s, template: value } : s
    );
    setStudents(updatedStudents);
  };

  // Save button click handler
  const handleSave = () => {
    const savedData = students.map((s) => ({
      id: s.id,
      name: s.name,
      selectedTemplate: s.template,
    }));
    console.log("Saved Data:", savedData);
    alert("Templates saved! Check console for saved data.");
  };

  return (
    <div className="invoice-allocate-page">
      <div className="breadcrumb">
        Dashboard / Accounts / Templates / Invoice Configuration
      </div>

      <div className="page-header">
        <h2>Student Fee Allocations (Class: HSC-Science, Session: 2025-2026)</h2>
      </div>

      {/* Default Template Selection */}
      <div className="default-template">
        <label htmlFor="defaultTemplate">
          <strong>Default Template:</strong>
        </label>
        <select
          id="defaultTemplate"
          name="defaultTemplate"
          value={defaultTemplate}
          onChange={handleDefaultTemplateChange}
        >
          <option value="">Select Default Template</option>
          {templateOptions.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Student Table */}
      <div className="student-table">
        <table>
          <thead>
            <tr>
              <th>Sl</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Section</th>
              <th>Roll</th>
              <th>Category</th>
              <th>Prev Template</th>
              <th>Template Name</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <tr key={s.id}>
                <td>{index + 1}</td>
                <td>{s.name}</td>
                <td>{s.studentId}</td>
                <td>{s.section}</td>
                <td>{s.roll}</td>
                <td>{s.category}</td>
                <td>{s.prevTemplate}</td>
                <td>
                  <select
                    value={s.template || ""}
                    onChange={(e) =>
                      handleStudentTemplateChange(s.id, e.target.value)
                    }
                  >
                    <option value="">Select Template</option>
                    {templateOptions.map((t, i) => (
                      <option key={i} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: "20px" }}>
        <button className="allocate-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default InvoiceConfigurationAllocate;
