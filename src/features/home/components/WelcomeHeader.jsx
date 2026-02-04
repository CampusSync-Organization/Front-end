import { MOCK_USER } from "../../profile/api/mockData";

export default function WelcomeHeader() {
  const name = MOCK_USER?.firstName ?? "there";

  return (
    <div className="py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
        Welcome back, {name}!
      </h1>
      <p className="text-lg text-foreground/70">
        Here's what's happening around campus today.
      </p>
    </div>
  );
}
