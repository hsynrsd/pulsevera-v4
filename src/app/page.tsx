import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  MessageSquare,
  Users,
  Moon,
  Zap,
  Shield,
  Hash,
  Globe,
} from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Modern Chat Experience</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A feature-rich messaging platform designed for teams, communities,
              and friends.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Real-time Messaging",
                description: "Instant message delivery with typing indicators",
              },
              {
                icon: <Hash className="w-6 h-6" />,
                title: "Channel System",
                description: "Organize conversations by topic or team",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure Communication",
                description: "End-to-end encryption for your privacy",
              },
              {
                icon: <Moon className="w-6 h-6" />,
                title: "Dark Mode",
                description: "Easy on the eyes, day or night",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-indigo-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80"
                    alt="Chat Application Interface"
                    width={800}
                    height={450}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">
                Designed for Productivity
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      Team Collaboration
                    </h3>
                    <p className="text-gray-600">
                      Create channels for different teams, projects, or topics.
                      Keep conversations organized and accessible.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Globe className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Open Source</h3>
                    <p className="text-gray-600">
                      Built with transparency and community in mind. Contribute
                      to the project or customize it for your needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      Lightning Fast
                    </h3>
                    <p className="text-gray-600">
                      Built on modern technologies for optimal performance.
                      Messages are delivered instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-indigo-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5K+</div>
              <div className="text-indigo-100">Active Channels</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-indigo-100">Uptime Guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. Support our open-source
              project.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of team communication with our real-time
            messaging platform.
          </p>
          <a
            href="/sign-up"
            className="inline-flex items-center px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Your Account
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
