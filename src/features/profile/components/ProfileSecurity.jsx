import React, { useState } from "react";
import { Shield, Lock, LogOut } from "lucide-react";

export const ProfileSecurity = () => {
  const [isChanging, setIsChanging] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    setIsChanging(false);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <section className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-primary">
        <Shield className="text-secondary" size={24} /> Security
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-border-light">
        <div className="mb-4 sm:mb-0">
          <p className="font-bold text-primary">Password</p>
          <p className="text-xs text-slate-500">Last changed 3 months ago</p>
        </div>
        {!isChanging ? (
          <button
            onClick={() => setIsChanging(true)}
            className="px-5 py-2 bg-white border border-border-light text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Change Password
          </button>
        ) : (
          <div className="w-full">
            {/* Expanded form handled below/inline for simplicity or separate if complex */}
          </div>
        )}
      </div>

      {isChanging && (
        <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-border-light">
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="current"
                value={passwords.current}
                onChange={handleChange}
                className="w-full p-3 bg-white rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                name="new"
                value={passwords.new}
                onChange={handleChange}
                className="w-full p-3 bg-white rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm"
                value={passwords.confirm}
                onChange={handleChange}
                className="w-full p-3 bg-white rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsChanging(false)}
                className="text-slate-600 hover:text-primary font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-secondary text-primary px-4 py-2 rounded-lg font-bold text-sm"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Lock size={14} /> 2FA Enabled
        </span>
        <button className="flex items-center gap-1 text-red-500 font-semibold cursor-pointer hover:underline">
          <LogOut size={14} /> Log out of all sessions
        </button>
      </div>
    </section>
  );
};
