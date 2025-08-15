// /src/components/ChatBot.tsx
import { GoPaperclip } from "react-icons/go";
import { OverlayTrigger, Tooltip } from "react-bootstrap"; // opsional
import clsx from 'clsx';
import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { GoPaperAirplane } from "react-icons/go";
import { motion } from 'framer-motion';
import { useChatApi } from '../hooks/useChatApi';

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // bebas pilih tema

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [chatInitialized, setChatInitialized] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePickFile = () => fileInputRef.current?.click();

  const { sendMessage, isLoading } = useChatApi();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  const typeTextFast = (botReply: string, setMessages: Function) => {
    let index = 0;
    const chunkSize = Math.ceil(botReply.length / 10); 
    // Dibagi ke ±10 frame → super cepat
  
    const step = () => {
      index += chunkSize;
  
      setMessages((prev: Message[]) => {
        const newMessages = [...prev];
        const lastMsgIndex = newMessages.length - 1;
        newMessages[lastMsgIndex] = {
          ...newMessages[lastMsgIndex],
          text: botReply.slice(0, index)
        };
        return newMessages;
      });
  
      if (index < botReply.length) {
        requestAnimationFrame(step);
      }
    };
  
    requestAnimationFrame(step);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;
  
    if (!chatInitialized) setChatInitialized(true);
  
    // Masukkan pesan user
    setMessages(prev => [...prev, { text: input || (file ? file.name : ''), sender: 'user' }]);
  
    try {
      const botReplyArray = await sendMessage({ text: input, file });
      const botReply = Array.isArray(botReplyArray) ? botReplyArray.join("\n\n") : botReplyArray;
  
      // Tambah pesan kosong dulu
      setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

      // Efek ketik kilat
      typeTextFast(botReply, setMessages);
    } catch (err) {
      setMessages(prev => [...prev, { text: 'Terjadi kesalahan memproses pesan.', sender: 'bot' }]);
    } finally {
      setInput('');
      setFile(null);
    }
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
          height: '100vh',
          maxWidth: chatInitialized ? '1000px' : '800px',
          maxHeight: chatInitialized ? '80vh' : '100px',
          transition: 'max-height 0.5s ease-in-out, max-width 0.5s ease-in-out',
        }}
      >
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
                  <div className="message-bubble shadow">
                    {msg.sender === 'bot' ? (
                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </ListGroup.Item>
              ))}
              <div ref={messagesEndRef} />
            </ListGroup>
          </motion.div>
        )}

        <Form 
          className={clsx("chatbot-input-form gap-2 shadow", chatInitialized ? "p-3" : "p-4")}
          onSubmit={handleSendMessage}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            position: chatInitialized ? 'sticky' : 'static',
            bottom: 0,
            width: '100%',
          }}
        >
          <Form.Control
            type="text"
            placeholder={chatInitialized ? "Ketik pesan Anda..." : "Mulai percakapan"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className=""
            style={{
              borderRadius: '30px',
              height: '50px',
            }}
            disabled={isLoading}
          />
          <Form.Control
            type="file"
            ref={fileInputRef}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFile(e.target.files?.[0] || null)
            }
            style={{ display: 'none' }}
            disabled={isLoading}
          />
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Pilih file</Tooltip>}
          >
            <Button
              variant="light"
              type="button"
              onClick={handlePickFile}
              disabled={isLoading}
              className="d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
              }}
            >
              <GoPaperclip size={20} />
            </Button>
          </OverlayTrigger>
          <Button 
            variant="primary" 
            type="submit"
            className='d-flex gap-2 justify-content-center align-items-center px-4'
            style={{
              width: '130px',
              borderRadius: '30px',
              height: '50px',
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Mengirim...' : <>Kirim <GoPaperAirplane /></>}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ChatBot;
