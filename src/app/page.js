'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateGame = async () => {
    // Clear previous game and errors, start loading
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
      gameContainer.innerHTML = '';
    }
    setError(null);
    setIsLoading(true);

    // --- The Advanced "Meta-Prompt" ---
    // This is the core improvement. It gives the AI strict rules for better results.
    const metaPrompt = `
      You are an expert game developer AI. Your task is to generate the complete code for a simple web-based game using HTML, CSS, and JavaScript, all within a single self-contained HTML file.
      
      **Game Generation Rules:**
      1.  **Framework:** Do NOT use any external libraries or frameworks (no p5.js, Kaboom, Phaser, etc.). Use only pure, vanilla JavaScript and the HTML Canvas API.
      2.  **Structure:** The entire game must be a single, complete HTML document. Inline the CSS in a <style> tag and all JavaScript in a <script> tag right before the closing </body> tag.
      3.  **Canvas:** The game must be rendered on an HTML <canvas> element. The canvas should be 800px wide and 600px high with a black background.
      4.  **Core Loop:** You MUST implement a standard game loop using requestAnimationFrame for smooth, efficient animation.
      5.  **Game Mechanics:** Based on the user's request, you must implement:
          - A player character controllable by the user (use arrow keys for movement).
          - A clear objective or goal (e.g., survive for 60 seconds, collect 10 items).
          - A visible scoring mechanism or timer on the canvas.
          - A clear win/loss condition that stops the game and displays a "Game Over" or "You Win!" message on the canvas.
      6.  **Code Quality:** The generated code must be clean, well-commented, and free of syntax errors. Ensure all variables are properly declared.
      
      **User's Game Request:**
      "${prompt}"
      
      Now, generate the complete HTML file based on all the rules above. The code should start with <!DOCTYPE html>.
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // --- Model Upgrade ---
            // We specify a more powerful model directly in the API call's body.
            // This assumes your '/api/generate' route will use this parameter.
            model: 'gpt-4o', 
            prompt: metaPrompt 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate the game.');
      }

      const data = await response.json();
      const gameCode = data.result;

      // Inject the generated game code into an iframe for sandboxed execution
      if (gameContainer) {
        const iframe = document.createElement('iframe');
        iframe.srcdoc = gameCode;
        iframe.style.width = '800px';
        iframe.style.height = '600px';
        iframe.style.border = '1px solid #4a5568';
        gameContainer.appendChild(iframe);
      }

    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">Forge Genesis Studio</h1>
      <p className="text-lg text-gray-400 mb-8">Describe the game you want to create.</p>
      
      <div className="w-full max-w-2xl flex">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow p-3 bg-gray-800 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., A space shooter where you dodge asteroids"
        />
        <button
          onClick={generateGame}
          disabled={isLoading || !prompt}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-r-md transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">Error: {error}</p>}

      <div id="game-container" className="mt-8 w-[800px] h-[600px] bg-black rounded-lg shadow-2xl flex items-center justify-center">
        {isLoading && <p className="text-gray-400">Loading your game...</p>}
      </div>
    </main>
  );
}
