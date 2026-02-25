import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/admin/accounts/configurations/addDiscount.css";

const AddDiscount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: "",
    classRoll: "",
  });

  const [studentData, setStudentData] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [remarks, setRemarks] = useState("");

  // Dummy data (replace with API)
  const dummyStudent = {
    name: "Sarker Mahadi Lotus",
    admissionDate: "31-07-2025",
    studentCode: "2215710450094",
    roll: "4202223612595",
    className: "B. A. (Degree Pass)",
    section: "2nd Year",
    medium: "Bangla",
    shift: "Day",
    feeTemplate:
      "New Fee Collection Template ( B. A. (Degree Pass) 20970 TK [01-07-2023 to 30-06-2024] [2022-2023])",
    fees: [
      { title: "Form Fill Up Fee", month: "Jun, 2024", max: 2220 },
      { title: "Admission Fee", month: "Jun, 2024", max: 1000 },
      { title: "Session Fee", month: "Jun, 2024", max: 5750 },
      { title: "Tuition Fee", month: "Jul, 2023", max: 1000 },
      { title: "Tuition Fee", month: "Aug, 2023", max: 1000 },
      { title: "Tuition Fee", month: "Sep, 2023", max: 1000 },
      { title: "Tuition Fee", month: "Oct, 2023", max: 1000 },
      { title: "Tuition Fee", month: "Nov, 2023", max: 1000 },
      { title: "Tuition Fee", month: "Dec, 2023", max: 1000 },
      { title: "Tuition Fee", month: "Jan, 2024", max: 1000 },
      { title: "Tuition Fee", month: "Feb, 2024", max: 1000 },
      { title: "Tuition Fee", month: "Mar, 2024", max: 1000 },
      { title: "Tuition Fee", month: "Apr, 2024", max: 1000 },
      { title: "Tuition Fee", month: "May, 2024", max: 1000 },
      { title: "Tuition Fee", month: "Jun, 2024", max: 1000 },
    ],
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    if (!formData.studentId && !formData.classRoll) {
      alert("Please enter Student ID or Class Roll");
      return;
    }
    setStudentData(dummyStudent);
  };

  const totalFee = studentData
    ? studentData.fees.reduce((sum, fee) => sum + fee.max, 0)
    : 0;

  const handleSubmit = () => {
    if (discountAmount <= 0) {
      alert("Please enter discount amount");
      return;
    }

    console.log({
      student: studentData,
      discountAmount,
      remarks,
    });

    alert("Discount applied successfully!");
    navigate("/discountConfig");
  };

  return (
    <div className="add-discount-page">
      <div className="breadcrumb">
        Dashboard / Accounts / Student Fee Discounts / Add Discount
      </div>

      <div className="page-header">
        <h2>Add Discount</h2>
        <button className="back-btn" onClick={() => navigate("/discountConfig")}>
          ← Back
        </button>
      </div>

      {/* Search Section */}
      <div className="discount-form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Class Roll</label>
            <input
              type="text"
              name="classRoll"
              value={formData.classRoll}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="search-btn" onClick={handleSearch}>
          Search Student
        </button>
      </div>

      {/* Student Details */}
      {studentData && (
        <div className="student-info-card">
          <div className="student-header">
            <div className="student-img">Student Img</div>
            <div className="student-details">
              <p><strong>Student Name:</strong> {studentData.name}</p>
              <p><strong>Admission Date:</strong> {studentData.admissionDate}</p>
              <p><strong>Student Code:</strong> {studentData.studentCode}</p>
              <p><strong>Roll:</strong> {studentData.roll}</p>
              <p><strong>Class:</strong> {studentData.className} - {studentData.shift}</p>
              <p><strong>Section:</strong> {studentData.section}</p>
              <p><strong>Medium:</strong> {studentData.medium}</p>
            </div>
          </div>

          <div className="fee-template">
            <strong>Fee Template:</strong> {studentData.feeTemplate}
          </div>

          {/* Fee Table */}
          <div className="fee-list">
            {studentData.fees.map((fee, index) => (
              <div key={index} className="fee-item">
                <div className="fee-left">
                  <strong>{fee.title}</strong>
                  <span>{fee.month}</span>
                </div>
                <div className="fee-right">
                  <span className="max-amount">Max: {fee.max.toFixed(2)}</span>
                  <input type="text" placeholder="Write comment (optional)" />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="summary-card">
            <div>
              <strong>Total Fee:</strong> {totalFee.toFixed(2)}
            </div>
            <div>
              <strong>Discount:</strong> {discountAmount || "0.00"}
            </div>
            <div>
              <strong>Payable:</strong>{" "}
              {(totalFee - discountAmount).toFixed(2)}
            </div>
          </div>

          {/* Discount & Remarks */}
          <div className="discount-actions">
            <div className="form-group">
              <label>Discount Amount</label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Remarks / Comment</label>
              <textarea
                rows="3"
                placeholder="Write reason for discount"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            Save Discount
          </button>
        </div>
      )}
    </div>
  );
};

export default AddDiscount;
