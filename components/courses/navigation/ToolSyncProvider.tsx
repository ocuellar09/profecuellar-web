"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useCourseProgress } from "@/components/courses/navigation/CourseProgressProvider"
import { COURSE_SLUG } from "@/lib/courseNavigation"
import { TOOL_KEYS, type ToolKey } from "@/lib/toolKeys"

const SYNC_DELAY_MS = 450

type ToolSyncContextValue = {
  remoteData: Map<ToolKey, unknown>
  isRemoteReady: boolean
  syncTool: (toolKey: ToolKey, data: unknown) => void
}

const ToolSyncContext = createContext<ToolSyncContextValue | null>(null)

export function ToolSyncProvider({ children }: { children: ReactNode }) {
  const { userId, isAuthenticated } = useCourseProgress()

  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient()
    } catch {
      return null
    }
  }, [])

  const [remoteData, setRemoteData] = useState<Map<ToolKey, unknown>>(
    () => new Map(),
  )
  const [isRemoteReady, setIsRemoteReady] = useState(false)
  const syncTimers = useRef(new Map<ToolKey, ReturnType<typeof setTimeout>>())
  const prevAuthRef = useRef(false)

  // Bootstrap: fetch all tool_progress rows for authenticated user
  useEffect(() => {
    if (!supabase || !userId || !isAuthenticated) {
      setIsRemoteReady(true)
      return
    }

    let cancelled = false
    const fetchRemote = async () => {
      try {
        const { data: rows } = await supabase
          .from("tool_progress")
          .select("tool_key, data")
          .eq("user_id", userId)
          .eq("course_slug", COURSE_SLUG)

        if (cancelled) return

        const map = new Map<ToolKey, unknown>()
        for (const row of rows ?? []) {
          if (row.tool_key in TOOL_KEYS) {
            map.set(row.tool_key as ToolKey, row.data)
          }
        }
        setRemoteData(map)
      } catch {
        // Silent fail — local data remains
      }
      if (!cancelled) setIsRemoteReady(true)
    }

    fetchRemote()
    return () => {
      cancelled = true
    }
  }, [supabase, userId, isAuthenticated])

  // Push all localStorage tool data to Supabase on auth transition
  useEffect(() => {
    if (!prevAuthRef.current && isAuthenticated && userId && supabase) {
      const pushAll = async () => {
        const now = new Date().toISOString()
        const rows: Array<{
          user_id: string
          course_slug: string
          tool_key: string
          data: unknown
          updated_at: string
        }> = []

        for (const [toolKey, lsKey] of Object.entries(TOOL_KEYS)) {
          try {
            const raw = localStorage.getItem(lsKey)
            if (raw) {
              rows.push({
                user_id: userId,
                course_slug: COURSE_SLUG,
                tool_key: toolKey,
                data: JSON.parse(raw),
                updated_at: now,
              })
            }
          } catch {
            // skip corrupt entries
          }
        }

        if (rows.length > 0) {
          try {
            await supabase
              .from("tool_progress")
              .upsert(rows, { onConflict: "user_id,course_slug,tool_key" })
          } catch {
            // Silent fail
          }
        }
      }
      pushAll()
    }
    prevAuthRef.current = isAuthenticated
  }, [isAuthenticated, userId, supabase])

  // Debounced per-tool sync
  const syncTool = useCallback(
    (toolKey: ToolKey, data: unknown) => {
      if (!supabase || !userId || !isAuthenticated) return

      const existing = syncTimers.current.get(toolKey)
      if (existing) clearTimeout(existing)

      syncTimers.current.set(
        toolKey,
        setTimeout(async () => {
          try {
            await supabase.from("tool_progress").upsert(
              {
                user_id: userId,
                course_slug: COURSE_SLUG,
                tool_key: toolKey,
                data,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id,course_slug,tool_key" },
            )
          } catch {
            // Silent fail, same pattern as CourseProgressProvider
          }
        }, SYNC_DELAY_MS),
      )
    },
    [supabase, userId, isAuthenticated],
  )

  const value = useMemo<ToolSyncContextValue>(
    () => ({ remoteData, isRemoteReady, syncTool }),
    [remoteData, isRemoteReady, syncTool],
  )

  return (
    <ToolSyncContext.Provider value={value}>
      {children}
    </ToolSyncContext.Provider>
  )
}

const NOOP_SYNC: ToolSyncContextValue = {
  remoteData: new Map(),
  isRemoteReady: true,
  syncTool: () => {},
}

export function useToolSync(): ToolSyncContextValue {
  const context = useContext(ToolSyncContext)
  // Gracefully degrade outside ToolSyncProvider (e.g. /cursos/[slug] showcase)
  return context ?? NOOP_SYNC
}
