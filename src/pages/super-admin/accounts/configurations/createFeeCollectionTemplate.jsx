import React, { useState, useEffect } from "react";
import "../../../assets/styles/admin/accounts/configurations/createFeeCollectionTemplate.css";

const CreateFeeCollectionTemplate = () => {
  const [sessions] = useState(["2025-2026", "2026-2027", "2027-2028"]);
  const [session, setSession] = useState("");

  const initialClassList = [
    { id: 1, className: "HSC-Science", eduLevel: "Higher Secondary", department: "Science", medium: "Bangla", shift: "Day", selected: false },
    { id: 2, className: "HSC-Humanities", eduLevel: "Higher Secondary", department: "Humanities", medium: "Bangla", shift: "Day", selected: false },
    { id: 3, className: "HSC-Business Studies", eduLevel: "Higher Secondary", department: "B. Studies", medium: "Bangla", shift: "Day", selected: false },
    { id: 4, className: "Preliminary Masters", eduLevel: "Preliminary Masters", department: "Economics", medium: "Bangla", shift: "Day", selected: false },
    { id: 5, className: "Preliminary Masters", eduLevel: "Preliminary Masters", department: "Islamic History & Culture", medium: "Bangla", shift: "Day", selected: false },
  ];

  const [classList, setClassList] = useState(initialClassList);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(5);
  const [page, setPage] = useState(1);

  const toggleClassSelection = (id) => {
    setClassList(prev =>
      prev.map(cls => cls.id === id ? { ...cls, selected: !cls.selected } : cls)
    );
  };

  const filteredClasses = classList.filter(cls =>
    `${cls.className} ${cls.department} ${cls.eduLevel}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClasses.length / entries);
  const paginatedClasses = filteredClasses.slice((page - 1) * entries, page * entries);
  const selectedClasses = classList.filter(cls => cls.selected);

  // ===== Transaction Heads =====
  const [transactionType, setTransactionType] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payableMonths, setPayableMonths] = useState([]);

  const initialTransactionHeads = [
    { id: 1, title: "Examination Fee", type: "Irregular", qty: 0, unitAmount: 500, amount: 0, months: [], selected: false },
    { id: 2, title: "Primary Apply Fee", type: "Irregular", qty: 0, unitAmount: 300, amount: 0, months: [], selected: false },
    { id: 3, title: "Form Fill Up → Center Fee", type: "Irregular", qty: 0, unitAmount: 200, amount: 0, months: [], selected: false },
    { id: 4, title: "Form Fill Up → Exam Fee (5 × 700)", type: "Irregular", qty: 0, unitAmount: 3500, amount: 0, months: [], selected: false },
  ];

  const [transactionHeads, setTransactionHeads] = useState(initialTransactionHeads);

  // Generate months between start and end
  useEffect(() => {
    if (startDate && endDate) {
      const months = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      const d = new Date(start);
      while (d <= end) {
        months.push(d.toLocaleString("default", { month: "short", year: "numeric" }));
        d.setMonth(d.getMonth() + 1);
      }
      setPayableMonths(months);
    } else {
      setPayableMonths([]);
    }
  }, [startDate, endDate]);

  // Handle quantity change: updates months and auto-selects checkbox
  const handleTransactionChange = (id, value) => {
    const qty = Number(value);
    setTransactionHeads(prev =>
      prev.map(h => {
        if (h.id === id) {
          const months = qty > 0 ? payableMonths.slice(0, qty) : [];
          return { ...h, qty, months, selected: qty > 0 ? true : false };
        }
        return h;
      })
    );
  };

  // Handle month checkbox toggle
  const handleMonthToggle = (headId, month) => {
    setTransactionHeads(prev =>
      prev.map(h => {
        if (h.id === headId) {
          const updatedMonths = h.months.includes(month)
            ? h.months.filter(m => m !== month)
            : [...h.months, month];
          return { ...h, months: updatedMonths };
        }
        return h;
      })
    );
  };

  // Handle transaction head selection
  const toggleTransactionHead = (id) => {
    setTransactionHeads(prev =>
      prev.map(h => h.id === id ? { ...h, selected: !h.selected } : h)
    );
  };

  // Manual amount input
  const handleAmountChange = (id, value) => {
    setTransactionHeads(prev =>
      prev.map(h => h.id === id ? { ...h, amount: Number(value) } : h)
    );
  };

  const totalAmount = transactionHeads.reduce((sum, h) => sum + Number(h.amount || 0), 0);

  // Save button handler
  const handleSave = () => {
    const dataToSave = {
      session,
      transactionType,
      templateName,
      startDate,
      endDate,
      transactionHeads: transactionHeads.filter(h => h.selected),
    };
    console.log("Saving Template Data:", dataToSave);
    alert("Template Saved! Check console for data.");
  };

  return (
    <div className="create-fee-template-page">
      <div className="breadcrumb">
        Dashboard / Accounts / Fee Collection Templates / Create Fee Collection Template
      </div>

      {/* CARD */}
      <div className="fee-card">
        <h2>Create Fee Collection Template</h2>
        <div className="form-group">
          <label>Session</label>
          <select value={session} onChange={(e) => setSession(e.target.value)}>
            <option value="">Select Session</option>
            {sessions.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* CLASS SECTION */}
      <div className="class-section">
        <div className="selected-classes">
          <h3>Selected Class Name</h3>
          {selectedClasses.length === 0 ? (
            <p>No Class Selected</p>
          ) : (
            <ul className="selected-class-list">
              {selectedClasses.map(c => (
                <li key={c.id}>
                  <strong>{c.className}</strong> [{c.eduLevel}] - {`{${c.medium}, ${c.shift}}`} - {c.department}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="class-list">
          <h3>Class Name List</h3>
          <div className="table-tools">
            <select value={entries} onChange={e => setEntries(Number(e.target.value))}>
              {[5, 10, 20, 50, 100].map(n => <option key={n}>{n}</option>)}
            </select>
            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Class</th>
                <th>Edu Level</th>
                <th>Department</th>
                <th>Medium</th>
                <th>Shift</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClasses.map(c => (
                <tr key={c.id}>
                  <td><input type="checkbox" checked={c.selected} onChange={() => toggleClassSelection(c.id)} /></td>
                  <td>{c.className}</td>
                  <td>{c.eduLevel}</td>
                  <td>{c.department}</td>
                  <td>{c.medium}</td>
                  <td>{c.shift}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span>{page} / {totalPages || 1}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* TRANSACTION HEADS */}
      <div className="transaction-heads">
        <h3>Transaction Heads</h3>
        <div className="transaction-top">
          <select value={transactionType} onChange={e => setTransactionType(e.target.value)}>
            <option value="">Transaction Type</option>
            <option value="Irregular">Irregular</option>
            <option value="Regular">Regular</option>
          </select>
          <input placeholder="Template Name" value={templateName} onChange={e => setTemplateName(e.target.value)} />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>

        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Head Title</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Payable Months</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactionHeads.map(h => (
              <tr key={h.id}>
                <td>
                  <input type="checkbox" checked={h.selected} onChange={() => toggleTransactionHead(h.id)} />
                </td>
                <td>{h.title}</td>
                <td>
                  <select value={h.type} onChange={e => {
                    const newType = e.target.value;
                    setTransactionHeads(prev => prev.map(t => t.id === h.id ? { ...t, type: newType } : t));
                  }}>
                    <option value="Irregular">Irregular</option>
                    <option value="Regular">Regular/Monthly</option>
                  </select>
                </td>
                <td>
                  <select value={h.qty} onChange={e => handleTransactionChange(h.id, e.target.value)}>
                    {Array.from({ length: 49 }, (_, i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </td>
                <td>
                  {payableMonths.length === 0 ? "-" : (
                    <div className="months-checkbox">
                      {payableMonths.map(m => (
                        <label key={m} style={{ marginRight: "8px" }}>
                          <input
                            type="checkbox"
                            checked={h.months.includes(m)}
                            onChange={() => handleMonthToggle(h.id, m)}
                          />
                          {m}
                        </label>
                      ))}
                    </div>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={h.amount}      // starts at 0
                    onChange={e => handleAmountChange(h.id, e.target.value)}  // manual entry
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="right bold">Total</td>
              <td className="bold">{totalAmount}</td>
            </tr>
          </tfoot>
        </table>

        <div className="save-btn-container" style={{ marginTop: "20px" }}>
          <button className="save-btn" onClick={handleSave}>Save Template</button>
        </div>
      </div>
    </div>
  );
};

export default CreateFeeCollectionTemplate;
