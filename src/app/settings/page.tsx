"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@uploadthing/react";
import { createClient } from "../../../supabase/client";
import Image from "next/image";
import { toast } from "sonner";
import type { OurFileRouter } from "../api/uploadthing/core";

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const supabase = createClient();

  const updateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_profiles")
        .update({
          display_name: displayName,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
              />
            </div>

            <div className="space-y-4">
              <Label>Profile Picture</Label>
              {avatarUrl && (
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={avatarUrl}
                    alt="Profile picture"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <UploadButton<OurFileRouter>
                endpoint="profileImage"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setAvatarUrl(res[0].url);
                    toast.success("Profile picture uploaded!");
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Failed to upload: ${error.message}`);
                }}
              />
            </div>

            <div className="space-y-4">
              <Label>Profile Banner</Label>
              {bannerUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={bannerUrl}
                    alt="Profile banner"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <UploadButton<OurFileRouter>
                endpoint="bannerImage"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setBannerUrl(res[0].url);
                    toast.success("Banner uploaded!");
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Failed to upload: ${error.message}`);
                }}
              />
            </div>

            <Button onClick={updateProfile} className="w-full">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 