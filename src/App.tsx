/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full relative bg-zinc-950 flex font-sans overflow-hidden">
      {/* Neon Grid Background Layer */}
      <div className="absolute inset-0 neon-grid opacity-30 z-0"></div>
      
      {/* Radial Gradient overlay to focus center */}
      <div className="absolute inset-0 bg-radial from-transparent via-zinc-950/80 to-zinc-950 z-0"></div>

      <main className="relative z-10 w-full h-full min-h-screen flex flex-col md:flex-row items-center justify-center p-4 gap-8 xl:gap-16">
        
        {/* Left/Top Content Area (Game) */}
        <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center">
          <header className="mb-8 text-center flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <Gamepad2 className="text-cyan-400 w-8 h-8 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <h1 className="text-4xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 neon-text-cyan font-mono">
                Neon Snake
              </h1>
            </div>
            <p className="text-zinc-400 text-sm font-mono tracking-wider">RETRO_ARCADE_SYSTEM_v1.0</p>
          </header>

          <SnakeGame />
        </div>

        {/* Right/Bottom Content Area (Music & Stats) */}
        <div className="w-full md:w-auto flex flex-col items-center md:items-start justify-center gap-6">
          <div className="hidden md:flex flex-col gap-2 mb-4">
             <h2 className="text-2xl font-bold neon-text-fuchsia text-fuchsia-400 font-mono tracking-widest uppercase">
               Soundtrack
             </h2>
             <p className="text-zinc-400 text-sm max-w-xs">
               Immerse yourself in AI-generated dark synthwave beats while you navigate the cyber grid.
             </p>
          </div>
          
          <MusicPlayer />

          <div className="mt-8 pt-6 border-t border-zinc-800/50 w-full max-w-sm hidden md:block">
             <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">System Controls</h3>
                <ul className="text-sm text-zinc-400 font-mono space-y-2">
                  <li className="flex justify-between">
                    <span>Move</span>
                    <span className="text-cyan-400">WASD / Arrows</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Pause Game</span>
                    <span className="text-cyan-400">Spacebar</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Next Track</span>
                    <span className="text-fuchsia-400">Player Dock</span>
                  </li>
                </ul>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}
