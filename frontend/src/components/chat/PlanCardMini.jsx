import { useNavigate } from "react-router-dom";
import { Shield, Wallet, ChevronRight } from "lucide-react";

export default function PlanCardMini({ plan }) {
  const navigate = useNavigate();

  return (
    <div className="group relative p-4 rounded-xl border border-[rgb(var(--border)/0.5)] bg-[rgb(var(--card)/0.6)] backdrop-blur-sm hover:bg-[rgb(var(--card))] hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden">
      
      {/* Decorative top gradient line that appears on hover */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Plan Title */}
      <h3 className="font-semibold text-sm mb-3 text-[rgb(var(--text))]">
        {plan.title || "Insurance Plan"}
      </h3>

      {/* Plan Details */}
      <div className="space-y-2.5 mb-4">
        
        {/* Price Row */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-[rgb(var(--muted-foreground))] uppercase tracking-wider font-semibold">Premium</span>
            <span className="font-medium text-[rgb(var(--text))]">₹{plan.price || "N/A"}</span>
          </div>
        </div>

        {/* Coverage Row */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shrink-0">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-[rgb(var(--muted-foreground))] uppercase tracking-wider font-semibold">Coverage</span>
            <span className="font-medium text-[rgb(var(--text))]">₹{plan.coverage || "N/A"}</span>
          </div>
        </div>

      </div>

      {/* Action Button */}
      <button
        onClick={() => navigate(plan.action || "#")}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-medium bg-[rgb(var(--muted))] text-[rgb(var(--text))] py-2 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors duration-300"
      >
        View Plan
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </div>
  );
}