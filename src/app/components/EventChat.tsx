'use client'; // Component now uses client-side hooks

import { createMessage, getNewerMessages } from "@/app/lib/actions/messages";
import { PaperAirplaneIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useRef, useTransition, useEffect, useState } from "react"; // Import useState
import ChatLocalTime from "./ChatLocalTime";

// Define the type for a message based on what getMessagesByEventId returns
type Message = {
  id: string;
  content: string;
  createdAt: Date;
  isPrivate: boolean;
  user: {
    id: string;
    displayName: string | null;
  };
};

// Define the type for the chat translations
type ChatTranslations = {
  title: string;
  startConversation: string;
  noMessages: string;
  writeMessage: string;
  privateNote: string;
  send: string;
  privateIndicator: string;
};

interface EventChatProps {
  eventId: string;
  currentUserId?: string;
  initialMessages: Message[];
  translations: ChatTranslations;
  timeFormat: boolean; 
}

// Main Chat Component
export default function EventChat({ eventId, currentUserId, initialMessages, translations, timeFormat }: EventChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const hasMessages = messages.length > 0;
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTop = scrollHeight;
    }
  }, [messages]);

  // Effect to track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Set initial state in case tab is opened in the background
    handleVisibilityChange();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Polling for new messages, now aware of page visibility
  useEffect(() => {
    // Only poll if there are messages AND the page is visible to the user.
    if (messages.length === 0 || !isPageVisible) {
      return; 
    }

    const pollInterval = setInterval(async () => {
      const lastMessage = messages[messages.length - 1];
      const newMessages = await getNewerMessages(eventId, lastMessage.createdAt.toString(), currentUserId);
      if (newMessages.length > 0) {
        setMessages(prevMessages => [...prevMessages, ...newMessages]);
      }
    }, 30000); 

    // Cleanup interval when component unmounts or dependencies change (e.g., page becomes hidden)
    return () => clearInterval(pollInterval);
  }, [messages, eventId, currentUserId, isPageVisible]); // Add isPageVisible to dependencies


  return (
    <div className={`collapse collapse-arrow bg-base-200 shadow-xl ${hasMessages ? 'collapse-open' : ''}`}>
      <input type="checkbox" defaultChecked={hasMessages} /> 
      <div className="collapse-title text-xl font-medium">
        {hasMessages ? translations.title : translations.startConversation}
      </div>
      <div className="collapse-content !p-0">
        <div className="card-body !p-2"> 
          {/* Message Display Area */}
          {hasMessages && (
            <div ref={messagesContainerRef} className="space-y-2 mb-2 max-h-72 overflow-y-auto p-2 bg-base-100 rounded-box">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  currentUserId={currentUserId}
                  translations={translations}
                  timeFormat={timeFormat}
                />
              ))}
            </div>
          )}
          
          {/* Message Input Form */}
          <ChatInput 
            eventId={eventId} 
            translations={translations}
            onMessageSent={(newMsg) => setMessages(prev => [...prev, newMsg])}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
}

// Single Message Component
function ChatMessage({ message, currentUserId, translations, timeFormat }: { message: Message; currentUserId?: string; translations: ChatTranslations; timeFormat: boolean }) {
  const isCurrentUser = message.user.id === currentUserId;
  const chatAlignment = isCurrentUser ? "chat-end" : "chat-start";
  const bubbleColor = isCurrentUser ? "chat-bubble-primary" : "chat-bubble bg-base-300";

  return (
    <div className={`chat ${chatAlignment}`}>
      <div className="chat-header flex items-center gap-2 pb-1">
        {message.user.displayName}
        <ChatLocalTime date={message.createdAt.toString()} timeFormat={timeFormat} /> 
        {message.isPrivate && <LockClosedIcon className="h-3 w-3 text-warning" title={translations.privateIndicator} />}
      </div>
      <div className={`chat-bubble ${bubbleColor} whitespace-pre-line`}>{message.content}</div>
    </div>
  );
}

// Input Form Component - Now a Client Component
function ChatInput({ eventId, translations, onMessageSent, currentUserId }: { eventId: string; translations: ChatTranslations; onMessageSent: (msg: Message) => void; currentUserId?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = (formData: FormData) => {
    // Don't send if content is just whitespace
    if (!formData.get('content')?.toString().trim()) {
        return;
    }

    startTransition(async () => {
        const newMsg = await createMessage(formData);
        if (newMsg) {
            onMessageSent(newMsg); // Add the new message to the chat
        }
        formRef.current?.reset();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        handleFormSubmit(formData);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleFormSubmit(formData);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-1">
      <input type="hidden" name="eventId" value={eventId} />
      <div className="form-control">
        <textarea
          name="content"
          className="textarea textarea-bordered w-full"
          placeholder={translations.writeMessage}
          required
          onKeyDown={handleKeyDown}
          disabled={isPending}
        ></textarea>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="form-control">
          <label className="label cursor-pointer gap-2">
            <input type="checkbox" name="isPrivate" value="true" className="checkbox checkbox-primary checkbox-sm" />
            <span className="label-text text-sm">{translations.privateNote}</span>
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-sm" disabled={isPending}>
          {isPending ? <span className="loading loading-spinner loading-xs"></span> : translations.send}
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}