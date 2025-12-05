import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sun, Moon } from 'lucide-react';
import logo from './assets/pixel_craft_logo.png';
import './App.css';

const URL_API = 'https://coulouche-bot-backend.onrender.com/api/chat/message/';

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
      const reponse = await axios.post(URL_API, { message: messageUtilisateur });
      setMessages(precedent => [...precedent, { texte: reponse.data.reponse, expediteur: 'bot' }]);
    } catch (erreur) {
      console.error("Erreur lors de l'envoi du message:", erreur);
      setMessages(precedent => [...precedent, { texte: "Ah bah bravo, j'ai planté. C'est sûrement de ta faute.", expediteur: 'bot' }]);
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
