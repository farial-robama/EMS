import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import '@/assets/styles/admin/globalConfigurations/instituteSetup/ClassSetup.css';

const ClassSetup = () => {
  // ---------------- Dummy Data ----------------
  const dummyShifts = [
    { id: 1, shift_name: 'Morning', status: 'Active' },
    { id: 2, shift_name: 'Evening', status: 'Active' },
  ];

  const dummyMediums = [
    { id: 1, shift_id: 1, name: 'Bangla', status: 'Active' },
    { id: 2, shift_id: 1, name: 'English', status: 'Active' },
    { id: 3, shift_id: 2, name: 'English', status: 'Active' },
  ];

  const dummyEducationLevels = [
    { id: 1, shift_id: 1, medium_id: 1, title: 'Primary', status: 'Active' },
    { id: 2, shift_id: 1, medium_id: 2, title: 'Secondary', status: 'Active' },
  ];

  const dummyDepartments = [
    {
      id: 1,
      shift_id: 1,
      medium_id: 1,
      education_level_id: 1,
      title: 'Science',
    },
    { id: 2, shift_id: 1, medium_id: 2, education_level_id: 2, title: 'Math' },
  ];

  // ---------------- States ----------------
  const [classes, setClasses] = useState([]);
  const [shifts] = useState(dummyShifts);
  const [allMediums] = useState(dummyMediums);
  const [mediums, setMediums] = useState([]);
  const [educationLevels] = useState(dummyEducationLevels);
  const [filteredEducationLevels, setFilteredEducationLevels] = useState([]);
  const [departments] = useState(dummyDepartments);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('0001');

  const [formData, setFormData] = useState({
    shift: '',
    medium: '',
    edu_level: '',
    department: '',
    class_name: '',
    class_code: '',
    ordering: '',
    roll_identifier: '',
    status: 'Active',
  });

  // ---------------- Cascading Filters ----------------
  useEffect(() => {
    if (!formData.shift) return setMediums([]);
    setMediums(
      allMediums.filter(
        (m) => m.shift_id === Number(formData.shift) && m.status === 'Active'
      )
    );
    setFormData((prev) => ({
      ...prev,
      medium: '',
      edu_level: '',
      department: '',
    }));
    setFilteredEducationLevels([]);
    setFilteredDepartments([]);
  }, [formData.shift, allMediums]);

  useEffect(() => {
    if (!formData.medium) return setFilteredEducationLevels([]);
    setFilteredEducationLevels(
      educationLevels.filter(
        (e) =>
          e.shift_id === Number(formData.shift) &&
          e.medium_id === Number(formData.medium)
      )
    );
    setFormData((prev) => ({ ...prev, edu_level: '', department: '' }));
    setFilteredDepartments([]);
  }, [formData.medium, formData.shift, educationLevels]);

  useEffect(() => {
    if (!formData.edu_level) return setFilteredDepartments([]);
    setFilteredDepartments(
      departments.filter(
        (d) =>
          d.shift_id === Number(formData.shift) &&
          d.medium_id === Number(formData.medium) &&
          d.education_level_id === Number(formData.edu_level)
      )
    );
    setFormData((prev) => ({ ...prev, department: '' }));
  }, [formData.edu_level, formData.shift, formData.medium, departments]);

  // ---------------- Handlers ----------------
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.shift ||
      !formData.medium ||
      !formData.edu_level ||
      !formData.department ||
      !formData.class_name ||
      !formData.roll_identifier
    ) {
      alert('Fill all required fields!');
      return;
    }

    if (editId) {
      setClasses((prev) =>
        prev.map((c) => (c.id === editId ? { ...formData, id: editId } : c))
      );
    } else {
      const newId = classes.length
        ? Math.max(...classes.map((c) => c.id)) + 1
        : 1;
      setClasses((prev) => [
        ...prev,
        { ...formData, id: newId, class_code: generatedCode },
      ]);
      setGeneratedCode((Number(generatedCode) + 1).toString().padStart(4, '0'));
    }

    setEditId(null);
    setFormData({
      shift: '',
      medium: '',
      edu_level: '',
      department: '',
      class_name: '',
      class_code: '',
      ordering: '',
      roll_identifier: '',
      status: 'Active',
    });
  };

  const handleEdit = (cls) => {
    setFormData(cls);
    setEditId(cls.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---------------- Helpers ----------------
  const getName = (arr, id, key) =>
    arr.find((x) => x.id === Number(id))?.[key] || '-';

  // ---------------- UI ----------------
  return (
    <div className="main-content">
      <div className="breadcrumb">
        <a>Dashboard</a> <span>›</span>
        <a>Global Configuration</a> <span>›</span>
        Class Setup
      </div>

      {/* ===== FORM ===== */}
      <section className="section">
        <h3>{editId ? 'Edit Class' : 'Add Class'}</h3>

        <form className="form-layout" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>
                Shift Name <span className="required">*</span>
              </label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
              >
                <option value="">Select Shift</option>
                {shifts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shift_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Medium Name<span className="required">*</span>
              </label>
              <select
                name="medium"
                value={formData.medium}
                onChange={handleChange}
              >
                <option value="">Select Medium</option>
                {mediums.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Education Level Name<span className="required">*</span>
              </label>
              <select
                name="edu_level"
                value={formData.edu_level}
                onChange={handleChange}
              >
                <option value="">Select Education Level</option>
                {filteredEducationLevels.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Department Name<span className="required">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {filteredDepartments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Class Name <span className="required">*</span>
              </label>
              <input
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                placeholder="Enter Class Name"
              />
            </div>

            <div className="form-group">
              <label>Class Code</label>
              <input
                value={editId ? formData.class_code : generatedCode}
                readOnly
                placeholder="Class Code"
              />
            </div>

            <div className="form-group">
              <label>
                Roll Identifier <span className="required">*</span>
              </label>
              <input
                name="roll_identifier"
                value={formData.roll_identifier}
                onChange={handleChange}
                placeholder="Enter Roll Identifier"
              />
            </div>

            <div className="form-group">
              <label>Ordering</label>
              <input
                name="ordering"
                value={formData.ordering}
                onChange={handleChange}
                placeholder="Enter Order Number"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <button className="btn-submit">{editId ? 'Update' : 'Save'}</button>
        </form>
      </section>

      {/* ===== TABLE ===== */}
      <section className="section">
        <h3>Class List</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Campus Name</th>
              <th>Shift Name</th>
              <th>Medium Namne</th>
              <th>Education Level</th>
              <th>Department Name</th>
              <th>Class Name</th>
              <th>Class Code</th>
              <th>Roll</th>
              <th>Order</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td></td>
                <td>{getName(shifts, c.shift, 'shift_name')}</td>
                <td>{getName(allMediums, c.medium, 'name')}</td>
                <td>{getName(educationLevels, c.edu_level, 'title')}</td>
                <td>{getName(departments, c.department, 'title')}</td>
                <td>{c.class_name}</td>
                <td>{c.class_code}</td>
                <td>{c.roll_identifier}</td>
                <td>{c.ordering}</td>
                <td>
                  <span className={`status-${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(c)}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ClassSetup;
