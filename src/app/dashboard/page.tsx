import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { InfoIcon, UserCircle, MessageSquare, Hash } from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get recent channels
  const { data: recentChannels } = await supabase
    .from("channels")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Welcome to ChatTogether! Join channels and start messaging in
                real-time.
              </span>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <UserCircle size={48} className="text-indigo-600" />
                  <div>
                    <h2 className="font-semibold text-xl">
                      {user.user_metadata?.full_name || user.email}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/dashboard/channels">View Your Channels</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Channels Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Recent Channels</CardTitle>
              </CardHeader>
              <CardContent>
                {recentChannels && recentChannels.length > 0 ? (
                  <div className="space-y-3">
                    {recentChannels.map((channel) => (
                      <Link
                        key={channel.id}
                        href={`/dashboard/channels/${channel.id}`}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <Hash className="h-5 w-5 text-indigo-500" />
                        <div>
                          <p className="font-medium">{channel.name}</p>
                          {channel.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {channel.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                    <Button asChild variant="outline" className="w-full mt-2">
                      <Link href="/dashboard/channels">View All Channels</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No channels yet</p>
                    <Button asChild>
                      <Link href="/dashboard/channels/new">
                        Create Your First Channel
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/channels/new">
                      Create New Channel
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/channels">Browse Channels</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
