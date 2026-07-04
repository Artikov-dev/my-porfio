import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal as TerminalIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MatrixRain } from './MatrixRain';
import { SnakeGame } from './SnakeGame';

interface CommandOutput {
  id: string;
  type: 'input' | 'output' | 'error';
  text: string | React.ReactNode;
}

export const TerminalOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    { id: 'welcome', type: 'output', text: 'Welcome to Roma OS v2.0.0' },
    { id: 'welcome2', type: 'output', text: 'Type "help" to see available commands.' },
  ]);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showSnake, setShowSnake] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Listen for `~` key to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on `~` or `\`` (backtick)
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom when history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    
    if (trimmed === '') return;

    let response: React.ReactNode = '';
    
    switch (trimmed) {
      case 'help':
        response = (
          <div className="flex flex-col gap-1 mt-2 text-primary/90">
            <div><span className="text-foreground dark:text-white font-bold w-20 inline-block">whoami</span> - Display my short bio</div>
            <div><span className="text-foreground dark:text-white font-bold w-20 inline-block">skills</span> - List my technical skills</div>
            <div><span className="text-foreground dark:text-white font-bold w-20 inline-block">projects</span> - Go to projects page</div>
            <div><span className="text-foreground dark:text-white font-bold w-20 inline-block">clear</span> - Clear the terminal</div>
            <div><span className="text-foreground dark:text-white font-bold w-20 inline-block">exit</span> - Close the terminal</div>
          </div>
        );
        break;
      case 'whoami':
        response = 'I am Roma Artikov, a Full-Stack Engineer and Software Architect specializing in React, Node.js, and high-performance Web Systems.';
        break;
      case 'skills':
        response = 'TypeScript, React, Next.js, Node.js, Express, PostgreSQL, Redis, WebSockets, Clean Architecture, Docker.';
        break;
      case 'projects':
        response = 'Navigating to /projects...';
        setTimeout(() => {
          navigate('/projects');
          setIsOpen(false);
        }, 800);
        break;
      case 'sudo':
        response = (
          <span className="text-red-500">
            nice try, but this incident will be reported to the sysadmin.
          </span>
        );
        break;
      case 'matrix':
        setShowMatrix(true);
        response = 'Initiating Matrix protocol...';
        break;
      case 'play snake':
        setShowSnake(true);
        return; // do not add to history
      case 'clear':
        setHistory([]);
        return;
      case 'exit':
        setIsOpen(false);
        return;
      default:
        response = (
          <span className="text-red-400">
            command not found: {trimmed}. Type "help" for a list of commands.
          </span>
        );
    }

    setHistory(prev => [
      ...prev,
      { id: Math.random().toString(), type: 'input', text: `admin@roma-artikov:~$ ${trimmed}` },
      { id: Math.random().toString(), type: 'output', text: response }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(input);
    setInput('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-[90] flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-800 text-green-400 shadow-lg hover:scale-110 transition-transform border border-slate-700"
        title="Open Terminal (~)"
      >
        <TerminalIcon size={20} />
      </button>
    );
  }

  return (
    <>
    {showMatrix && <MatrixRain onComplete={() => setShowMatrix(false)} />}
    <div className="fixed top-0 left-0 w-full h-[60vh] bg-background/95 backdrop-blur-xl border-b border-border z-[100] flex flex-col font-mono shadow-2xl animate-in slide-in-from-top duration-300">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-white/5">
        <div className="flex items-center gap-2 text-foreground dark:text-white/50">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-xs tracking-wider">ROMA_TERMINAL</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-foreground dark:text-white/50 hover:text-foreground dark:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-y-auto p-6 text-sm text-green-400 custom-scrollbar relative">
        {showSnake && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <SnakeGame onExit={() => setShowSnake(false)} />
          </div>
        )}
        {history.map(item => (
          <div key={item.id} className="mb-2">
            {item.type === 'input' ? (
              <div className="text-foreground dark:text-white font-medium">{item.text}</div>
            ) : (
              <div>{item.text}</div>
            )}
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4 text-foreground dark:text-white">
          <span className="text-primary">admin@roma-artikov:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground dark:text-white focus:ring-0"
            spellCheck={false}
            autoComplete="off"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
    </>
  );
};
