import React from 'react';
import './App.css';
import HuggingFaceTextGenerator from './components/HuggingFaceTextGenerator'; // Import du composant

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mon Application avec Hugging Face</h1>
        <HuggingFaceTextGenerator />  {/* Utilisation du composant */}
      </header>
    </div>
  );
}

export default App;