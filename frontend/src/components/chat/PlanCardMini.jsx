import { useNavigate } from "react-router-dom";

export default function PlanCardMini({ plan }) {
  const navigate = useNavigate();

  return (
    <div className="min-w-[280px] sm:min-w-[320px] w-full p-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm">
      
      <h3 className="font-semibold text-base mb-3 text-[rgb(var(--text))]">
        {plan.title || "Insurance Plan"}
      </h3>

      {/* THE FIX: Changed from stacked paragraphs to a side-by-side flex row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        
        <div className="flex flex-col">
          <span className="text-[10px] text-[rgb(var(--muted-foreground))] uppercase tracking-wider font-semibold">
            Premium
          </span>
          <span className="text-sm font-medium text-[rgb(var(--text))]">
            ₹{plan.price || "N/A"}
          </span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[10px] text-[rgb(var(--muted-foreground))] uppercase tracking-wider font-semibold">
            Coverage
          </span>
          <span className="text-sm font-medium text-[rgb(var(--text))]">
            ₹{plan.coverage || "N/A"}
          </span>
        </div>

      </div>

      <button
        onClick={() => navigate(plan.action)}
        className="mt-1 w-full text-sm font-medium bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Plan
      </button>
    </div>
  );
}