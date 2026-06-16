import React, { useCallback, useMemo, useState } from "react";
import { User } from "lucide-react";
import { useEditableSection } from "../hooks/useEditableSection";

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
  const [errors, setErrors] = useState({});

  const initialValues = useMemo(
    () => ({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      faculty: user.faculty || "",
      college: user.college || "",
      gender: user.gender || "",
      gpa: user.gpa ?? "",
      goals: user.goals || "",
    }),
    [
      user.college,
      user.faculty,
      user.firstName,
      user.gender,
      user.goals,
      user.gpa,
      user.lastName,
    ],
  );

  const buildPayload = useCallback((draft, original) => {
    const payload = {};
    const nextName = `${draft.firstName.trim()} ${draft.lastName.trim()}`
      .trim()
      .replace(/\s+/g, " ");
    const originalName = `${original.firstName.trim()} ${original.lastName.trim()}`
      .trim()
      .replace(/\s+/g, " ");
    const nextGpa = draft.gpa === "" ? "" : Number(draft.gpa);
    const originalGpa = original.gpa === "" ? "" : Number(original.gpa);

    if (nextName !== originalName) {
      payload.name = nextName;
    }

    if (nextGpa !== originalGpa) {
      payload.cgpa = nextGpa;
    }

    return payload;
  }, []);

  const {
    draft: info,
    updateDraft,
    isEditing,
    startEdit,
    cancelEdit,
    save,
    isSaving,
    error,
  } = useEditableSection(initialValues, { buildPayload });

  const handleChange = (field, value) => {
    updateDraft({ [field]: value });
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
    const requiredFields = ["firstName", "lastName", "gpa"];

    requiredFields.forEach((field) => {
      if (!info[field] || info[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    const numericGpa = Number(info.gpa);
    if (info.gpa && (Number.isNaN(numericGpa) || numericGpa < 0 || numericGpa > 4)) {
      newErrors.gpa = "GPA must be between 0 and 4.0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      await save();
    }
  };

  const handleCancel = () => {
    cancelEdit();
    setErrors({});
  };

  return (
    <section className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
          <User className="text-secondary" size={24} /> Personal Information
        </h2>
        {!isEditing && isOwnProfile && (
          <button
            onClick={startEdit}
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
            <div className="w-full p-3 bg-slate-50 border border-border-light rounded-lg text-slate-400 italic">
              Goals are not editable yet
            </div>
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
        <div className="mt-8">
          {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2 text-slate-600 font-medium hover:text-primary hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-2 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          </div>
        </div>
      )}
    </section>
  );
};
