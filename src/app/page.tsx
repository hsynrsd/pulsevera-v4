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
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Modern Chat Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
                className="p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Experience the Future of Team Communication
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-foreground">
                      Team Collaboration
                    </h3>
                    <p className="text-muted-foreground">
                      Create channels for different teams, projects, or topics.
                      Keep conversations organized and accessible.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-foreground">Open Source</h3>
                    <p className="text-muted-foreground">
                      Built with transparency and community in mind. Contribute
                      to the project or customize it for your needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-foreground">
                      Lightning Fast
                    </h3>
                    <p className="text-muted-foreground">
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

      {/* Pricing Section */}
      <section className="py-24 bg-background" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            {user ? 'Ready to Chat?' : 'Join Our Community Today'}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {user 
              ? 'Your team is waiting for you. Jump back into the conversation.'
              : 'Experience the future of team communication with our real-time messaging platform.'
            }
          </p>
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/sign-up"
              className="inline-flex items-center px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Your Account
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
