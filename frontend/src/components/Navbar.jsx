import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { ShieldCheck, LayoutDashboard, FileText, CheckCircle } from "lucide-react";

export default function Navbar() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between p-4">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Insure<span className="text-blue-600 dark:text-blue-400">Now</span>
          </span>
        </Link>

        {/* Links */}
        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[rgb(var(--muted-foreground))]">

              <Link to="/" className="hover:text-blue-500 flex items-center gap-2 transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Plans
              </Link>

              <Link to="/policies" className="hover:text-blue-500 flex items-center gap-2 transition-colors">
                <FileText className="w-4 h-4" /> My Policies
              </Link>

              <Link to="/claims" className="hover:text-blue-500 flex items-center gap-2 transition-colors">
                <CheckCircle className="w-4 h-4" /> Claims
              </Link>

              
              {user.role === "admin" && (
                <Link to="/admin" className="text-amber-600 dark:text-amber-400 font-semibold hover:opacity-80">
                  Admin Panel
                </Link>
              )}
            </div>

            <div className="h-4 w-px bg-[rgb(var(--border))]" />

            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login"><Button variant="ghost">Login</Button></Link>
            <Link to="/signup"><Button>Get Started</Button></Link>
          </div>
        )}

      </div>
    </nav>
  );
}