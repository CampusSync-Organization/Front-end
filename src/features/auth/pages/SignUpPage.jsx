import { useState } from "react";
import {
  Check,
  Brain,
  Cpu,
  Code,
  Palette,
  Mic,
  BookOpen,
  Target,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Users,
  Rocket,
  Sparkles,
  Network,
} from "lucide-react";

const personalityCards = [
  {
    id: "creative",
    title: "Creative Thinker",
    tag: "Imaginative",
    image:
      "https://images.unsplash.com/photo-1609619385076-36a873425636?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "problem-solver",
    title: "Problem Solver",
    tag: "Analytical",
    image:
      "https://images.unsplash.com/photo-1758691736843-90f58dce465e?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "leader",
    title: "Leader",
    tag: "Visionary",
    image:
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "researcher",
    title: "Research Oriented",
    tag: "Curious",
    image:
      "https://images.unsplash.com/photo-1475906067486-6c5bd3aa9c9d?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "team-player",
    title: "Team Player",
    tag: "Collaborative",
    image:
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "innovator",
    title: "Innovator",
    tag: "Forward-Thinking",
    image:
      "https://images.unsplash.com/photo-1496096265110-f83ad7f96608?auto=format&fit=crop&w=1080&q=80",
  },
];

const interestMiniCards = [
  { id: "ai", label: "AI", icon: Brain },
  { id: "robotics", label: "Robotics", icon: Cpu },
  { id: "coding", label: "Coding", icon: Code },
  { id: "design", label: "Design", icon: Palette },
  { id: "public-speaking", label: "Public Speaking", icon: Mic },
  { id: "research", label: "Research", icon: BookOpen },
  { id: "leadership", label: "Leadership", icon: Target },
  { id: "machine-learning", label: "Machine Learning", icon: Network },
  { id: "soft-skills", label: "Soft Skills", icon: Users },
  { id: "data-analysis", label: "Data Analysis", icon: BarChart3 },
  { id: "creativity", label: "Creativity", icon: Lightbulb },
  { id: "entrepreneurship", label: "Entrepreneurship", icon: Rocket },
  { id: "innovation", label: "Innovation", icon: Sparkles },
  { id: "problem-solving", label: "Problem Solving", icon: TrendingUp },
];

function SignUpPage({ onNavigateToLogin }) {
  const [selectedPersonality, setSelectedPersonality] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    document.getElementById("signup-form")?.reset();
    setSelectedPersonality(null);
    setSelectedInterests([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-center text-[#14213D]">
          Create an Account
        </h2>

        <form
          id="signup-form"
          onSubmit={handleSubmit}
          className="space-y-6 mt-6"
        >
          {/* Basic Fields */}
          <div className="grid md:grid-cols-2 gap-5">
            <input placeholder="Full Name" className="input" />
            <input placeholder="Email" type="email" className="input" />
            <input placeholder="Password" type="password" className="input" />
            <input
              placeholder="Confirm Password"
              type="password"
              className="input"
            />
            <input placeholder="Phone Number" className="input" />
            <input
              placeholder="CGPA"
              type="number"
              step="0.01"
              className="input"
            />
          </div>

          {/* Personality */}
          <div className="space-y-3">
            <p className="font-medium text-[#14213D]">Personality Type</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {personalityCards.map((card) => {
                const active = selectedPersonality === card.id;
                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedPersonality(card.id)}
                    className={`cursor-pointer rounded-xl border-2 transition-transform hover:scale-[1.03] ${
                      active ? "border-[#14213D]" : "border-transparent"
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-32 w-full object-cover rounded-t-xl"
                    />
                    <div className="p-3 text-center text-[#14213D]">
                      {card.title}
                    </div>
                    {active && (
                      <div className="absolute top-2 left-2 bg-[#14213D] w-6 h-6 rounded-full flex items-center justify-center">
                        <Check className="text-white w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <p className="font-medium text-[#14213D]">Interests</p>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {interestMiniCards.map((item) => {
                const Icon = item.icon;
                const active = selectedInterests.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`cursor-pointer rounded-lg border p-3 text-center transition-transform hover:scale-[1.05] ${
                      active ? "border-[#14213D]" : "border-gray-200"
                    }`}
                  >
                    <Icon
                      className="mx-auto mb-1"
                      style={{ color: active ? "#14213D" : "#6b7280" }}
                    />
                    <span className="text-xs text-[#14213D]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-[#14213D] text-white rounded-xl h-12"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 border-2 border-[#14213D] text-[#14213D] rounded-xl h-12"
            >
              Reset
            </button>
          </div>

          <p className="text-center text-sm text-[#14213D]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
