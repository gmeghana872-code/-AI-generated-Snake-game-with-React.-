import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCcw, Gamepad2 } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const getCenterPoint = (): Point => ({ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) });
const getRandomPoint = (): Point => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([getCenterPoint()]);
  const [food, setFood] = useState<Point>(getRandomPoint());
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Initialize highest score from local storage (simulate)
  useEffect(() => {
    const saved = localStorage.getItem('snake_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const resetGame = () => {
    setSnake([getCenterPoint()]);
    setFood(getRandomPoint());
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setHasStarted(true);
    setIsPaused(false);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key;
      let newDir: Direction | null = null;

      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newDir = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newDir = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newDir = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newDir = 'RIGHT';
          break;
        case ' ': // Space to pause or start
          e.preventDefault(); // stop scrolling
          if (!hasStarted || isGameOver) {
            resetGame();
          } else {
            setIsPaused((p) => !p);
          }
          break;
      }

      if (newDir) {
        e.preventDefault(); // stop scrolling

        if (!hasStarted && !isGameOver) {
          setHasStarted(true);
          setIsPaused(false);
        }

        // Prevent 180-degree turns
        if (
          (newDir === 'UP' && direction !== 'DOWN') ||
          (newDir === 'DOWN' && direction !== 'UP') ||
          (newDir === 'LEFT' && direction !== 'RIGHT') ||
          (newDir === 'RIGHT' && direction !== 'LEFT')
        ) {
          setNextDirection(newDir);
        }
      }
    },
    [direction, isGameOver, hasStarted]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isGameOver || isPaused || !hasStarted) return;

    let currentSpeed = Math.max(50, INITIAL_SPEED - Math.floor(score / 5) * 10);

    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        setDirection(nextDirection);

        switch (nextDirection) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check walls collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Check self collision (ignoring the tail end, which will move)
        if (prevSnake.some((segment, index) => index !== prevSnake.length - 1 && segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snake_highscore', newScore.toString());
            }
            return newScore;
          });
          
          // Generate new food that is not on snake
          let newFood = getRandomPoint();
          while (newSnake.some((s) => s.x === newFood.x && s.y === newFood.y)) {
            newFood = getRandomPoint();
          }
          setFood(newFood);
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    }, currentSpeed);

    return () => clearInterval(moveSnake);
  }, [nextDirection, isGameOver, isPaused, hasStarted, food, score, highScore]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setHasStarted(false);
  };

  return (
    <div className="flex flex-col items-center max-w-lg w-full">
      <div className="w-full flex justify-between items-end mb-4 font-mono">
        <div className="flex flex-col">
          <span className="text-zinc-400 text-sm tracking-widest uppercase mb-1">Score</span>
          <span className="text-4xl font-bold neon-text-cyan text-cyan-400 leading-none">{score}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-zinc-500 text-xs tracking-widest uppercase mb-1">High Score</span>
          <span className="text-2xl font-bold text-zinc-300 leading-none">{highScore}</span>
        </div>
      </div>

      <div className="relative bg-zinc-950/80 p-6 neon-border-cyan rounded-xl backdrop-blur-sm w-full pt-[100%]">
        <div className="absolute inset-4 grid grid-rows-[repeat(20,minmax(0,1fr))]" style={{ gap: '1px' }}>
          {Array.from({ length: GRID_SIZE }).map((_, y) => (
            <div key={`row-${y}`} className="grid grid-cols-[repeat(20,minmax(0,1fr))]" style={{ gap: '1px' }}>
              {Array.from({ length: GRID_SIZE }).map((_, x) => {
                const isSnake = snake.some((s) => s.x === x && s.y === y);
                const isFood = food.x === x && food.y === y;
                const isHead = snake[0].x === x && snake[0].y === y;
                
                let cellClasses = "rounded-[2px] transition-all duration-75 ";
                if (isHead) {
                  cellClasses += "bg-cyan-300 shadow-[0_0_10px_#67e8f9] z-10 scale-110";
                } else if (isSnake) {
                  cellClasses += "bg-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.6)]";
                } else if (isFood) {
                  cellClasses += "bg-lime-400 shadow-[0_0_12px_#a3e635] animate-pulse rounded-full scale-[0.8]";
                } else {
                  cellClasses += "bg-zinc-900/30";
                }

                return <div key={`${x}-${y}`} className={cellClasses} />;
              })}
            </div>
          ))}
        </div>

        {(!hasStarted || isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl z-20">
            <div className="text-center p-6 bg-zinc-900/90 border border-cyan-500/30 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              {isGameOver ? (
                <>
                  <h3 className="text-3xl font-bold font-mono text-red-500 mb-2">GAME OVER</h3>
                  <p className="text-zinc-400 mb-6 font-sans">Final Score: <span className="text-white font-bold">{score}</span></p>
                  <button 
                    onClick={resetGame}
                    className="flex w-full items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(8,145,178,0.6)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)]"
                  >
                    <RefreshCcw size={18} /> PLAY AGAIN
                  </button>
                </>
              ) : isPaused ? (
                <>
                  <h3 className="text-2xl font-bold font-mono neon-text-cyan text-cyan-400 mb-6 tracking-widest">PAUSED</h3>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(8,145,178,0.6)]"
                  >
                    <Gamepad2 size={18} /> RESUME
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold font-mono neon-text-cyan text-cyan-400 mb-4 tracking-widest">SNAKE.EXE</h3>
                  <p className="text-zinc-400 mb-6 text-sm flex flex-col gap-2">
                    <span>Use <kbd className="bg-zinc-800 px-2 py-1 rounded text-cyan-300">W A S D</kbd> or <kbd className="bg-zinc-800 px-2 py-1 rounded text-cyan-300">Arrows</kbd> to move</span>
                    <span>Press <kbd className="bg-zinc-800 px-2 py-1 rounded text-fuchsia-300">Space</kbd> to pause</span>
                  </p>
                  <button 
                    onClick={resetGame}
                    className="flex w-full items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(8,145,178,0.6)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] focus:outline-none"
                  >
                    <Gamepad2 size={18} /> START GAME
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
