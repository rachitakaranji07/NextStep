import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils'

/**
 * TextEffect — inspired by motion-primitives.com/docs/text-effect
 * Animates text per word or per character with customizable delay, duration, and presets.
 * Respects system prefers-reduced-motion preferences.
 */
export function TextEffect({
  children,
  per = 'word', // 'word' | 'char' | 'line'
  as: Component = 'span',
  variants,
  className,
  delay = 0,
  staggerDuration = 0.04,
}) {
  const shouldReduceMotion = useReducedMotion()

  if (typeof children !== 'string') {
    return <Component className={className}>{children}</Component>
  }

  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>
  }

  const defaultContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDuration,
        delayChildren: delay,
      },
    },
  }

  const defaultItemVariants = {
    hidden: {
      opacity: 0,
      y: 12,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.45,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  }

  const containerVariants = variants?.container || defaultContainerVariants
  const itemVariants = variants?.item || defaultItemVariants

  let segments = []
  if (per === 'word') {
    segments = children.split(' ')
  } else if (per === 'char') {
    segments = children.split('')
  } else {
    segments = [children]
  }

  return (
    <motion.span
      className={cn('inline-block', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={children}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          className="inline-block"
          variants={itemVariants}
          style={{ whiteSpace: per === 'word' ? 'pre' : 'normal' }}
        >
          {segment}
          {per === 'word' && index < segments.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default TextEffect
