import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"

/**
 * AnimatedContent component from React Bits (reactbits.dev)
 * Smooth entrance animation wrapper powered by Framer Motion.
 */
export function AnimatedContent({
  children,
  distance = 30,
  direction = "vertical",
  reverse = false,
  config = { tension: 50, friction: 25 },
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  className = "",
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: threshold })

  const directions = {
    vertical: "Y",
    horizontal: "X",
  }

  const axis = directions[direction]
  const offset = reverse ? -distance : distance

  return (
    <motion.div
      ref={ref}
      initial={{
        [axis === "Y" ? "y" : "x"]: offset,
        opacity: animateOpacity ? initialOpacity : 1,
        scale: scale !== 1 ? 0.95 : 1,
      }}
      animate={
        inView
          ? {
              [axis === "Y" ? "y" : "x"]: 0,
              opacity: 1,
              scale: 1,
            }
          : {}
      }
      transition={{
        type: "spring",
        damping: config.friction,
        stiffness: config.tension,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
