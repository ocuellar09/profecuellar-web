"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  open: boolean
  onClose: () => void
  onSendCode: (email: string) => Promise<void>
  onVerifyCode: (email: string, code: string) => Promise<void>
  isLoading: boolean
  error: string | null
  headline?: string
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export default function SaveProgressModal({
  open,
  onClose,
  onSendCode,
  onVerifyCode,
  isLoading,
  error,
  headline = "Guarda tu progreso",
}: Props) {
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")

  const emailOk = useMemo(() => isValidEmail(email), [email])
  const codeOk = useMemo(() => /^[0-9]{6}$/.test(code.trim()), [code])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <button
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
        <div className="border-b border-white/10 bg-white/5 px-5 py-4">
          <p className="text-sm font-semibold text-white">{headline}</p>
          <p className="mt-1 text-xs text-slate-300">
            Escribe tu correo y te enviamos un código para guardar tu avance y continuar en cualquier dispositivo.
          </p>
        </div>

        <div className="px-5 py-4">
          {step === "email" ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Correo
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  autoComplete="email"
                />
              </label>

              {error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                  Ahora no
                </Button>
                <Button
                  onClick={async () => {
                    await onSendCode(email.trim())
                    setStep("code")
                  }}
                  disabled={!emailOk || isLoading}
                >
                  Enviar código
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Te enviamos un código de 6 dígitos a <span className="font-semibold text-white">{email}</span>.
              </p>

              <label className="block text-xs font-semibold text-slate-300">
                Código
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  inputMode="numeric"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </label>

              {error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep("email")
                    setCode("")
                  }}
                  disabled={isLoading}
                >
                  Cambiar correo
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onSendCode(email.trim())}
                    disabled={!emailOk || isLoading}
                  >
                    Reenviar
                  </Button>
                  <Button
                    onClick={() => onVerifyCode(email.trim(), code.trim())}
                    disabled={!emailOk || !codeOk || isLoading}
                  >
                    Verificar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
