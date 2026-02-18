import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Save, Search } from "lucide-react";
import { toast } from "react-toastify";

const AdminResults = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const studentRes = await api.get("/admin/students");
      setStudents(studentRes.data.students);
    } catch (err) {
      toast.error("Failed to load students list");
    }
  };

  const handleStudentSearch = async () => {
    if (!selectedStudent) return toast.info("Please select a student first");
    setLoading(true);
    try {
      const student = students.find((s) => s.id == selectedStudent);
      const [subRes, resRes] = await Promise.all([
        api.get(`/admin/subjects?courseId=${student.courseId}`),
        api.get(`/admin/results/${selectedStudent}`),
      ]);
      setSubjects(subRes.data.subjects);

      const existingResults = resRes.data.results;
      const initialResults = subRes.data.subjects.map((sub) => {
        const found = existingResults.find((r) => r.subjectId === sub.id);
        return found || { subjectId: sub.id, marks: "", grade: "", gpa: "" };
      });
      setResults(initialResults);
      if (subRes.data.subjects.length === 0) {
        toast.info("No subjects found for this student's course");
      }
    } catch (err) {
      toast.error("Error fetching academic data");
    } finally {
      setLoading(false);
    }
  };

  const handleResultChange = (index, field, value) => {
    const updated = [...results];
    updated[index][field] = value;
    setResults(updated);
  };

  const handleSave = async (index) => {
    const res = results[index];

    // Validation
    if (res.marks !== "" && (res.marks < 0 || res.marks > 100)) {
      return toast.warning("Marks must be between 0 and 100");
    }
    if (res.gpa !== "" && (res.gpa < 0 || res.gpa > 4.0)) {
      return toast.warning("GPA must be between 0.00 and 4.00");
    }

    try {
      await api.post("/admin/add-result", {
        studentId: selectedStudent,
        ...res,
      });
      toast.success("Result recorded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving result");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add / Update Results</h1>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
        <select
          className="input-field max-w-sm"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select a student...</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName} ({s.studentNumber})
            </option>
          ))}
        </select>
        <button
          onClick={handleStudentSearch}
          className="btn-primary flex items-center gap-2"
        >
          <Search size={18} /> Fetch Subjects
        </button>
      </section>

      {results.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 font-semibold text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3 w-32">Marks</th>
                  <th className="px-6 py-3 w-32">Grade</th>
                  <th className="px-6 py-3 w-32">GPA</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((sub, idx) => (
                  <tr key={sub.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium">{sub.subjectName}</div>
                      <div className="text-xs text-slate-500">
                        {sub.subjectCode} - L{sub.level}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        className="input-field py-1"
                        value={results[idx]?.marks}
                        onChange={(e) =>
                          handleResultChange(idx, "marks", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        className="input-field py-1 uppercase"
                        value={results[idx]?.grade}
                        onChange={(e) =>
                          handleResultChange(idx, "grade", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        step="0.01"
                        className="input-field py-1"
                        value={results[idx]?.gpa}
                        onChange={(e) =>
                          handleResultChange(idx, "gpa", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSave(idx)}
                        className="text-primary-600 hover:text-primary-800 flex items-center gap-1 font-semibold"
                      >
                        <Save size={16} /> Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminResults;
