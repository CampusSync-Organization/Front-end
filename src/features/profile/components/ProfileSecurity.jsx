import SecurityComponent from "./SecurityComponnent";

export const ProfileSecurity = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-slate-900 text-xl font-bold font-['Inter']">
          Security
        </h2>
      </div>

      <SecurityComponent></SecurityComponent>
    </div>
  );
};
