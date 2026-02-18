import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { Award, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const StudentResults = () => {
  const { level } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [level]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/student/results/level/${level}`);
      setResults(res.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">
        Loading Level {level} results...
      </div>
    );

  return (
    <motion.div
      key={level}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="p-4 md:p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              Academic Achievement
            </h1>
            <p className="text-slate-500 text-base md:text-lg">
              Detailed results for Level {level} semester examinations.
            </p>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shrink-0">
            <Award size={28} />
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <BookOpen className="mx-auto text-slate-300 mb-2" size={48} />
            <p className="text-slate-500">
              No results have been uploaded for Level {level} yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((res) => (
              <div
                key={res.id}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-white hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">
                  {res.subjectCode}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-4 line-clamp-1">
                  {res.subjectName}
                </h3>

                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-semibold uppercase">
                      Marks
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {res.marks}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm transition-all group-hover:scale-110">
                      Grade:{" "}
                      <span className="text-primary-600">{res.grade}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      GPA: {res.gpa}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="p-6 bg-primary-600 rounded-3xl text-white shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Level {level} Summary</h3>
            <p className="text-blue-100 text-sm">
              Keep up the great work! Your academic record is exemplary.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">
              {(
                results.reduce((acc, r) => acc + parseFloat(r.gpa), 0) /
                results.length
              ).toFixed(2)}
            </div>
            <div className="text-xs uppercase font-bold text-blue-200">
              Current LV {level} Average GPA
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StudentResults;
