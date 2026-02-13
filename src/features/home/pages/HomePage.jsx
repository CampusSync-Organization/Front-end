import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WelcomeHeader from "../components/WelcomeHeader";
import ActivityFeed from "../components/ActivityFeed";
import Sidebar from "../components/Sidebar";
import {
    fetchAnnouncements,
    selectAllAnnouncements,
    selectAnnouncementStatus,
} from "../../announcement/store/announcementSlice";

export default function HomePage() {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllAnnouncements);
    const status = useSelector(selectAnnouncementStatus);
    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchAnnouncements());
        }
    }, [status, dispatch]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <WelcomeHeader />
                        <ActivityFeed posts={posts} />
                    </div>
                    <div className="hidden lg:block lg:col-span-4">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
