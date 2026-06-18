import React from "react";
import { Users, LayoutGrid } from "lucide-react";
import { UserAvatar } from "../../../shared/ui/UserAvatar";

export const UserProfileSidebar = () => {
    return (
        <div className="space-y-6">
            <div className="bg-card-light rounded-2xl p-6 shadow-sm border border-border-light">
                <h3 className="font-bold text-primary mb-6 uppercase text-xs tracking-widest">
                    Public Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl text-center">
                        <p className="text-2xl font-bold text-primary">12</p>
                        <p className="text-xs text-slate-500 uppercase font-bold mt-1">
                            Projects
                        </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl text-center">
                        <p className="text-2xl font-bold text-primary">248</p>
                        <p className="text-xs text-slate-500 uppercase font-bold mt-1">
                            Connections
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-card-light rounded-2xl p-6 shadow-sm border border-border-light">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-primary uppercase text-xs tracking-widest">
                        Mutual Connections
                    </h3>
                    <span className="text-secondary text-[10px] font-bold">
                        14 Mutual
                    </span>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <UserAvatar
                            src="https://placehold.co/40x40"
                            name="Omar Khalid"
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0 text-sm"
                        />
                        <div className="flex-grow min-w-0">
                            <p className="text-sm font-bold truncate text-primary">
                                Omar Khalid
                            </p>
                            <p className="text-[10px] text-slate-500">Engineering Student</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <UserAvatar
                            src="https://placehold.co/40x40"
                            name="Sara Ahmed"
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0 text-sm"
                        />
                        <div className="flex-grow min-w-0">
                            <p className="text-sm font-bold truncate text-primary">
                                Sara Ahmed
                            </p>
                            <p className="text-[10px] text-slate-500">Design Lead</p>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-6 py-3 border border-border-light rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors text-primary">
                    View All
                </button>
            </div>

            <div className="bg-primary text-white rounded-2xl p-6 shadow-lg shadow-primary/20">
                <h3 className="font-bold uppercase text-xs tracking-widest mb-4 opacity-75">
                    Common Communities
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <LayoutGrid size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Tech Innovators</p>
                            <p className="text-[10px] opacity-70">1,200 Members</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <Users size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">AI Research Hub</p>
                            <p className="text-[10px] opacity-70">850 Members</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
