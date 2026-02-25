import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import "../../../assets/styles/admin/accounts/configurations/feeCollectionTemplateAllocations.css";

const FeeCollectionTemplateAllocations = () => {
  const navigate = useNavigate(); // initialize navigate

  const [students] = useState([
    {
      id: 1,
      name: "SAIFUL ISLAM",
      studentId: "2514010030063",
      regNo: "2210607239",
      section: "1st Year",
      roll: "1202526033046",
      category: "",
      preTemplate: "",
      template: "HSC Admission Fee ..( HSC-Science - 2025-2026 )",
    },
    {
      id: 2,
      name: "MD. NASIMUL ISLAM RADOAN",
      studentId: "2514010030064",
      regNo: "2210662472",
      section: "1st Year",
      roll: "1202526033047",
      category: "",
      preTemplate: "",
      template: "HSC Admission Fee ..( HSC-Science - 2025-2026 )",
    },
    {
      id: 3,
      name: "MD. MAHARAB HOSSEN",
      studentId: "2514010030065",
      regNo: "2210608416",
      section: "1st Year",
      roll: "1202526033048",
      category: "",
      preTemplate: "",
      template: "HSC Admission Fee ..( HSC-Science - 2025-2026 )",
    },
  ]);

  // Navigate to InvoiceConfigurationAllocate page
  const handleAllocate = () => {
    navigate("/feeCollectionTemplate/allocate"); // your route path
  };

  return (
    <div className="fee-allocation-page">
      <div className="breadcrumb">
        Dashboard / Accounts / Fee Collection / Template Allocations
      </div>

      <div className="page-header">
        <h2>Student Fee Allocations (Class: HSC-Science)</h2>
      </div>

      {/* Allocate Button */}
      <div className="allocate-btn-container">
        <button className="allocate-btn" onClick={handleAllocate}>
          Allocate
        </button>
      </div>

      {/* Campus Info Table */}
      <div className="campus-table">
        <table>
          <tbody>
            <tr>
              <td><strong>Campus</strong></td>
              <td>Mohammadpur Kendriya College</td>
              <td><strong>Shift</strong></td>
              <td>Day</td>
              <td><strong>Medium</strong></td>
              <td>Bangla</td>
            </tr>
            <tr>
              <td><strong>Class</strong></td>
              <td>HSC-Science</td>
              <td><strong>Session</strong></td>
              <td>2025-2026</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Student Allocation Table */}
      <div className="allocation-table">
        <table>
          <thead>
            <tr>
              <th>Sl</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Reg. No</th>
              <th>Section</th>
              <th>Roll</th>
              <th>Category</th>
              <th>Pre-Template Name</th>
              <th>Template Name</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <tr key={s.id}>
                <td>{index + 1}</td>
                <td>{s.name}</td>
                <td>{s.studentId}</td>
                <td>{s.regNo}</td>
                <td>{s.section}</td>
                <td>{s.roll}</td>
                <td>{s.category}</td>
                <td>{s.preTemplate}</td>
                <td className="template-name">{s.template}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeCollectionTemplateAllocations;
