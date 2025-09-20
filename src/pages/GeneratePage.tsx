import React, { useState } from 'react';
import { useGameGenerator } from '../hooks/useGameGenerator';
import GamePlayer from '../components/GamePlayer';

const GeneratePage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const { generateNewGame, isGenerating, error, generatedGame } = useGameGenerator();
  const [gameEndState, setGameEndState] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    try {
      await generateNewGame(prompt);
      setGameEndState(null); // Reset game end state when generating a new game
    } catch (err) {
      console.error('Game generation failed:', err);
    }
  };

  const handleGameEnd = (state: any) => {
    setGameEndState(state);
  };

  return (
    <div className="generate-page">
      <h1>Generate a Game</h1>
      <p>Describe the game you want to create. Try phrases like:</p>
      <ul>
        <li>"Space shooter with aliens"</li>
        <li>"Platform jumper with coins"</li>
        <li>"Puzzle matching game"</li>
        <li>"Forest adventure with treasures"</li>
      </ul>
      
      <form onSubmit={handleSubmit} className="prompt-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the game you want to create..."
          disabled={isGenerating}
          rows={4}
        />
        <button type="submit" disabled={isGenerating || !prompt.trim()}>
          {isGenerating ? 'Generating...' : 'Generate Game'}
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      
      {generatedGame && (
        <div className="game-result">
          <h2>Your {generatedGame.metadata.title}</h2>
          <p>Generated from: "{generatedGame.metadata.prompt}"</p>
          <p>Type: {generatedGame.data.type} | Theme: {generatedGame.data.config.theme}</p>
          
          <div className="game-container">
            <GamePlayer 
              gameData={generatedGame.data} 
              gameId={generatedGame.metadata.id}
              onGameEnd={handleGameEnd}
            />
          </div>
          
          {gameEndState && (
            <div className="game-end">
              <h3>Game Completed!</h3>
              <p>Final Score: {gameEndState.score}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeneratePage;
