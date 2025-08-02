import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import {
  getStudentProfile,
  updateStudentProfile,
  createStudentProfile,
} from "../../api/profile/useStudentProfile";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar";

const initialData = {
  name: "",
  email: "",
  studentID: "",
  discipline: "",
  program: "",
  cgpa: "",
  imageUrl: "",
  resumeUrl: "",
};

export default function Profile() {
  const { authUser } = useAuthContext();
  const [profile, setProfile] = useState(initialData);
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const isIncomplete =
    !profile.studentID || !profile.discipline || !profile.program || !profile.cgpa;

  useEffect(() => {
    if (!authUser?._id) return;
    setLoading(true);
    getStudentProfile(authUser._id)
      .then((data) => {
        setProfile({ ...initialData, ...data });
        setFormData({ ...initialData, ...data });
      })
      .catch(() => {
        setProfile((prev) => ({
          ...prev,
          name: authUser.name,
          email: authUser.email,
        }));
        setFormData((prev) => ({
          ...prev,
          name: authUser.name,
          email: authUser.email,
        }));
      })
      .finally(() => setLoading(false));
  }, [authUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, batch: 2025, status: "active" };
    try {
      if (!profile.studentID) {
        await createStudentProfile(authUser._id, payload);
        toast.success("Profile created successfully!");
      } else {
        await updateStudentProfile(authUser._id, payload);
        toast.success("Profile updated successfully!");
      }
      const updated = await getStudentProfile(authUser._id);
      setProfile({ ...initialData, ...updated });
      setFormData({ ...initialData, ...updated });
      setShowForm(false);
    } catch (err) {
      if (err.response?.data?.message?.includes("already exists")) {
        toast.error("A profile with this Student ID already exists.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-medium text-gray-600">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f7fafc]">
      <Sidebar />
      <main className="flex-1 flex justify-center items-start pt-24 px-4 sm:px-8">
        <section className="relative w-full max-w-3xl bg-white shadow-2xl rounded-2xl pt-32 pb-10 px-7 sm:px-12 flex flex-col items-center">
          {/* Profile Avatar */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10 flex justify-center">
            <div className="rounded-full border-4 border-white bg-gradient-to-br from-emerald-300 to-[#0fa18e] p-1 shadow-lg shadow-[#0fa18e]/10">
              {profile.imageUrl ? (
                <img
                  src={profile.imageUrl}
                  alt="Profile"
                  className="h-36 w-36 rounded-full object-cover bg-white"
                />
              ) : (
                <div className="h-36 w-36 rounded-full bg-emerald-200 flex items-center justify-center text-white font-extrabold text-5xl uppercase">
                  {profile.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
          </div>

          {/* Name & Email */}
          <div className="mt-6 w-full flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name || "Your Name"}</h1>
            <p className="text-base text-gray-500">{profile.email}</p>
            {!showForm && isIncomplete && (
              <div className="mt-4 w-full text-sm px-4 py-2 bg-amber-100 text-amber-900 rounded-md font-medium text-center animate-pulse">
                Your profile is incomplete. Please update the missing fields.
              </div>
            )}
          </div>

          {/* Profile Info or Form */}
          <div className="mt-7 w-full">
            {!showForm ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <Info label="Student ID" value={profile.studentID} />
                  <Info label="Discipline" value={profile.discipline} />
                  <Info label="Program" value={profile.program} />
                  <Info label="CGPA" value={profile.cgpa} />
                  {profile.resumeUrl && (
                    <div className="sm:col-span-2 text-center">
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-[#0fa18e] underline font-bold tracking-wide transition"
                      >
                        View Resume
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-[#0fa18e] to-emerald-600 hover:from-[#13665b] hover:to-emerald-700 text-white py-2 px-7 rounded-full font-semibold shadow-md transition-all duration-150"
                  >
                    {isIncomplete ? "Complete Profile" : "Edit Profile"}
                  </button>
                  <a
                    href="/referrals"
                    className="bg-white border border-emerald-500 text-emerald-700 hover:bg-emerald-50 py-2 px-7 rounded-full font-semibold transition-all duration-150 shadow"
                  >
                    View Referrals
                  </a>
                  <a
                    href="/applications"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-7 rounded-full font-semibold border border-gray-200 transition-all duration-150 shadow"
                  >
                    Saved Applications
                  </a>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 w-full mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "name", label: "Full Name", type: "text" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "studentID", label: "Student ID", type: "text" },
                    { name: "discipline", label: "Discipline", type: "text" },
                    { name: "program", label: "Program", type: "text" },
                    { name: "cgpa", label: "CGPA", type: "number", step: "0.01", min: "0", max: "10" },
                    { name: "imageUrl", label: "Profile Image URL", type: "url" },
                    { name: "resumeUrl", label: "Resume URL", type: "url" },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-col">
                      <label className="block mb-1 text-sm font-medium text-gray-700">{field.label}</label>
                      <input
                        {...field}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 shadow-sm bg-[#f7fafc] focus:outline-none focus:ring-2 focus:ring-[#0fa18e] focus:border-[#0fa18e] transition"
                        required={field.name !== "resumeUrl" && field.name !== "imageUrl"}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#0fa18e] to-emerald-600 hover:from-[#13665b] hover:to-emerald-700 text-white font-semibold py-2 px-8 rounded-full shadow-md transition-all duration-150"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-8 rounded-full transition-all duration-150"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-[#f8fafc] rounded-lg p-4 flex flex-col shadow-sm border border-gray-100">
      <span className="text-xs font-bold text-[#0fa18e] uppercase tracking-wider mb-1">{label}</span>
      <span className="text-gray-800 font-medium text-base break-words">{value || "—"}</span>
    </div>
  );
}