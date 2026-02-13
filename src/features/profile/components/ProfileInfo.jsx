import React, { useState } from "react";
import { User } from "lucide-react";

const UNI_OPTIONS = [
  "Cairo University",
  "Helwan University",
  "Ain Shams University",
];
const FACULTY_OPTIONS = [
  "Computer Science",
  "Engineering",
  "Business",
  "Medicine",
  "Arts",
];
const GENDER_OPTIONS = ["Male", "Female"];

const InfoField = ({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  options = [],
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
      {label}
    </label>
    {isEditing ? (
      type === "select" ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-border-light rounded-lg text-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none transition-all cursor-pointer"
          >
            <option value="" disabled>
              Select {label}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-border-light rounded-lg text-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder={`Enter ${label}`}
          step={type === "number" ? "0.01" : undefined}
          min={type === "number" ? "0" : undefined}
          max={type === "number" ? "4" : undefined}
        />
      )
    ) : (
      <div
        className={`w-full p-3 bg-slate-50 border border-border-light rounded-lg text-slate-800 ${type === "number" ? "font-mono" : ""}`}
      >
        {value || <span className="text-slate-400 italic">Not set</span>}
      </div>
    )}
  </div>
);

export const ProfileInfo = ({ user, isOwnProfile = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState(user);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "faculty",
      "college",
      "gender",
      "gpa",
    ];

    requiredFields.forEach((field) => {
      if (!info[field] || info[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    if (info.gpa && (info.gpa < 0 || info.gpa > 4)) {
      newErrors.gpa = "GPA must be between 0 and 4.0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      setIsEditing(false);
      // In a real app, dispatch update here
    }
  };

  const handleCancel = () => {
    setInfo(user);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <section className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
          <User className="text-secondary" size={24} /> Personal Information
        </h2>
        {!isEditing && isOwnProfile && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Edit Info
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InfoField
            label="First Name"
            value={info.firstName}
            isEditing={isEditing}
            onChange={(val) => handleChange("firstName", val)}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <InfoField
            label="Last Name"
            value={info.lastName}
            isEditing={isEditing}
            onChange={(val) => handleChange("lastName", val)}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        <div>
          <InfoField
            label="Faculty"
            value={info.faculty}
            isEditing={false} // Usually not editable or requires dropdown
            type="select"
            options={FACULTY_OPTIONS}
            onChange={(val) => handleChange("faculty", val)}
          />
        </div>

        <div>
          <InfoField
            label="College"
            value={info.college}
            isEditing={false}
            type="select"
            options={UNI_OPTIONS}
            onChange={(val) => handleChange("college", val)}
          />
        </div>

        <div>
          <InfoField
            label="Gender"
            value={info.gender}
            isEditing={false}
            type="select"
            options={GENDER_OPTIONS}
            onChange={(val) => handleChange("gender", val)}
          />
        </div>

        <div>
          <InfoField
            label="Current GPA"
            value={info.gpa}
            isEditing={isEditing}
            type="number"
            onChange={(val) => handleChange("gpa", val)}
          />
          {errors.gpa && (
            <p className="text-red-500 text-xs mt-1">{errors.gpa}</p>
          )}
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Academic Goals
          </label>
          {isEditing ? (
            <textarea
              value={info.goals}
              onChange={(e) => handleChange("goals", e.target.value)}
              className="w-full p-3 bg-slate-50 border border-border-light rounded-lg text-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              rows="3"
            />
          ) : (
            <div className="w-full p-3 bg-slate-50 border border-border-light rounded-lg text-slate-800">
              {info.goals || (
                <span className="text-slate-400 italic">No goals set</span>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-slate-600 font-medium hover:text-primary hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20"
          >
            Save Changes
          </button>
        </div>
      )}
    </section>
  );
};
