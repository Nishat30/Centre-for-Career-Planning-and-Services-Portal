import React, { useState } from "react";
import { createJobPosting } from "../../api/useCreate";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar";

const CreateJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    jobTitle: "",
    jobDescription: "",
    Company: "",
    requiredSkills: "",
    Type: "on-campus",
    batch: "",
    Deadline: "",
    ApplicationLink: "",
    Expiry: "",
    author: "",
    relevanceScore: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Get today's date at start of day (midnight)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse deadlines if present (they can be empty strings)
  const deadlineDate = form.Deadline ? new Date(form.Deadline) : null;
  const expiryDate = form.Expiry ? new Date(form.Expiry) : null;

  // Check deadline date validity
  if (deadlineDate && deadlineDate < today) {
    toast.error("Application Deadline cannot be before today's date.");
    setSubmitting(false);
    return;
  }

  // Check expiry date validity
  if (expiryDate && expiryDate < today) {
    toast.error("Post Expiry Date cannot be before today's date.");
    setSubmitting(false);
    return;
  }

  // Optional: If you want to ensure Expiry date is after or equal to Deadline
  if (deadlineDate && expiryDate && expiryDate < deadlineDate) {
    toast.error("Post Expiry Date cannot be before Application Deadline.");
    setSubmitting(false);
    return;
  }

  setSubmitting(true);
  try {
    const token = localStorage.getItem("ccps-token");
    await createJobPosting(form, token);
    toast.success("Job created successfully!");
    setForm({
      jobTitle: "",
      jobDescription: "",
      Company: "",
      requiredSkills: "",
      Type: "on-campus",
      batch: "",
      Deadline: "",
      ApplicationLink: "",
      Expiry: "",
      author: "",
      relevanceScore: "",
    });
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Failed to create job");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 pt-20 md:pt-8 w-full">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#0c4a42] p-6">
            <h1 className="text-2xl font-bold text-white">New Job Posting</h1>
            <p className="text-green-300 mt-1">Fill in details to publish a job</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  required
                  value={form.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Engineer"
                  className="
                    w-full border border-gray-300 rounded-lg 
                    px-4 py-2 text-gray-900 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-2 focus:ring-green-600 focus:border-green-600
                    transition
                  "
                />
              </div>
              <div>
                <label
                  htmlFor="Company"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Name
                </label>
                <input
                  id="Company"
                  name="Company"
                  type="text"
                  required
                  value={form.Company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  className="
                    w-full border border-gray-300 rounded-lg 
                    px-4 py-2 text-gray-900 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-2 focus:ring-green-600 focus:border-green-600
                    transition
                  "
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="jobDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Description
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                required
                rows={5}
                value={form.jobDescription}
                onChange={handleChange}
                placeholder="Describe role, responsibilities, perks…"
                className="
                  w-full border border-gray-300 rounded-lg 
                  px-4 py-2 text-gray-900 
                  shadow-sm resize-none
                  focus:outline-none 
                  focus:ring-2 focus:ring-green-600 focus:border-green-600
                  transition
                "
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="requiredSkills"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Required Skills
                </label>
                <input
                  id="requiredSkills"
                  name="requiredSkills"
                  type="text"
                  value={form.requiredSkills}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js"
                  className="
                    w-full border border-gray-300 rounded-lg 
                    px-4 py-2 text-gray-900 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-2 focus:ring-green-600 focus:border-green-600
                    transition
                  "
                />
              </div>
              <div>
                <label
                  htmlFor="Type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Type
                </label>
                <select
                  id="Type"
                  name="Type"
                  required
                  value={form.Type}
                  onChange={handleChange}
                  className="
                    w-full border border-gray-300 rounded-lg 
                    px-4 py-2 text-gray-900 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-2 focus:ring-green-600 focus:border-green-600
                    transition
                  "
                >
                  <option value="on-campus">On-Campus</option>
                  <option value="off-campus">Off-Campus</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="batch"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Eligible Batch
                </label>
                <input
                  id="batch"
                  name="batch"
                  type="number"
                  required
                  value={form.batch}
                  onChange={handleChange}
                  placeholder="e.g. 2025"
                  className="
                    w-full border border-gray-300 rounded-lg 
                    px-4 py-2 text-gray-900 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-2 focus:ring-green-600 focus:border-green-600
                    transition
                  "
                />
              </div>
              <div>
                <label
                  htmlFor="relevanceScore"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Relevance Score
                </label>
                <input
                  id="relevanceScore"
                  name="relevanceScore"
                  type="number"
                  step="0.1"
                  value={form.relevanceScore}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="
                    w-full border border-gray-300 rounded-lg 
                    px-4 py-2 text-gray-900 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-2 focus:ring-green-600 focus:border-green-600
                    transition
                  "
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="Deadline"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Application Deadline
                </label>
                <input
                  id="Deadline"
                  name="Deadline"
                  type="date"
                  value={form.Deadline}
                  onChange={handleChange}
                  className="
                    w-full border border-gray-300 rounded-lg 
                    px-4 py-2 text-gray-900 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-2 focus:ring-green-600 focus:border-green-600
                    transition
                  "
                />
              </div>
              <div>
                <label
                  htmlFor="Expiry"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Post Expiry Date
                </label>
                <input
                  id="Expiry"
                  name="Expiry"
                  type="date"
                  value={form.Expiry}
                  onChange={handleChange}
                  className="
                    w-full border border-gray-300 rounded-lg 
                    px-4 py-2 text-gray-900 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-2 focus:ring-green-600 focus:border-green-600
                    transition
                  "
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="ApplicationLink"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Application Link (optional)
              </label>
              <input
                id="ApplicationLink"
                name="ApplicationLink"
                type="url"
                value={form.ApplicationLink}
                onChange={handleChange}
                placeholder="https://apply.here"
                className="
                  w-full border border-gray-300 rounded-lg 
                  px-4 py-2 text-gray-900 
                  shadow-sm 
                  focus:outline-none 
                  focus:ring-2 focus:ring-green-600 focus:border-green-600
                  transition
                "
              />
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Author (optional)
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={form.author}
                onChange={handleChange}
                placeholder="Your name"
                className="
                  w-full border border-gray-300 rounded-lg 
                  px-4 py-2 text-gray-900 
                  shadow-sm 
                  focus:outline-none 
                  focus:ring-2 focus:ring-green-600 focus:border-green-600
                  transition
                "
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/jobs")}
                disabled={submitting}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 flex items-center space-x-2 transition"
              >
                {submitting && (
                  <svg
                    className="w-5 h-5 animate-spin text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 10-8 8z"
                      className="opacity-75"
                    />
                  </svg>
                )}
                <span>{submitting ? "Creating..." : "Create Job"}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
