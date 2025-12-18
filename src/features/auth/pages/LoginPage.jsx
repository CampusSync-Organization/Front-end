function LoginPage({ onNavigateToSignUp }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hook up real login logic
    console.log("Login submitted");
  };

  const handleReset = () => {
    document.getElementById("login-form")?.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        <div className="pt-8 pb-6 px-8">
          <h2 className="text-center text-2xl font-semibold text-[#14213D]">
            Login to Your Account
          </h2>
        </div>

        <div className="px-8 pb-8">
          <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#14213D]"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="yourname@example.com"
                required
                className="w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-[#14213D]/20 focus:border-[#14213D]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#14213D]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-[#14213D]/20 focus:border-[#14213D]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 h-12 rounded-xl bg-[#14213D] text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Login
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex-1 h-12 rounded-xl border-2 border-[#14213D] text-[#14213D] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Reset
              </button>
            </div>

            {/* Footer */}
            <div className="pt-6 space-y-3 text-center text-sm text-[#14213D]">
              <button
                type="button"
                className="block w-full hover:underline hover:opacity-80"
              >
                Forgot Password?
              </button>

              <div>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="underline hover:opacity-80"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
