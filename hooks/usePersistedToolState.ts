"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useToolSync } from "@/components/courses/navigation/ToolSyncProvider"
import { TOOL_KEYS, type ToolKey } from "@/lib/toolKeys"

export function usePersistedToolState<T>(
  toolKey: ToolKey,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const lsKey = TOOL_KEYS[toolKey]
  const { remoteData, isRemoteReady, syncTool } = useToolSync()
  const hasHydratedRemoteRef = useRef(false)
  const isInitialMountRef = useRef(true)

  // 1. Initialize from localStorage (SSR-safe)
  const [state, setStateRaw] = useState<T>(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem(lsKey) : null
      if (raw) return JSON.parse(raw) as T
    } catch {
      // corrupt data — fall through to default
    }
    return defaultValue
  })

  // 2. Once remote data arrives, override local if remote exists
  useEffect(() => {
    if (!isRemoteReady || hasHydratedRemoteRef.current) return
    hasHydratedRemoteRef.current = true

    const remote = remoteData.get(toolKey)
    if (remote !== undefined) {
      setStateRaw(remote as T)
    }
  }, [isRemoteReady, remoteData, toolKey])

  // 3. Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(lsKey, JSON.stringify(state))
    } catch {
      // quota exceeded or private browsing
    }
  }, [lsKey, state])

  // 4. Sync to Supabase (debounced) — skip the initial mount
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      return
    }
    if (!isRemoteReady) return
    syncTool(toolKey, state)
  }, [state, toolKey, syncTool, isRemoteReady])

  // 5. Stable setter
  const setState = useCallback((value: T | ((prev: T) => T)) => {
    setStateRaw(value)
  }, [])

  return [state, setState]
}
