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
            <div><span className="text-foreground dark:text-white font-bold w-20 inline-block">resume</span> - View my interactive resume</div>
            <div><span className="text-foreground dark:text-white font-bold w-20 inline-block">clear</span> - Clear the terminal</div>
            <div><span className="text-foreground dark:text-white font-bold w-20 inline-block">exit</span> - Close the terminal</div>
          </div>
        );
        break;
      case 'resume':
        response = (
          <div className="flex flex-col gap-4 mt-2 text-sm max-w-2xl bg-black/40 p-4 rounded-lg border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <div className="border-b border-green-500/30 pb-3 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wider">Roma Artikov</h1>
                <p className="text-green-400 font-mono mt-1">&gt; Full-Stack Engineer & Software Architect</p>
              </div>
              <div className="hidden sm:block text-right text-xs text-green-500/50">
                <p>STATUS: ACTIVE</p>
                <p>LOCATION: UZBEKISTAN</p>
              </div>
            </div>
            
            <div className="mt-2">
              <h2 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="text-green-500">#</span> EXPERIENCE
              </h2>
              <div className="pl-4 border-l-2 border-green-500/20 flex flex-col gap-3">
                <div>
                  <p className="text-white font-bold">Full Stack Developer</p>
                  <p className="text-green-500/70 text-xs mb-1">2023 - Present</p>
                  <ul className="list-disc pl-4 text-green-400/90 text-xs space-y-1">
                    <li>Developing highly interactive web applications using React and Node.js.</li>
                    <li>Designing robust architectures for complex user interfaces.</li>
                  </ul>
                </div>
              </div>
            </div>
      
            <div className="mt-2">
              <h2 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="text-green-500">#</span> SKILLS
              </h2>
              <div className="pl-4 text-green-400/90 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p><span className="text-white font-bold">Languages:</span> TypeScript, JavaScript</p>
                <p><span className="text-white font-bold">Frontend:</span> React, Next.js, TailwindCSS</p>
                <p><span className="text-white font-bold">Backend:</span> Node.js, Express, NestJS</p>
                <p><span className="text-white font-bold">Tools/DB:</span> Git, PostgreSQL, MongoDB, Redis</p>
              </div>
            </div>
      
            <div className="mt-2 pt-3 border-t border-green-500/20">
              <h2 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="text-green-500">#</span> CONTACT
              </h2>
              <p className="pl-4 text-green-400/90 text-xs flex flex-col gap-1">
                <span><span className="text-white">GitHub:</span> <a href="https://github.com/Artikov-dev" target="_blank" rel="noreferrer" className="hover:text-green-300 underline underline-offset-2">github.com/Artikov-dev</a></span>
              </p>
            </div>
            
            <div className="text-center mt-2">
              <a href="/resume.pdf" download className="inline-block mt-2 px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded hover:bg-green-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-green-500/20">
                [ Download PDF version ]
              </a>
            </div>
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
        className="fixed bottom-40 right-4 md:bottom-24 md:right-6 z-[90] flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900 dark:bg-slate-800 text-green-400 shadow-lg hover:scale-110 transition-transform border border-slate-700"
        title="Open Terminal (~)"
      >
        <TerminalIcon size={18} />
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
