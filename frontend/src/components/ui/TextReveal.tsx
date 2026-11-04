import React from 'react';
import { motion, Variants } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({ text, className, delay = 0 }) => {
  // Split text into words, then words into characters for a fluid reveal
  const words = text.split(' ');

  // Letters slide up from below the clipped (overflow: hidden) line instead of fading in from
  // opacity 0: the hero title is the page's Largest Contentful Paint, and transparent text
  // doesn't count as painted, so the fade pushed LCP back by the whole animation.
  const container: Variants = {
    hidden: {},
    visible: (i = 1) => ({
      transition: { staggerChildren: 0.03, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    visible: {
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      y: '110%',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={twMerge('inline-flex', className)}
    >
      {words.map((word, index) => (
        <span key={index} style={{ marginRight: '0.25em', display: 'inline-flex' }}>
          {Array.from(word).map((letter, index) => (
            <motion.span variants={child} key={index} style={{ display: 'inline-block' }}>
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};
