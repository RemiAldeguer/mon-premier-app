import React, { useState } from 'react';
import axios from 'axios';

const HuggingFaceTextGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [maxNewTokens, setMaxNewTokens] = useState(100);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);

  // Fonction pour supprimer les balises HTML/XML
  const removeHtmlTags = (text) => {
    return text.replace(/<\/?[^>]+(>|$)/g, ""); // Expression régulière qui retire les balises
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiKey = process.env.REACT_APP_HUGGING_FACE_API_KEY;
    const model = 'EleutherAI/gpt-neo-2.7B';

    const data = {
      inputs: inputText,
      parameters: {
        max_new_tokens: Number(maxNewTokens),
        temperature: Number(temperature),
        top_p: Number(topP),
      },
    };

    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.length > 0) {
        // Nettoie le texte généré pour retirer les balises
        const cleanText = removeHtmlTags(response.data[0].generated_text);
        setGeneratedText(cleanText);
      } else {
        console.error('Aucun texte généré.');
      }

    } catch (error) {
      console.error('Erreur lors de la requête à Hugging Face:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Générateur de texte Hugging Face</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Texte d'entrée :</label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Entrez un texte pour générer une suite"
            required
          />
        </div>

        <div>
          <label>Max New Tokens :</label>
          <input
            type="number"
            value={maxNewTokens}
            onChange={(e) => setMaxNewTokens(e.target.value)}
            min="1"
            placeholder="50"
          />
        </div>

        <div>
          <label>Temperature :</label>
          <input
            type="number"
            step="0.01"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            min="0"
            max="1"
            placeholder="0.7"
          />
        </div>

        <div>
          <label>Top P :</label>
          <input
            type="number"
            step="0.01"
            value={topP}
            onChange={(e) => setTopP(e.target.value)}
            min="0"
            max="1"
            placeholder="0.9"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Génération en cours...' : 'Générer'}
        </button>
      </form>

      {generatedText && (
        <div>
          <h2>Texte généré :</h2>
          <p>{generatedText}</p>
        </div>
      )}
    </div>
  );
};

export default HuggingFaceTextGenerator;
