import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';

// Tipe data untuk pesan
interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mengatur scroll ke bawah setiap kali ada pesan baru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Tambahkan pesan pengguna
    setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);
    setInput('');

    // Simulasi respons bot (ini bisa diganti dengan logika AI atau API)
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: `Halo! Anda tadi bilang: "${input}"`, sender: 'bot' }]);
    }, 1000);
  };

  return (
    <Container className="chatbot-container">
      <div className="chatbot-messages">
        <ListGroup variant="flush">
          {messages.map((msg, index) => (
            <ListGroup.Item
              key={index}
              className={`message-item ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-bubble">{msg.text}</div>
            </ListGroup.Item>
          ))}
          <div ref={messagesEndRef} />
        </ListGroup>
      </div>

      <Form className="chatbot-input-form" onSubmit={handleSendMessage}>
        <Form.Control
          type="text"
          placeholder="Ketik pesan Anda..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="me-2"
        />
        <Button variant="primary" type="submit">
          Kirim
        </Button>
      </Form>
    </Container>
  );
};

export default ChatBot;