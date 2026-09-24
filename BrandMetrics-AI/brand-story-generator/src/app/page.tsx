import Link from "next/link";
import { Sparkles, Zap, Download, ArrowRight, Shield, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-brand-200/40 dark:bg-brand-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-100/50 dark:bg-brand-950/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] mb-6">
                Create Your Powerful{" "}
                <span className="text-brand-600">Personal Brand Story</span>{" "}
                in Minutes with AI
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                BrandMetrics AI helps you craft a compelling, authentic personal brand story that connects, inspires, and opens doors.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/create" className="btn-primary text-base">
                  Start Creating <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex items-center gap-2 mt-5 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-brand-500" />
                No credit card required · Free to start
              </div>
            </div>

            {/* Decorative card */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-200/30 dark:bg-brand-800/20 rounded-3xl blur-xl" />
                <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-xl w-80">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    <span className="font-semibold text-sm">My Brand Story</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-2.5 bg-brand-100 dark:bg-brand-900/50 rounded-full w-full" />
                    <div className="h-2.5 bg-brand-100 dark:bg-brand-900/50 rounded-full w-5/6" />
                    <div className="h-2.5 bg-brand-100 dark:bg-brand-900/50 rounded-full w-4/5" />
                    <div className="h-2.5 bg-brand-200/60 dark:bg-brand-800/40 rounded-full w-3/4" />
                    <div className="h-2.5 bg-brand-100 dark:bg-brand-900/50 rounded-full w-full mt-4" />
                    <div className="h-2.5 bg-brand-100 dark:bg-brand-900/50 rounded-full w-2/3" />
                  </div>
                  <div className="flex gap-1.5 mt-5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-brand-300 dark:bg-brand-700" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI Magic",
                desc: "Our AI analyzes your experience, values, and goals to craft a unique story that truly represents you.",
              },
              {
                icon: Zap,
                title: "Instant Results",
                desc: "Get a polished, professional brand story in minutes, not hours. Save time and focus on what matters.",
              },
              {
                icon: Download,
                title: "Export Ready",
                desc: "Download your story in multiple formats. Perfect for your website, LinkedIn, pitches, and more.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <f.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">{f.desc}</p>
                <span className="text-sm font-medium text-brand-600 dark:text-brand-400 inline-flex items-center gap-1">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
