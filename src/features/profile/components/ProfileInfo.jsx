import React, { useState } from "react";

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
  <div className="w-full">
    <div className="text-slate-500 text-sm font-semibold mb-2">{label}</div>
    <div
      className={`w-full p-4 bg-white rounded-xl border ${
        isEditing ? "border-amber-400" : "border-neutral-200"
      } shadow-sm transition-colors`}
    >
      {isEditing ? (
        type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-slate-900 text-base font-medium font-['Inter'] cursor-pointer"
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
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-slate-900 text-base font-medium font-['Inter']"
            placeholder={`Enter ${label}`}
            step={type === "number" ? "0.01" : undefined}
            min={type === "number" ? "0" : undefined}
            max={type === "number" ? "4" : undefined}
          />
        )
      ) : (
        <div className="text-slate-900 text-base font-medium font-['Inter'] line-clamp-1">
          {value || <span className="text-slate-400 italic">Not set</span>}
        </div>
      )}
    </div>
  </div>
);

export const ProfileInfo = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState(user);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
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
      "email",
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
    } else {
      alert("Please fix the errors before saving.");
    }
  };

  const handleCancel = () => {
    setInfo(user);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-slate-900 text-xl font-bold font-['Inter']">
          Personal Information
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <InfoField
            label="First Name"
            value={info.firstName}
            isEditing={isEditing}
            onChange={(val) => handleChange("firstName", val)}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>
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
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>
          )}
        </div>

        <div>
          <InfoField
            label="Faculty"
            value={info.faculty}
            isEditing={false}
            type="select"
            options={FACULTY_OPTIONS}
            onChange={(val) => handleChange("faculty", val)}
          />
          {errors.faculty && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.faculty}</p>
          )}
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
          {errors.college && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.college}</p>
          )}
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
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.gender}</p>
          )}
        </div>

        <div>
          <InfoField
            label="GPA"
            value={info.gpa}
            isEditing={isEditing}
            type="number"
            onChange={(val) => handleChange("gpa", val)}
          />
          {errors.gpa && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.gpa}</p>
          )}
        </div>

        {/* Full width item */}
        <div className="md:col-span-2">
          <InfoField
            label="Goals"
            value={info.goals}
            isEditing={isEditing}
            onChange={(val) => handleChange("goals", val)}
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-slate-600 font-medium hover:text-slate-800 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
