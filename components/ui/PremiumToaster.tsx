import { Toaster as Sonner } from "sonner"

export function PremiumToaster() {
    return (
        <Sonner
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-slate-900 group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-xl",
                    description: "group-[.toast]:text-slate-400",
                    actionButton: "group-[.toast]:bg-diva-accent group-[.toast]:text-diva-dark group-[.toast]:font-bold",
                    cancelButton: "group-[.toast]:bg-slate-800 group-[.toast]:text-white",
                    success: "group-[.toast]:border-emerald-500/50 group-[.toast]:text-emerald-400",
                    error: "group-[.toast]:border-red-500/50 group-[.toast]:text-red-400",
                    info: "group-[.toast]:border-diva-accent/50 group-[.toast]:text-diva-accent",
                },
            }}
            position="top-right"
        />
    )
}
