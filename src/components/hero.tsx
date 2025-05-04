import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  MessageSquare,
  Users,
  Moon,
  Zap,
} from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-8 tracking-tight">
              Pulse{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                Together
              </span>{" "}
              in Real-Time
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              A modern, open-source chat platform with channel-based
              communication. Connect with your team, friends, or community in a
              clean, responsive interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
              >
                Join Now
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center px-8 py-4 text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-lg font-medium"
              >
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Real-time messaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Channel-based communication</span>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Dark mode support</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Open-source</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
