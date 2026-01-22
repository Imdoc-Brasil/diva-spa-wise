import { motion } from "framer-motion"
import { ReactNode } from "react"

interface MotionPageProps {
    children: ReactNode;
    className?: string;
}

const variants: any = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
}

export function MotionPage({ children, className }: MotionPageProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    )
}
