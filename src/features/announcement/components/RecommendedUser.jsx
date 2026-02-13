
export default function RecommendedUser({ logo, name, title }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {logo}
                </div>
                <div>
                    <p className="text-sm font-bold text-foreground"> {name}</p>
                    <p className="text-[11px] text-slate-500">{title}</p>
                </div>
            </div>
            <button className="text-xs font-bold px-3 py-1.5 border border-primary rounded-full hover:bg-primary hover:text-white transition-all text-primary">
                Connect
            </button>
        </div>);

}
