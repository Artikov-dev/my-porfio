import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export const MobileFAB = () => {
  return (
    <motion.a
      href="/#contact"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
      className="lg:hidden fixed bottom-6 right-6 z-[60] bg-primary text-white p-4 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
      aria-label="Contact Me"
    >
      <MessageCircle size={24} />
    </motion.a>
  );
};
