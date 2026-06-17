import React from "react";
import { Outlet } from "react-router-dom";
import WelcomeHeader from "../components/WelcomeHeader";
import Sidebar from "../components/Sidebar";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <WelcomeHeader />
                        <Outlet />
                    </div>
                    <div className="hidden lg:block lg:col-span-4">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
