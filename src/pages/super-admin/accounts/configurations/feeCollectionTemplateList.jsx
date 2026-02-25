import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaTimes } from "react-icons/fa";
import "../../../assets/styles/admin/accounts/configurations/feeCollectionTemplateList.css";

const FeeCollectionTemplateList = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Test HSC Admission 25-26 template",
      transactionType: "Income",
      duration: "June, 2025 — December, 2025",
      active: true,
    },
    {
      id: 2,
      name: "HSC Admission Fee ( HSC-Science - 2025-2026 ) Demo",
      transactionType: "Income",
      duration: "September, 2025 — September, 2025",
      active: false,
    },
    {
      id: 3,
      name: "HSC Admission Fee ..( HSC-Science - 2025-2026 )",
      transactionType: "Income",
      duration: "July, 2025 — June, 2026",
      active: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  // Handle View/Edit/Delete
  const handleView = (id) => alert(`Viewing template ${id}`);
  const handleEdit = (id) => alert(`Editing template ${id}`);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      alert(`Deleted template ${id}`);
    }
  };

  // Toggle Active/Inactive with 5 sec delay
  const toggleActive = (id) => {
    setTimeout(() => {
      setTemplates(prev =>
        prev.map(t =>
          t.id === id ? { ...t, active: !t.active } : t
        )
      );
      alert(`Template ${id} status changed!`);
    }, 5000);
  };

  // Top buttons
  const handleImport = () => setShowModal(true);
  const handleCreate = () => alert("Create new template clicked!");

  const handleSelectTemplate = (template) => {
    alert(`Selected template: ${template.name}`);
    setShowModal(false);
  };

  return (
    <div className="fee-template-list-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        Dashboard / Accounts / Fee Collection Templates / Template List
      </div>

      {/* Header with top buttons */}
      <div className="page-header">
        <h2>Fee Collection Template List</h2>
        <p>Department: Science, Class: HSC-Science, Session: 2025-2026</p>
        <div className="top-buttons">
          <button className="create-btn" onClick={handleImport}>Import from Existing</button>
          <button className="create-btn" onClick={handleCreate}>Create Template</button>
        </div>
      </div>

      {/* Template Table */}
      <div className="template-table">
        <table>
          <thead>
            <tr>
              <th>Sl</th>
              <th>Template Name</th>
              <th>Transaction Type</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t, index) => (
              <tr key={t.id}>
                <td>{index + 1}</td>
                <td>{t.name}</td>
                <td>{t.transactionType}</td>
                <td>{t.duration}</td>
                <td>
                  <button className="status-btn" onClick={() => toggleActive(t.id)}>
                    {t.active ? <FaToggleOn color="green" size={20}/> : <FaToggleOff color="gray" size={20}/>}
                  </button>
                </td>
                <td className="action-btns">
                  <button className="icon-btn view" onClick={() => handleView(t.id)}><FaEye /></button>
                  <button className="icon-btn edit" onClick={() => handleEdit(t.id)}><FaEdit /></button>
                  <button className="icon-btn delete" onClick={() => handleDelete(t.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Select Template to Import</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <ul className="modal-template-list">
                {templates.map(t => (
                  <li key={t.id}>
                    <span>{t.name}</span>
                    <button className="select-btn" onClick={() => handleSelectTemplate(t)}>Select</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeCollectionTemplateList;
