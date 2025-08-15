import clsx from 'clsx';
import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { GoPaperAirplane } from "react-icons/go";
import { motion } from 'framer-motion'; // Impor motion dari framer-motion

// Tipe data untuk pesan
interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [chatInitialized, setChatInitialized] = useState<boolean>(false); // State baru
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mengatur scroll ke bawah setiap kali ada pesan baru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Jika chat belum diinisialisasi, set true
    if (!chatInitialized) {
      setChatInitialized(true);
    }

    // Tambahkan pesan pengguna
    setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);
    setInput('');

    // Simulasi respons bot (ini bisa diganti dengan logika AI atau API)
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: `Halo! Anda tadi bilang: "${input}"`, sender: 'bot' }]);
    }, 1000);
  };

  return (
    <div className='d-flex flex-column justify-content-center align-items-center' style={{position:'relative', width: '100%', height: '100vh', zIndex: 200 }}>
      <div className=''>
        <img src='/logo.png' style={{ 
          zIndex: 1, 
          height: chatInitialized ? '100px' : '400px',
          marginBottom: chatInitialized ? '-80px' : '-400px',
          transition: 'all 0.5s ease-in-out',
        }}/>
      </div>
      <Container 
        className="chatbot-container shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(5px)',
          borderRadius: chatInitialized ? '20px' : '50px',
          padding: '0',
          height: '100vh', // Gunakan tinggi penuh
          maxHeight: chatInitialized ? '80vh' : '100px', // Atur tinggi berdasarkan state
          transition: 'max-height 0.5s ease-in-out', // Tambahkan transisi CSS
        }}
      >
        {/* Tampilkan chat messages hanya jika chat sudah diinisialisasi */}
        {chatInitialized && (
          <motion.div
            className="chatbot-messages px-4"
            style={{ background: 'transparent' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ListGroup variant="flush">
              {messages.map((msg, index) => (
                <ListGroup.Item
                  key={index}
                  className={clsx('message-item d-flex flex-column', msg.sender === 'user' ? 'user-message' : 'bot-message')}
                  style={{ background: 'transparent' }}
                >
                  <div className={clsx("sender-label", msg.sender === 'user' ? 'pe-2' : 'ps-2')} >
                    {msg.sender === 'user' ? 'Anda' : 'Gemini'}
                  </div>
                  <div className="message-bubble shadow">{msg.text}</div>
                </ListGroup.Item>
              ))}
              <div ref={messagesEndRef} />
            </ListGroup>
          </motion.div>
        )}

        <Form 
          className={clsx("chatbot-input-form gap-1 shadow", chatInitialized ? "p-3" : "p-4")}
          onSubmit={handleSendMessage}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            position: chatInitialized ? 'sticky' : 'static', // Atur posisi input
            bottom: 0,
            width: '100%',
          }}
        >
          <Form.Control
            type="text"
            placeholder="Ketik pesan Anda..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="me-2"
            style={{
              borderRadius: '30px',
              height: '50px',
            }}
          />
          <Button 
            variant="primary" 
            type="submit"
            className='d-flex gap-2 justify-content-center align-items-center px-4'
            style={{
              width: '130px',
              borderRadius: '30px',
            }}
          >
            Kirim <GoPaperAirplane />
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ChatBot;