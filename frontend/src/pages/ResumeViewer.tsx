import React, { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { Download, ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/Layout/PageWrapper';
import { motion } from 'framer-motion';

export const ResumeViewer = () => {
  const { language } = useI18n();
  const [pdfExists, setPdfExists] = useState<boolean | null>(null);
  
  // Construct the PDF file name based on the current language
  // e.g., resume-en.pdf, resume-uz.pdf, resume-ru.pdf
  const pdfUrl = `/resume-${language}.pdf`;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if the PDF actually exists (prevent Vite from returning index.html)
    fetch(pdfUrl, { method: 'HEAD' })
      .then(res => {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/pdf')) {
          setPdfExists(true);
        } else {
          setPdfExists(false);
        }
      })
      .catch(() => setPdfExists(false));
  }, [pdfUrl]);

  return (
    <PageWrapper>
      <div className="min-h-screen pt-24 md:pt-32 pb-16 px-4 md:px-6 max-w-6xl mx-auto flex flex-col items-center relative">
        
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[10%] left-[5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[100px] md:blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/20 rounded-full blur-[100px] md:blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-6"
        >
          <div className="flex flex-col items-center md:items-start">
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2 text-foreground/60 hover:text-primary mb-2 -ml-4">
                <ArrowLeft className="w-4 h-4" /> Back to Portfolio
              </Button>
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Curriculum <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Vitae</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-full border border-border flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-foreground uppercase tracking-wider">
                Lang: {language}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full h-[70vh] md:h-[80vh] glass border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.15)] hover:shadow-[0_0_60px_rgba(20,184,166,0.25)] transition-shadow duration-500 relative flex flex-col group"
        >
          {/* We use an object tag for better PDF rendering and hide native toolbars */}
          <div className="flex-1 w-full relative flex items-center justify-center bg-white/50 dark:bg-black/20 overflow-hidden">
          {pdfExists === null ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-foreground/60">Loading document...</p>
            </div>
          ) : pdfExists ? (
            <div className="absolute inset-0 w-[calc(100%+20px)] h-[calc(100%+20px)] -mr-[20px] -mb-[20px]">
              <object 
                data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                type="application/pdf" 
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                  <p className="text-foreground/70">Your browser doesn't support built-in PDF viewing.</p>
                </div>
              </object>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full max-w-md">
              <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-foreground/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Resume Not Found</h3>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                The resume file for <strong>{language.toUpperCase()}</strong> is currently missing. Please upload <code className="bg-foreground/10 px-2 py-1 rounded text-primary">{pdfUrl}</code> to the public folder.
              </p>
            </div>
          )}
        </div>

          {/* Custom Actions Footer - Floating style inside the glass container */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 p-4 translate-y-0 opacity-100 transition-all duration-300">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 px-8 py-6 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border-foreground/10">
                <ExternalLink className="w-5 h-5" /> Open in New Tab
              </Button>
            </a>
            <a href={pdfUrl} download className="w-full sm:w-auto">
              <Button variant="solid" className="w-full flex items-center justify-center gap-2 px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] transition-all">
                <Download className="w-5 h-5" /> Download PDF
              </Button>
            </a>
          </div>
        </motion.div>

    </div>
    </PageWrapper>
  );
};
