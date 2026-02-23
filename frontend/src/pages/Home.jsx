import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Car, Bike, Plane, Users, Shield, ArrowRight } from "lucide-react";

const types = [
  { name: "Health", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Car", icon: Car, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Two Wheeler", icon: Bike, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Life", icon: Shield, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { name: "Travel", icon: Plane, color: "text-sky-500", bg: "bg-sky-500/10" },
  { name: "Family", icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" }
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center">

      {/* Hero Header */}
      <div className="text-center mb-16 space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide mb-2"
        >
          TRUSTED BY MILLIONS
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Insurance made <span className="text-gradient">seamless.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[rgb(var(--muted-foreground))] max-w-2xl mx-auto"
        >
          Compare plans, calculate premiums, and manage claims. 
          Paperless, Instant, and Designed for You
        </motion.p>
      </div>

      {/* Insurance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map((t, i) => (
          <Link 
            key={t.name} 
            to={`/plans?type=${t.name} Insurance`} 
            className="block"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative overflow-hidden h-48 rounded-3xl glass-card p-6 flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-blue-500/30"
            >
              {/* Left Content */}
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl ${t.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <t.icon className={`w-6 h-6 ${t.color}`} />
                </div>
                <h3 className="text-2xl font-bold">{t.name}</h3>
                <p className="text-sm font-medium text-[rgb(var(--muted-foreground))] flex items-center gap-1 mt-1 group-hover:text-blue-500 transition-colors">
                  View Plans <ArrowRight className="w-4 h-4" />
                </p>
              </div>

              {/* Right Faded Vector (Visual Only) */}
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <t.icon className={`w-40 h-40 ${t.color}`} />
              </div>
              
              {/* Gradient Mask for fade effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[rgb(var(--card))] opacity-10 pointer-events-none" />
            </motion.div>
          </Link>
        ))}
      </div>

    </div>
  );
}
