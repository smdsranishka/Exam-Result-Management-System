import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  LogOut,
  Key,
  FilePlus,
  User,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  // ... (links are the same)
  const supervisorLinks = [
    {
      to: "/supervisor/admins",
      icon: <Users size={20} />,
      label: "Manage Admins",
    },
  ];

  const adminLinks = [
    { to: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/admin/students", icon: <Users size={20} />, label: "Students" },
    { to: "/admin/subjects", icon: <BookOpen size={20} />, label: "Subjects" },
    {
      to: "/admin/results",
      icon: <FilePlus size={20} />,
      label: "Add Results",
    },
  ];

  const studentLinks = [
    { to: "/student", icon: <User size={20} />, label: "My Profile" },
    {
      to: "/student/results/1",
      icon: <GraduationCap size={20} />,
      label: "Results L1",
    },
    {
      to: "/student/results/2",
      icon: <GraduationCap size={20} />,
      label: "Results L2",
    },
    {
      to: "/student/results/3",
      icon: <GraduationCap size={20} />,
      label: "Results L3",
    },
    {
      to: "/student/results/4",
      icon: <GraduationCap size={20} />,
      label: "Results L4",
    },
  ];

  const getLinks = () => {
    if (user?.role === "SUPERVISOR") return supervisorLinks;
    if (user?.role === "ADMIN") return adminLinks;
    if (user?.role === "STUDENT") return studentLinks;
    return [];
  };

  return (
    <aside
      className={`sidebar-container w-64 bg-slate-900 h-screen fixed left-0 top-0 text-slate-300 flex flex-col z-50 transition-transform duration-300 transform 
      ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="text-primary-500" />
            UOK Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
            {user?.role}
          </p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 hover:bg-slate-800 rounded-md"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {getLinks().map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            end={
              link.to === "/admin" ||
              link.to === "/supervisor" ||
              link.to === "/student"
            }
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active text-white" : "hover:text-white"}`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="px-4 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
            {user?.username?.[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium truncate">{user?.username}</span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all font-semibold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
