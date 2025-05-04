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
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Chat{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Together
              </span>{" "}
              in Real-Time
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              A modern, open-source chat platform with channel-based
              communication. Connect with your team, friends, or community in a
              clean, responsive interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
              >
                Join Now
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                <span>Real-time messaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <span>Channel-based communication</span>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-500" />
                <span>Dark mode support</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-500" />
                <span>Open-source</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
