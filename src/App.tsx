import React, { useState, useEffect, useRef } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import './App.css';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey,
});

const openai = new OpenAIApi(configuration);

const HIDDEN_PROMPT_FILE_PATH = '/hidden-prompt.txt'; // Specify the path to your hidden prompt text file

const App: React.FC = () => {
  const [messages, setMessages] = useState<{ content: string; isUser: boolean }[]>([]);
  const [inputText, setInputText] = useState('');

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const hiddenPromptRef = useRef<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const loadHiddenPrompt = async () => {
    try {
      const response = await fetch(HIDDEN_PROMPT_FILE_PATH);
      if (response.ok) {
        const promptContent = await response.text();
        hiddenPromptRef.current = promptContent;
        console.log('Hidden Prompt:', hiddenPromptRef.current);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    loadHiddenPrompt();
  }, []);

  const sendMessage = async () => {
    if (inputText.trim() !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: inputText.trim(), isUser: true },
      ]);
  
      setInputText('');
  
      // Randomly determine if the bot should respond
      const shouldRespond = Math.random() < 0.8; // 80% chance of response
  
      if (shouldRespond) {
        try {
          console.log('Before openai.createChatCompletion');
          const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo-0301',
            messages: [
              { role: 'system', content: hiddenPromptRef.current },
              { role: 'user', content: inputText },
            ],
            temperature: 0.2,
            max_tokens: 50,
            frequency_penalty: 2,
          });
          console.log('After openai.createChatCompletion', response);
  
          const botResponse = response.data.choices[0].message?.content?.trim();
          console.log('Bot Response:', botResponse);
  
          if (botResponse && botResponse.toLowerCase().includes('ai')) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { content: 'Filtered', isUser: false },
            ]);
          } else if (botResponse) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { content: botResponse, isUser: false },
            ]);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  };
  
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container">
      <div className="message-container" ref={messageContainerRef}>
        {messages.map((message, index) => (
          <div className={`message ${message.isUser ? 'user' : 'bot'}`} key={index}>
            <div className="image-container"></div>
            <span className="content">{message.content}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          className="input"
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
