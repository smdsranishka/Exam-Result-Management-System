import React, { useState, useEffect } from "react";
import api from "../api/axios";
import {
  UserPlus,
  Key,
  RefreshCcw,
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Copy,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const SupervisorDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: "",
    facultyId: "",
  });
  const [newKey, setNewKey] = useState({ keyValue: "", facultyId: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adminRes, facultyRes, keysRes] = await Promise.all([
        api.get("/supervisor/admins"),
        api.get("/supervisor/faculties"),
        api.get("/supervisor/access-keys"),
      ]);
      setAdmins(adminRes.data.admins);
      setFaculties(facultyRes.data.faculties || []);
      setKeys(keysRes.data.keys || []);
    } catch (err) {
      toast.error("Failed to fetch supervisor data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (newAdmin.password.length < 6) {
      return toast.warning("Password must be at least 6 characters");
    }
    try {
      await api.post("/supervisor/create-admin", newAdmin);
      toast.success(`Admin account ${newAdmin.username} created`);
      setNewAdmin({ username: "", password: "", facultyId: "" });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating admin");
    }
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    if (newKey.keyValue.length < 4) {
      return toast.warning("Access key must be at least 4 characters");
    }
    try {
      await api.post("/supervisor/create-access-key", newKey);
      toast.success("Security access key issued");
      setNewKey({ keyValue: "", facultyId: "" });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error generating key");
    }
  };

  const handleDeleteKey = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this unused key?"))
      return;
    try {
      await api.delete(`/supervisor/delete-access-key/${id}`);
      toast.success("Key revoked successfully");
      fetchData();
    } catch (err) {
      toast.error("Error revoking key");
    }
  };

  const generateRandomKey = () => {
    const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
    setNewKey({ ...newKey, keyValue: rand });
    toast.info("Random key generated", { autoClose: 1000 });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Key copied to clipboard!");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Supervisor Control
          </h1>
          <p className="text-slate-500 font-medium">
            Manage faculty security and administrative personnel.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="p-3 bg-white border border-slate-100 shadow-sm rounded-2xl hover:bg-slate-50 transition-all text-primary-600"
          title="Refresh Data"
        >
          <RefreshCcw size={22} className={loading ? "animate-spin" : ""} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Admin */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <UserPlus size={20} />
            </div>
            Register Faculty Admin
          </h2>
          <form onSubmit={handleCreateAdmin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Username
              </label>
              <input
                type="text"
                placeholder="e.g. comp_admin_01"
                className="input-field py-3"
                value={newAdmin.username}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, username: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Temporary Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field py-3"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Assigned Faculty
              </label>
              <select
                className="input-field py-3"
                value={newAdmin.facultyId}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, facultyId: e.target.value })
                }
                required
              >
                <option value="">Select Target Faculty</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full btn-primary py-4 font-bold shadow-blue-200 mt-2"
            >
              Create Admin Account
            </button>
          </form>
        </motion.section>

        {/* Generate Key */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Key size={20} />
            </div>
            Issue Access Key
          </h2>
          <form onSubmit={handleCreateKey} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Custom or Random Key
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FACULTY-X-2026"
                  className="input-field uppercase font-mono py-3"
                  value={newKey.keyValue}
                  onChange={(e) =>
                    setNewKey({ ...newKey, keyValue: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={generateRandomKey}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm italic"
                >
                  GEN
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Target Faculty
              </label>
              <select
                className="input-field py-3"
                value={newKey.facultyId}
                onChange={(e) =>
                  setNewKey({ ...newKey, facultyId: e.target.value })
                }
                required
              >
                <option value="">Select Target Faculty</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-xs text-amber-700 font-medium leading-relaxed italic">
                Note: Access keys are Single-Use. Once verified by an
                administrator, the key becomes invalid and cannot be shared.
              </p>
            </div>
            <button
              type="submit"
              className="w-full btn-primary py-4 font-bold bg-amber-600 hover:bg-amber-700 shadow-amber-200 mt-2"
            >
              Generate and Save Key
            </button>
          </form>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Admin Table */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="text-primary-600" />
            <h2 className="text-xl font-bold text-slate-800">
              Active Administrators
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                    Faculty
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 italic-none">
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-slate-50/50 transition-all"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {admin.username}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-primary-50 text-primary-700 border border-primary-100 px-3 py-1 rounded-full text-xs font-bold">
                        {admin.facultyName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 font-medium text-sm">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Access Keys Table */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <Key className="text-amber-500" />
            <h2 className="text-xl font-bold text-slate-800">
              Security Keys Log
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Key
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                    Faculty
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 italic-none">
                {keys.map((key) => (
                  <tr
                    key={key.id}
                    className="hover:bg-slate-50/50 transition-all group"
                  >
                    <td className="px-6 py-4 font-mono font-black text-slate-700 tracking-tighter flex items-center gap-2">
                      {key.keyValue}
                      <button
                        onClick={() => copyToClipboard(key.keyValue)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title="Copy Key"
                      >
                        <Copy size={14} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-600 text-sm">
                      {key.facultyName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {key.isUsed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                          <XCircle size={14} /> Used
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                          <CheckCircle2 size={14} /> Available
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!key.isUsed && (
                        <button
                          onClick={() => handleDeleteKey(key.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {keys.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-slate-400 italic"
                    >
                      No access keys generated yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
