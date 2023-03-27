import React, { useState } from 'react';
import OpenAI from 'openai';
import './HealthcareChatbot.css';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export function ChatBot() {
  const [messages, setMessages] = useState([]);

  async function handleUserInput(message: string) {
    const response = await openai.complete({
      prompt: message,
      temperature: 0.5,
      maxTokens: 50,
      n: 1,
      stop: '\n',
      presencePenalty: 0,
      frequencyPenalty: 0,
    });
    const outputMessage = response.choices[0].text.trim();
    if (
      outputMessage.includes('healthcare') ||
      outputMessage.includes('medical') ||
      outputMessage.includes('symptom')
    ) {
      setMessages([
        ...messages,
        { type: 'user', text: message },
        { type: 'bot', text: outputMessage },
      ]);
    }
  }

  return (
    <div className='chatbot-container'>
      <div className='chatbot-messages'>
        {messages.map((message, index) => (
          <div key={index} className={`chatbot-message ${message.type}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className='chatbot-input'>
        <ChatInput onSendMessage={handleUserInput} />
      </div>
    </div>
  );
}

function ChatInput(props: { onSendMessage: (message: string) => void }) {
  const [message, setMessage] = useState('');

  function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (message) {
      props.onSendMessage(message);
      setMessage('');
    }
  }

  return (
    <form onSubmit={handleSendMessage}>
      <input
        type='text'
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder='Ask me anything about healthcare'
      />
      <button type='submit'>Send</button>
    </form>
  );
}
