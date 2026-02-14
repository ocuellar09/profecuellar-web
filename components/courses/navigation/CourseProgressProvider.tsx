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
import { usePathname } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import SaveProgressModal from "@/components/courses/auth/SaveProgressModal"
import {
  COURSE_SLUG,
  COURSE_HOME_HREF,
  COURSE_MODULE_ROUTES,
  getModuleByPath,
} from "@/lib/courseNavigation"

type CourseProgressContextValue = {
  isReady: boolean
  completedRoutes: string[]
  lastVisitedRoute: string | null
  completedCount: number
  totalCount: number
  progressPercent: number
  continueRoute: string
  nextSuggestedRoute: string | null
  isAuthenticated: boolean
  userId: string | null
  openSaveProgress: () => void
  markComplete: (route: string) => void
  markIncomplete: (route: string) => void
  isComplete: (route: string) => boolean
}

type StoredProgress = {
  completedRoutes: string[]
  lastVisitedRoute: string | null
}

const STORAGE_KEY = "profecuellar:prompt-course-progress:v1"
const SYNC_DELAY_MS = 450
const SAVE_CHECKPOINT_PERCENT = 30

const CourseProgressContext = createContext<CourseProgressContextValue | null>(null)

export function CourseProgressProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient()
    } catch {
      return null
    }
  }, [])
  const isHydratingRef = useRef(true)
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [completedRoutes, setCompletedRoutes] = useState<string[]>([])
  const [lastVisitedRoute, setLastVisitedRoute] = useState<string | null>(null)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const sanitizeCompleted = useCallback((routes: string[]) => {
    return Array.from(new Set(routes.filter((route) => COURSE_MODULE_ROUTES.includes(route))))
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as StoredProgress
        const safeCompleted = sanitizeCompleted(parsed.completedRoutes ?? [])
        const safeLast = parsed.lastVisitedRoute ?? null
        setCompletedRoutes(safeCompleted)
        setLastVisitedRoute(safeLast)
      }
    } catch {
      // If parsing fails, start with a clean state.
    }
  }, [sanitizeCompleted])

  useEffect(() => {
    if (!supabase) {
      isHydratingRef.current = false
      setIsReady(true)
      return
    }

    const bootstrap = async () => {
      try {
        const userResult = await supabase.auth.getUser()
        const sessionUser = userResult.data.user ?? null
        setUserId(sessionUser?.id ?? null)
        setIsAuthenticated(!!sessionUser)

        if (!sessionUser) return

        const [{ data: lessonRows }, { data: snapshotRows }] = await Promise.all([
          supabase
            .from("lesson_progress")
            .select("route,status")
            .eq("user_id", sessionUser.id)
            .eq("course_slug", COURSE_SLUG),
          supabase
            .from("course_progress_snapshots")
            .select("last_route")
            .eq("user_id", sessionUser.id)
            .eq("course_slug", COURSE_SLUG)
            .limit(1),
        ])

        const remoteCompleted = sanitizeCompleted(
          (lessonRows ?? [])
            .filter((row) => row.status === "completed")
            .map((row) => row.route ?? ""),
        )
        const remoteLastRoute = snapshotRows?.[0]?.last_route ?? null

        // Remote wins, but never delete local progress if remote is empty.
        if (remoteCompleted.length > 0) setCompletedRoutes(remoteCompleted)
        if (remoteLastRoute) setLastVisitedRoute(remoteLastRoute)
      } catch {
        // If remote bootstrap fails, keep local mode alive.
      } finally {
        isHydratingRef.current = false
        setIsReady(true)
      }
    }

    void bootstrap()
  }, [supabase, sanitizeCompleted])

  useEffect(() => {
    if (!supabase) return
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUserId(u?.id ?? null)
      setIsAuthenticated(!!u)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    if (!isReady) return
    const data: StoredProgress = { completedRoutes, lastVisitedRoute }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [isReady, completedRoutes, lastVisitedRoute])

  useEffect(() => {
    if (!isReady) return
    if (!pathname.startsWith(COURSE_HOME_HREF)) return
    setLastVisitedRoute(pathname)
  }, [isReady, pathname])

  useEffect(() => {
    if (!isReady || !supabase || !userId || !isAuthenticated || isHydratingRef.current) return

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(() => {
      const persist = async () => {
        const now = new Date().toISOString()
        const lessonRows = COURSE_MODULE_ROUTES.map((route) => ({
          user_id: userId,
          course_slug: COURSE_SLUG,
          lesson_id: route,
          route,
          status: completedRoutes.includes(route) ? "completed" : "pending",
          completed_at: completedRoutes.includes(route) ? now : null,
          updated_at: now,
        }))

        const snapshot = {
          user_id: userId,
          course_slug: COURSE_SLUG,
          percent:
            COURSE_MODULE_ROUTES.length > 0
              ? Math.round((completedRoutes.length / COURSE_MODULE_ROUTES.length) * 100)
              : 0,
          completed_count: completedRoutes.length,
          total_count: COURSE_MODULE_ROUTES.length,
          last_route: lastVisitedRoute,
          updated_at: now,
        }

        try {
          await Promise.all([
            supabase
              .from("course_enrollments")
              .upsert(
                { user_id: userId, course_slug: COURSE_SLUG, source: "free", updated_at: now },
                { onConflict: "user_id,course_slug" },
              ),
            supabase
              .from("lesson_progress")
              .upsert(lessonRows, { onConflict: "user_id,course_slug,lesson_id" }),
            supabase
              .from("course_progress_snapshots")
              .upsert(snapshot, { onConflict: "user_id,course_slug" }),
          ])
        } catch {
          // Keep UX smooth if backend is temporarily unavailable.
        }
      }

      void persist()
    }, SYNC_DELAY_MS)

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [isReady, supabase, userId, completedRoutes, lastVisitedRoute])

  const markComplete = useCallback((route: string) => {
    if (!COURSE_MODULE_ROUTES.includes(route)) return
    setCompletedRoutes((current) =>
      current.includes(route) ? current : [...current, route],
    )
  }, [])

  const markIncomplete = useCallback((route: string) => {
    setCompletedRoutes((current) => current.filter((item) => item !== route))
  }, [])

  const isComplete = useCallback(
    (route: string) => completedRoutes.includes(route),
    [completedRoutes],
  )

  const completedCount = completedRoutes.length
  const totalCount = COURSE_MODULE_ROUTES.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  useEffect(() => {
    if (!isReady) return
    if (isAuthenticated) return
    if (saveModalOpen) return
    if (progressPercent < SAVE_CHECKPOINT_PERCENT) return

    // Soft gate: prompt to save progress after meaningful investment.
    setSaveModalOpen(true)
  }, [isReady, isAuthenticated, saveModalOpen, progressPercent])

  const nextSuggestedRoute = useMemo(
    () => COURSE_MODULE_ROUTES.find((route) => !completedRoutes.includes(route)) ?? null,
    [completedRoutes],
  )

  const continueRoute = useMemo(() => {
    if (lastVisitedRoute && getModuleByPath(lastVisitedRoute)) return lastVisitedRoute
    if (nextSuggestedRoute) return nextSuggestedRoute
    return COURSE_MODULE_ROUTES[0] ?? COURSE_HOME_HREF
  }, [lastVisitedRoute, nextSuggestedRoute])

  const pushLocalProgressToRemote = useCallback(
    async (uid: string) => {
      if (!supabase) return
      const now = new Date().toISOString()
      const lessonRows = COURSE_MODULE_ROUTES.map((route) => ({
        user_id: uid,
        course_slug: COURSE_SLUG,
        lesson_id: route,
        route,
        status: completedRoutes.includes(route) ? "completed" : "pending",
        completed_at: completedRoutes.includes(route) ? now : null,
        updated_at: now,
      }))

      const snapshot = {
        user_id: uid,
        course_slug: COURSE_SLUG,
        percent:
          COURSE_MODULE_ROUTES.length > 0
            ? Math.round((completedRoutes.length / COURSE_MODULE_ROUTES.length) * 100)
            : 0,
        completed_count: completedRoutes.length,
        total_count: COURSE_MODULE_ROUTES.length,
        last_route: lastVisitedRoute,
        updated_at: now,
      }

      await Promise.all([
        supabase
          .from("course_enrollments")
          .upsert(
            { user_id: uid, course_slug: COURSE_SLUG, source: "free", updated_at: now },
            { onConflict: "user_id,course_slug" },
          ),
        supabase
          .from("lesson_progress")
          .upsert(lessonRows, { onConflict: "user_id,course_slug,lesson_id" }),
        supabase
          .from("course_progress_snapshots")
          .upsert(snapshot, { onConflict: "user_id,course_slug" }),
      ])
    },
    [supabase, completedRoutes, lastVisitedRoute],
  )

  const sendCode = useCallback(
    async (email: string) => {
      if (!supabase) return
      setAuthError(null)
      setAuthLoading(true)
      try {
        const redirectTo =
          process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") + "/curso" ||
          (typeof window !== "undefined" ? `${window.location.origin}/curso` : undefined)

        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectTo,
          },
        })
        if (error) throw error
      } catch (e) {
        setAuthError("No se pudo enviar el código. Revisa el correo e inténtalo de nuevo.")
      } finally {
        setAuthLoading(false)
      }
    },
    [supabase],
  )

  const verifyCode = useCallback(
    async (email: string, code: string) => {
      if (!supabase) return
      setAuthError(null)
      setAuthLoading(true)
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: code,
          type: "email",
        })
        if (error) throw error
        const uid = data.user?.id
        if (uid) {
          await pushLocalProgressToRemote(uid)
          setSaveModalOpen(false)
        }
      } catch {
        setAuthError("El código no es válido o expiró. Intenta reenviar y verifica de nuevo.")
      } finally {
        setAuthLoading(false)
      }
    },
    [supabase, pushLocalProgressToRemote],
  )

  const value = useMemo<CourseProgressContextValue>(
    () => ({
      isReady,
      completedRoutes,
      lastVisitedRoute,
      completedCount,
      totalCount,
      progressPercent,
      continueRoute,
      nextSuggestedRoute,
      isAuthenticated,
      userId,
      openSaveProgress: () => setSaveModalOpen(true),
      markComplete,
      markIncomplete,
      isComplete,
    }),
    [
      isReady,
      completedRoutes,
      lastVisitedRoute,
      completedCount,
      totalCount,
      progressPercent,
      continueRoute,
      nextSuggestedRoute,
      isAuthenticated,
      userId,
      markComplete,
      markIncomplete,
      isComplete,
    ],
  )

  return (
    <CourseProgressContext.Provider value={value}>
      {children}
      <SaveProgressModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSendCode={sendCode}
        onVerifyCode={verifyCode}
        isLoading={authLoading}
        error={authError}
      />
    </CourseProgressContext.Provider>
  )
}

export function useCourseProgress() {
  const context = useContext(CourseProgressContext)
  if (!context) {
    throw new Error("useCourseProgress must be used within CourseProgressProvider")
  }
  return context
}
