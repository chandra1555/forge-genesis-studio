import React from 'react';
import GeneratePage from './pages/GeneratePage';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Forge Genesis Studio</h1>
        <p>Create games with AI</p>
      </header>
      <main>
        <GeneratePage />
      </main>
    </div>
  );
}

export default App;
