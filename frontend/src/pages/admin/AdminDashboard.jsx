import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, courses: 0, subjects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/get-stats");
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Students",
      value: stats.students,
      icon: <Users size={24} />,
      color: "bg-blue-500",
      shadow: "shadow-blue-200",
    },
    {
      label: "Active Courses",
      value: stats.courses,
      icon: <GraduationCap size={24} />,
      color: "bg-purple-500",
      shadow: "shadow-purple-200",
    },
    {
      label: "Total Subjects",
      value: stats.subjects,
      icon: <BookOpen size={24} />,
      color: "bg-emerald-500",
      shadow: "shadow-emerald-200",
    },
  ];

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading Dashboard Data...
      </div>
    );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Faculty Overview
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Real-time statistics and academic insights.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
          <Calendar size={18} className="text-primary-500" />
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((card, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={card.label}
            className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-xl ${card.shadow} relative overflow-hidden group`}
          >
            <div
              className={`absolute -right-4 -top-4 w-24 h-24 ${card.color} opacity-[0.03] rounded-full group-hover:scale-110 transition-transform duration-500`}
            ></div>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  {card.label}
                </p>
                <h3 className="text-4xl font-black text-slate-900 leading-none">
                  {card.value}
                </h3>
              </div>
              <div
                className={`${card.color} text-white p-4 rounded-2xl shadow-lg`}
              >
                {card.icon}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
              <TrendingUp size={14} /> +{Math.floor(Math.random() * 5 + 1)}%
              from last month
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Award className="text-amber-500" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/admin/students"
              className="p-4 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
            >
              <p className="font-bold text-slate-800 group-hover:text-primary-700">
                Add Student
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Enroll new student to faculty
              </p>
            </a>
            <a
              href="/admin/results"
              className="p-4 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
            >
              <p className="font-bold text-slate-800 group-hover:text-primary-700">
                Upload Results
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Batch update exam marks
              </p>
            </a>
          </div>
        </section>

        <section className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <GraduationCap size={160} />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Faculty Performance</h2>
            <p className="text-slate-400 text-sm font-medium mb-6">
              Overall academic summary for the current semester.
            </p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Pass Rate</span>
                  <span>84%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: "84%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Result Verification Status</span>
                  <span>62%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: "62%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
