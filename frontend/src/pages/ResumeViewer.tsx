import React, { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { Download, ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen pt-28 pb-16 px-6 max-w-5xl mx-auto flex flex-col items-center">
      
      <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2 text-foreground/70 hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Button>
        </Link>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground/60 bg-foreground/5 px-3 py-1 rounded-full uppercase">
            Language: {language}
          </span>
        </div>
      </div>

      <div className="w-full h-[75vh] bg-foreground/5 border border-border rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
        {/* We use an object tag for better PDF rendering and hide native toolbars */}
        <div className="flex-1 w-full relative flex items-center justify-center">
          {pdfExists === null ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-foreground/60">Loading document...</p>
            </div>
          ) : pdfExists ? (
            <object 
              data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
              type="application/pdf" 
              className="w-full h-full absolute inset-0"
            >
              <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <p className="text-foreground/70">Your browser doesn't support built-in PDF viewing.</p>
              </div>
            </object>
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

        {/* Custom Actions Footer */}
        <div className="h-20 bg-background/80 backdrop-blur-md border-t border-border flex items-center justify-center gap-6 px-6">
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="flex items-center gap-2 px-8">
              View CV
            </Button>
          </a>
          <a href={pdfUrl} download>
            <Button variant="solid" className="flex items-center gap-2 px-8">
              <Download className="w-4 h-4" /> Download CV
            </Button>
          </a>
        </div>
      </div>

    </div>
  );
};
