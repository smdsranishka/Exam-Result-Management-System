import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { UserPlus, Search, GraduationCap } from "lucide-react";
import { toast } from "react-toastify";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newStudent, setNewStudent] = useState({
    username: "",
    password: "",
    fullName: "",
    studentNumber: "",
    academicYear: "",
    courseId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentRes, courseRes] = await Promise.all([
        api.get("/admin/students"),
        api.get("/supervisor/courses"),
      ]);
      setStudents(studentRes.data.students);
      setCourses(courseRes.data.courses || []);
    } catch (err) {
      toast.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    // Validation
    if (newStudent.password.length < 6) {
      return toast.warning("Password must be at least 6 characters");
    }
    if (!newStudent.studentNumber.includes("/")) {
      return toast.warning("Invalid Student Number format (e.g. SE/2021/001)");
    }

    try {
      await api.post("/admin/add-student", newStudent);
      toast.success(`${newStudent.fullName} added successfully`);
      setNewStudent({
        username: "",
        password: "",
        fullName: "",
        studentNumber: "",
        academicYear: "",
        courseId: "",
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding student");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Manage Students</h1>
        <p className="text-slate-500">
          Add and monitor students registered in your faculty.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Form */}
        <div className="xl:col-span-1">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-8">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <UserPlus size={18} /> Add Student
            </h2>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <input
                placeholder="Full Name"
                className="input-field"
                value={newStudent.fullName}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, fullName: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Username"
                  className="input-field"
                  value={newStudent.username}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, username: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Initial Pass"
                  className="input-field"
                  value={newStudent.password}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, password: e.target.value })
                  }
                  required
                />
              </div>
              <input
                placeholder="Student Number"
                className="input-field"
                value={newStudent.studentNumber}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    studentNumber: e.target.value,
                  })
                }
                required
              />
              <input
                placeholder="Academic Year"
                className="input-field"
                value={newStudent.academicYear}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, academicYear: e.target.value })
                }
                required
              />
              <select
                className="input-field"
                value={newStudent.courseId}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, courseId: e.target.value })
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
              <button type="submit" className="w-full btn-primary mt-2">
                Add Student
              </button>
            </form>
          </section>
        </div>

        {/* List */}
        <div className="xl:col-span-3">
          <section className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-4 border-b border-slate-100 flex items-center gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name or student number..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                      ID / Year
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Course
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                            {student.fullName[0]}
                          </div>
                          <span className="font-medium text-slate-900">
                            {student.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold">
                          {student.studentNumber}
                        </div>
                        <div className="text-xs text-slate-500">
                          {student.academicYear}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm px-2 py-1 bg-slate-100 rounded-md">
                          {student.courseName}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
