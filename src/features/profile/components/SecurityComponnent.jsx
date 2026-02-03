import React, { useState } from "react";

const SecurityComponent = ()=> {
      const [isChanging, setIsChanging] = useState(false);
      const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
      });

      const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
      };

      const handeSave = () => {
        // Validation logic would go here
        if (passwords.new !== passwords.confirm) {
          alert("New passwords do not match!");
          return;
        }
        console.log("Password changed");
        setIsChanging(false);
        setPasswords({ current: "", new: "", confirm: "" });
      };

    return (

    <div className="border-t border-neutral-100 pt-6">
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <h3 className="text-slate-800 text-base font-semibold">Password</h3>
        {!isChanging && (
          <p className="text-slate-500 text-sm mt-1">
            Last changed 3 months ago
          </p>
        )}
                </div>


      {!isChanging ? (
        <button
          onClick={() => setIsChanging(true)}
          className="px-5 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm"
        >
          Change Password
        </button>
      ) : (
        <div className="w-full md:w-2/3 max-w-lg bg-gray-50 rounded-xl p-6 border border-neutral-200">
          <div className="space-y-4">
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="current"
                value={passwords.current}
                onChange={handleChange}
                className="w-full p-3 bg-white rounded-lg border border-neutral-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
                className="w-full p-3 bg-white rounded-lg border border-neutral-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
                className="w-full p-3 bg-white rounded-lg border border-neutral-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsChanging(false)}
              className="px-6 py-2 text-slate-600 font-medium hover:text-slate-800 hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={handeSave}
              className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  </div>);


}
export default SecurityComponent
