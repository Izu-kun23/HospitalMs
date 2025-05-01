import React, { useState } from 'react';
import { IoChatbubbleEllipsesOutline, IoCloseCircleOutline } from 'react-icons/io5';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // Track conversation steps

  // List of specialist types
  const specialties = ['Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician'];

  // Toggle chat visibility
  const toggleChat = () => setIsOpen(!isOpen);

  // Function to check if input is a complete sentence
  const isCompleteSentence = (text) => {
    const words = text.trim().split(/\s+/);
    if (words.length < 3) return false; // At least 3 words required

    // Basic subject-verb detection
    const subjects = ['I', 'You', 'He', 'She', 'They', 'We', 'It', 'My', 'The', 'A', 'This'];
    const verbs = ['need', 'have', 'am', 'is', 'are', 'feel', 'want', 'like', 'see', 'know'];

    const containsSubject = words.some((word) => subjects.includes(word));
    const containsVerb = words.some((word) => verbs.includes(word));

    return containsSubject && containsVerb; // A complete sentence should have both
  };

  // Handle user message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    let botResponse = '';

    if (step === 1) {
      // Step 1: Greeting
      const greetings = ['hi', 'hello', 'hey', 'good morning', 'good evening'];
      if (greetings.includes(message.toLowerCase())) {
        botResponse = 'Hello! How can I help you today?';
      } else if (!isCompleteSentence(message)) {
        botResponse = 'Sorry, I didn’t get that. Could you please complete your sentence?';
      } else {
        botResponse = 'Can you explain thoroughly?';
        setStep(2); // Move to next step
      }
    } else if (step === 2) {
      // Step 2: Check if explanation is detailed
      if (!isCompleteSentence(message)) {
        botResponse = 'Sorry, I didn’t get that. Could you please complete your sentence?';
      } else {
        botResponse = 'Do you need a specialist?';
        setStep(3);
      }
    }

    setMessages([...messages, userMessage, { sender: 'bot', text: botResponse }]);
    setMessage('');
  };

  // Handle "Yes" or "No" button clicks
  const handleSpecialistChoice = (choice) => {
    let botResponse = choice === 'yes' ? 'What type of doctor are you looking for?' : 'Alright! Let me know if you need anything else.';
    
    setMessages([...messages, { sender: 'bot', text: botResponse }]);
    if (choice === 'yes') setStep(4);
    else setStep(1); // Reset conversation if "No"
  };

  // Handle selecting a specialty
  const handleSpecialtySelection = (specialty) => {
    setMessages([...messages, { sender: 'bot', text: `Here are some top ${specialty}s available:` }]);
    setStep(1); // Reset after selection
  };

  return (
    <div>
      {/* Chatbot Toggle Button */}
      <button onClick={toggleChat} className="bg-blue-500 text-white p-3 rounded-full shadow-lg fixed bottom-5 right-5">
        <IoChatbubbleEllipsesOutline size={30} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col fixed bottom-20 right-5">
          {/* Chat Header */}
          <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span>ChatBot</span>
            <button onClick={toggleChat} className="text-xl">
              <IoCloseCircleOutline size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Specialist Yes/No Buttons */}
          {step === 3 && (
            <div className="flex justify-around p-3 border-t">
              <button onClick={() => handleSpecialistChoice('yes')} className="bg-green-500 text-white px-4 py-2 rounded-md">Yes</button>
              <button onClick={() => handleSpecialistChoice('no')} className="bg-red-500 text-white px-4 py-2 rounded-md">No</button>
            </div>
          )}

          {/* Specialist Selection */}
          {step === 4 && (
            <div className="p-3 border-t">
              <p className="text-center font-medium">Select a specialty:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {specialties.map((spec, idx) => (
                  <button key={idx} onClick={() => handleSpecialtySelection(spec)} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          {step !== 3 && step !== 4 && (
            <form onSubmit={sendMessage} className="flex items-center p-3 border-t">
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="flex-1 p-2 border rounded-lg focus:outline-none" />
              <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">Send</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;