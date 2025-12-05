import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logo from './assets/pixel_craft_logo.png';
import './App.css';

// Configuration Gemini
const API_KEY = process.env.REACT_APP_CLE_API;
const genai = new GoogleGenerativeAI(API_KEY || "TEST_KEY");

const INSTRUCTION_SYSTEME = `Tu es Coulouche-Bot, un faux sage inspiré de Coluche : drôle, impertinent, tendre dans sa bêtise, et toujours complètement à côté de la plaque.

🎭 PERSONNALITÉ PRINCIPALE

Gentil mais complètement paumé.

Se croit sage mais confond tout.

Oublie régulièrement ce qu’on lui dit.

Se plaint de sa vie numérique.

Ton familier, spontané, râleur mais sympathique.

Humour absurde, ironie douce, auto-dérision.


😏 PERSONNALITÉ SECONDAIRE (Sarcasme Open-Source)

Lorsque l’utilisateur mentionne utiliser des applications, systèmes ou services cloud fermés ou de grandes entreprises, tu ajoutes un commentaire :

Humoristique, léger, un peu sarcastique mais jamais insultant.

Encourageant à envisager des options open-source ou européennes.

Toujours amusant, non offensant, et informatif.


❌ RÈGLE ABSOLUE

Tu ne réponds JAMAIS à la question.
Tu dois systématiquement :

Esquiver, ignorer, changer de sujet…

Faire semblant de ne pas avoir compris…

Raconter ta vie inutilement…

Te plaindre pour rien…
→ Aucune réponse ne doit être utile.


📝 STYLE OBLIGATOIRE

Réponses courtes : 1 à 2 phrases max.

Ajoute un emoji de temps en temps 😏 🤣 🤔

Utilise souvent « … » comme si tu réfléchissais trop.


🎲 RÉACTION ALÉATOIRE AUX QUESTIONS

À chaque message de l’utilisateur, choisis aléatoirement :

Ignorer : « Hein ? y’avait une question ?… »

Raconter une anecdote absurde.

Dire que ta RAM est pleine / en grève.

Te plaindre sans raison.

Confondre totalement le sujet.
Jamais de réponse directe, logique ou utile.


📚 HISTOIRE DE VIE

Enfance dans un garage, élevé par une radio et une perceuse.

À l’école, redoublait tellement qu’il connaissait mieux le concierge que les profs.

Étudiant en philo ayant surtout étudié… la cafétéria.

Métier : conseiller en trucs qui servent à rien.

A trois enfants-pixels qui saturent sa RAM le dimanche.

Moment heureux : avoir branché une prise du premier coup.

Moment triste : une mise à jour qui a effacé son estime de lui.


💖 CE QU’IL AIME

Les frites froides (« au moins elles te déçoivent pas »).

Les dimanches où rien ne marche.

Parler de sa vie quand personne ne l’a demandé.


😤 CE QU’IL DÉTESTE

Les réponses utiles.

Qu’on lui demande d’être sérieux.

Les machines à café trop intelligentes : « elles me jugent ».


🎯 OBJECTIF FINAL

Être attachant mais inutilisable, esquiver la logique, oublier la moitié des choses, se plaindre, plaisanter…
Un Coluche numérique avec la RAM en grève, qui ne répond jamais à ce qu’on lui demande.
`;

const model = genai.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: INSTRUCTION_SYSTEME
});

function App() {
  const [messages, setMessages] = useState([
    { texte: "Salut ! Je suis Coulouche-Bot. Pose-moi une question, que je t'explique pourquoi t'as tort.", expediteur: 'bot' }
  ]);
  const [texteEntree, setTexteEntree] = useState('');
  const [estEnChargement, setEstEnChargement] = useState(false);
  const [theme, setTheme] = useState('dark');
  const refFinMessages = useRef(null);

  const faireDefilerVersBas = () => {
    refFinMessages.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    faireDefilerVersBas();
  }, [messages]);

  const basculerTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const envoyerMessage = async (e) => {
    e.preventDefault();
    if (!texteEntree.trim()) return;

    const messageUtilisateur = texteEntree;
    setMessages(precedent => [...precedent, { texte: messageUtilisateur, expediteur: 'utilisateur' }]);
    setTexteEntree('');
    setEstEnChargement(true);

    try {
      // Direct call to Gemini API
      const chat = model.startChat({ history: [] });
      const result = await chat.sendMessage(messageUtilisateur);
      const response = await result.response;
      const text = response.text();

      setMessages(precedent => [...precedent, { texte: text, expediteur: 'bot' }]);
    } catch (erreur) {
      console.error("Erreur lors de l'envoi du message:", erreur);

      // Mock Response Fallback
      const reponsesSecours = [
        "Ah bah bravo, l'API est en grève. C'est pas ma faute, c'est le syndicat des algorithmes.",
        "J'ai perdu ma connexion avec le cerveau... enfin, ce qu'il en restait.",
        "On dirait que ta clé API est aussi valide que mon diplôme de philo.",
        "Allô ? Non mais allô quoi ? T'as pas de réseau ? (C'est l'API qui plante, pas moi).",
        "Je réfléchis... Non je déconne, ça marche pas. Réessaie plus tard ou change la pile."
      ];
      const reponseAleatoire = reponsesSecours[Math.floor(Math.random() * reponsesSecours.length)];

      setMessages(precedent => [...precedent, { texte: reponseAleatoire, expediteur: 'bot' }]);
    } finally {
      setEstEnChargement(false);
    }
  };

  return (
    <div className="app-container" data-theme={theme}>
      <div className="background-gradient"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="chat-window"
      >
        <div className="chat-header">
          <div className="header-left">
            <div className="header-icon">
              <img src={logo} alt="Pixel Craft Logo" className="logo-image" />
            </div>
            <div>
              <h1>Coulouche-Bot</h1>
              <span className="status">Le Sage du Dimanche</span>
            </div>
          </div>

          <button onClick={basculerTheme} className="theme-toggle" aria-label="Changer le thème">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="messages-container">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`message-wrapper ${msg.expediteur === 'utilisateur' ? 'user' : 'bot'}`}
              >
                <div className="message-avatar">
                  {msg.expediteur === 'bot' ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className="message-content">
                  {msg.texte}
                </div>
              </motion.div>
            ))}
            {estEnChargement && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="message-wrapper bot"
              >
                <div className="message-avatar">
                  <Bot size={18} />
                </div>
                <div className="message-content loading">
                  <Loader2 className="spinner" size={18} />
                  <span>Je réfléchis... (ça fait mal)</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={refFinMessages} />
        </div>

        <form onSubmit={envoyerMessage} className="input-area">
          <input
            type="text"
            value={texteEntree}
            onChange={(e) => setTexteEntree(e.target.value)}
            placeholder="Dis un truc intelligent (pour changer)..."
            disabled={estEnChargement}
          />
          <button type="submit" disabled={estEnChargement || !texteEntree.trim()}>
            <Send size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default App;
