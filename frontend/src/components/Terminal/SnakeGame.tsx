import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 15;

type Point = { x: number; y: number };

export const SnakeGame = ({ onGameOver, onExit }: { onGameOver?: (score: number) => void, onExit: () => void }) => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Ref to hold the latest direction to prevent quick reverse deaths
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const collision = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!collision) break;
    }
    setFood(newFood);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault(); // prevent scrolling
      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (isGameOver) {
      if (onGameOver) onGameOver(score);
      return;
    }

    const moveSnake = () => {
      setSnake(prev => {
        const newHead = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y
        };

        // Check Wall Collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prev;
        }

        // Check Self Collision
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 150);
    return () => clearInterval(intervalId);
  }, [direction, food, isGameOver, generateFood, onGameOver, score]);

  // Draw Game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isGameOver) {
      ctx.fillStyle = '#f87171'; // red-400
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
      return;
    }

    // Draw Food
    ctx.fillStyle = '#f43f5e'; // rose-500
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2, 
      food.y * CELL_SIZE + CELL_SIZE / 2, 
      CELL_SIZE / 2 - 1, 
      0, 
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#10b981' : '#34d399'; // emerald colors
      ctx.fillRect(
        segment.x * CELL_SIZE + 1, 
        segment.y * CELL_SIZE + 1, 
        CELL_SIZE - 2, 
        CELL_SIZE - 2
      );
    });
  }, [snake, food, isGameOver, score]);

  return (
    <div className="flex flex-col items-center my-4 p-4 border border-border rounded-lg bg-background/90 w-fit mx-auto relative z-[110]">
      <div className="flex justify-between items-center w-full mb-2 font-bold text-primary">
        <span>SNAKE</span>
        <div className="flex gap-4 items-center">
          <span>SCORE: {score}</span>
          <button onClick={onExit} className="text-red-400 hover:text-red-300 ml-4 px-2 py-0.5 border border-red-500/30 rounded text-xs">EXIT</button>
        </div>
      </div>
      <canvas 
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="rounded shadow-inner border border-white/5 bg-slate-900"
      />
      {isGameOver && (
        <button 
          onClick={() => {
            setSnake([{ x: 10, y: 10 }]);
            setDirection({ x: 1, y: 0 });
            setScore(0);
            setIsGameOver(false);
          }}
          className="mt-4 px-4 py-1 text-xs bg-primary text-white rounded hover:bg-teal-500"
        >
          RESTART
        </button>
      )}
    </div>
  );
};
