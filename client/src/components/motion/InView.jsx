import React from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils'

/**
 * InView — inspired by motion-primitives.com/docs/in-view
 * Triggers entrance transitions when the element enters the viewport.
 * Supports customizable variants, margin, and once-only triggering.
 */
export function InView({
  children,
  variants,
  transition,
  className,
  as: Component = 'div',
  viewOptions = { once: true, margin: '-50px' },
}) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, viewOptions)
  const shouldReduceMotion = useReducedMotion()

  const defaultVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: transition || {
        duration: 0.55,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  }

  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>
  }

  const MotionComponent = motion[Component] || motion.div

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants || defaultVariants}
      className={className}
    >
      {children}
    </MotionComponent>
  )
}

export default InView
