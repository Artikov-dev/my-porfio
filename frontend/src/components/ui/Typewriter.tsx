import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  words: string[];
  loop?: boolean;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  words,
  loop = true,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000,
  className = '',
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    const handleType = () => {
      const currentWord = words[currentWordIndex];
      
      if (isDeleting) {
        setCurrentText((prev) => currentWord.substring(0, prev.length - 1));
      } else {
        setCurrentText((prev) => currentWord.substring(0, prev.length + 1));
      }

      if (!isDeleting && currentText === currentWord) {
        if (!loop && currentWordIndex === words.length - 1) return;
        timer = setTimeout(() => setIsDeleting(true), delayBetweenWords);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else {
        timer = setTimeout(handleType, isDeleting ? deletingSpeed : typingSpeed);
      }
    };

    timer = setTimeout(handleType, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, loop, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      {currentText}
      <span className="animate-pulse border-r-4 border-primary ml-1 h-[1em]">&nbsp;</span>
    </span>
  );
};
