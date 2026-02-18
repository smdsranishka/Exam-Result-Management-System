import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { BookPlus, Trash2, Layers } from "lucide-react";
import { toast } from "react-toastify";

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newSubject, setNewSubject] = useState({
    subjectCode: "",
    subjectName: "",
    level: "",
    courseId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, courseRes] = await Promise.all([
        api.get("/admin/subjects"),
        api.get("/supervisor/courses"),
      ]);
      setSubjects(subRes.data.subjects);
      setCourses(courseRes.data.courses || []);
    } catch (err) {
      toast.error("Failed to load subjects");
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (newSubject.subjectCode.length < 3) {
      return toast.warning("Subject code must be at least 3 characters");
    }

    try {
      await api.post("/admin/add-subject", newSubject);
      toast.success(`${newSubject.subjectName} added successfully`);
      setNewSubject({
        subjectCode: "",
        subjectName: "",
        level: "",
        courseId: "",
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding subject");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;
    try {
      await api.delete(`/admin/delete-subject/${id}`);
      toast.success("Subject deleted");
      fetchData();
    } catch (err) {
      toast.error("Error deleting subject");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 leading-tight">
        Manage Subjects
      </h1>
      <p className="text-slate-500 font-medium pb-2">
        Create and manage academic subjects for your faculty.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h2 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <BookPlus size={18} />
            </div>
            Add Subject
          </h2>
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Subject Code
              </label>
              <input
                placeholder="e.g. COSC 12013"
                className="input-field"
                value={newSubject.subjectCode}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, subjectCode: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Subject Name
              </label>
              <input
                placeholder="e.g. Data Structures"
                className="input-field"
                value={newSubject.subjectName}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, subjectName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Level
              </label>
              <select
                className="input-field"
                value={newSubject.level}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, level: e.target.value })
                }
                required
              >
                <option value="">Select Level</option>
                {[1, 2, 3, 4].map((l) => (
                  <option key={l} value={l}>
                    Level {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Course
              </label>
              <select
                className="input-field"
                value={newSubject.courseId}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, courseId: e.target.value })
                }
                required
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full btn-primary py-3 font-bold mt-2 shadow-primary-200"
            >
              Add Subject
            </button>
          </form>
        </section>

        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-lg text-slate-800">
              Available Subjects
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Code
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Level
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 italic-none">
                {subjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-slate-400 italic font-medium"
                    >
                      No subjects found in this faculty.
                    </td>
                  </tr>
                ) : (
                  subjects.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/80 transition-all group"
                    >
                      <td className="px-6 py-4 font-mono text-sm font-bold text-primary-700">
                        {sub.subjectCode}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {sub.subjectName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 group-hover:bg-primary-50 group-hover:text-primary-700 group-hover:border-primary-100 transition-colors">
                          <Layers size={14} /> L{sub.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Subject"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubjects;
