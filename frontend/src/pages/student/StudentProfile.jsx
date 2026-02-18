import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Camera, User, BadgeCheck, GraduationCap, Mail } from "lucide-react";
import { toast } from "react-toastify";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/student/profile");
      setProfile(res.data.profile);
    } catch (err) {
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.warning("Please upload a valid image file");
    }
    if (file.size > 2 * 1024 * 1024) {
      return toast.warning("Image size must be less than 2MB");
    }

    const formData = new FormData();
    formData.append("photo", file);

    const toastId = toast.loading("Uploading photo...");
    try {
      await api.put("/student/update-photo", formData);
      toast.update(toastId, {
        render: "Photo updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      fetchProfile();
    } catch (err) {
      toast.update(toastId, {
        render: "Error uploading photo",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (loading) return <div>Loading Profile...</div>;
  if (!profile) return <div>No profile data found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="relative">
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl"></div>
        <div className="md:absolute md:-bottom-20 md:left-8 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-16 md:mt-0 px-4 md:px-0">
          <div className="relative group">
            <img
              src={
                profile.photoUrl
                  ? `http://localhost:5000${profile.photoUrl}`
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl opacity-0 md:group-hover:opacity-100 transition-all cursor-pointer">
              <Camera className="text-white" size={32} />
              <input
                type="file"
                className="hidden"
                onChange={handlePhotoUpload}
                accept="image/*"
              />
            </label>
            {/* Mobile Photo Upload Hint */}
            <div className="md:hidden absolute bottom-1 right-1 bg-primary-600 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
              <Camera size={16} />
            </div>
          </div>
          <div className="pb-4 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">
              {profile.fullName}
            </h1>
            <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-1 text-sm md:text-base">
              <BadgeCheck className="text-primary-500" size={18} /> Student
              Number: {profile.studentNumber}
            </p>
          </div>
        </div>
      </header>

      <div className="pt-4 md:pt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <GraduationCap className="text-primary-600" /> Academic Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Faculty</span>
              <span className="font-semibold">{profile.facultyName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Course</span>
              <span className="font-semibold">{profile.courseName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Academic Year</span>
              <span className="font-semibold">{profile.academicYear}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="text-primary-600" /> Account Settings
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Username</span>
              <span className="font-semibold">{profile.username}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-400">
                Profile photo is the only editable field for students. To change
                academic data, contact your faculty admin.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
