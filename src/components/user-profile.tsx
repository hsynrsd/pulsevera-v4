'use client'
import { UserCircle, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { createClient } from '../../supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface UserProfile {
  avatar_url: string | null;
  display_name: string | null;
}

export default function UserProfile() {
    const supabase = createClient()
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)

    useEffect(() => {
      const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('user_profiles')
            .select('avatar_url, display_name')
            .eq('id', user.id)
            .single()
          setProfile(data)
        }
      }
      fetchProfile()
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                    {profile?.avatar_url ? (
                        <Image
                            src={profile.avatar_url}
                            alt="Profile"
                            fill
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <UserCircle className="h-6 w-6" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                {profile?.display_name && (
                    <div className="px-2 py-1.5 text-sm font-medium">
                        {profile.display_name}
                    </div>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={async () => {
                        await supabase.auth.signOut()
                        router.push("/")
                    }}
                >
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}