import React from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils'

/**
 * AnimatedGroup — inspired by motion-primitives.com/docs/animated-group
 * Coordinates staggered entrance animations across its children (lists, cards, metrics).
 */
export function AnimatedGroup({
  children,
  className,
  variants,
  as: Component = 'div',
  preset = 'fade-up', // 'fade-up' | 'scale' | 'blur'
  delay = 0,
  stagger = 0.08,
  viewTrigger = true,
}) {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const shouldReduceMotion = useReducedMotion()

  const presets = {
    'fade-up': {
      item: {
        hidden: { opacity: 0, y: 16, filter: 'blur(3px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      },
    },
    scale: {
      item: {
        hidden: { opacity: 0, scale: 0.94, filter: 'blur(2px)' },
        visible: {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        },
      },
    },
    blur: {
      item: {
        hidden: { opacity: 0, filter: 'blur(8px)' },
        visible: {
          opacity: 1,
          filter: 'blur(0px)',
          transition: { duration: 0.5, ease: 'easeOut' },
        },
      },
    },
  }

  const selectedPreset = presets[preset] || presets['fade-up']

  const containerVariants = variants?.container || {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  }

  const itemVariants = variants?.item || selectedPreset.item

  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>
  }

  const MotionComponent = motion[Component] || motion.div

  return (
    <MotionComponent
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={viewTrigger ? (inView ? 'visible' : 'hidden') : 'visible'}
    >
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child
        return (
          <motion.div key={child.key || idx} variants={itemVariants}>
            {child}
          </motion.div>
        )
      })}
    </MotionComponent>
  )
}

export default AnimatedGroup
