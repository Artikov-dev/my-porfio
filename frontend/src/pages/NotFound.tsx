import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/contexts/I18nContext';
import { Home } from 'lucide-react';

export const NotFound = () => {
  const { language } = useI18n();

  const title = language === 'uz' ? 'Sahifa topilmadi' : language === 'ru' ? 'Страница не найдена' : 'Page Not Found';
  const desc = language === 'uz' ? 'Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o\'chirilgan.' : language === 'ru' ? 'Извините, страница, которую вы ищете, не существует или была удалена.' : 'Sorry, the page you are looking for does not exist or has been removed.';
  const backHome = language === 'uz' ? 'Asosiy sahifaga qaytish' : language === 'ru' ? 'Вернуться на главную' : 'Back to Home';

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10"
      >
        <motion.h1 
          className="text-8xl md:text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          404
        </motion.h1>
        <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
          {title}
        </h2>
        <p className="text-foreground/60 max-w-md mx-auto mb-8 text-lg">
          {desc}
        </p>
        
        <Link to="/">
          <Button variant="solid" className="px-8 py-4 text-lg rounded-full flex items-center justify-center gap-2 mx-auto">
            <Home className="w-5 h-5" />
            {backHome}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};
