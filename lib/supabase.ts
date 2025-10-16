import {
  createBrowserClient as createBrowserClientSSR,
  createServerClient as createServerClientSSR,
} from "@supabase/ssr"

export function createBrowserClient() {
  return createBrowserClientSSR(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export async function createServerClient() {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()

  return createServerClientSSR(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Ignore cookie setting errors in client components
          console.warn("Cookie setting failed:", error)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // Ignore cookie removal errors in client components
          console.warn("Cookie removal failed:", error)
        }
      },
    },
  })
}

let supabaseClient: ReturnType<typeof createBrowserClientSSR> | null = null

export function getSupabase() {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createBrowserClientSSR(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  return supabaseClient
}
