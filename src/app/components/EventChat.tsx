'use client'; // Component now uses client-side hooks

import { createMessage } from "@/app/lib/actions/messages";
import { PaperAirplaneIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useRef, useTransition, useEffect } from "react"; // Import useEffect
import ChatLocalTime from "./ChatLocalTime"; // Add this import

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
  timeFormat: boolean; // <-- Add this prop
}

// Main Chat Component
export default function EventChat({ eventId, currentUserId, initialMessages, translations, timeFormat }: EventChatProps) {
  const hasMessages = initialMessages.length > 0;
  const messagesContainerRef = useRef<HTMLDivElement>(null); // Create a ref for the messages container

  // useEffect hook to scroll to the bottom on initial render
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTop = scrollHeight;
    }
  }, []); // Empty dependency array ensures this runs only once on mount

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
            <div ref={messagesContainerRef} className="space-y-2 mb-2 max-h-72 overflow-y-auto p-2 bg-base-100 rounded-box"> {/* Attach the ref */}
              {initialMessages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  currentUserId={currentUserId}
                  translations={translations}
                  timeFormat={timeFormat} // <-- Pass here
                />
              ))}
            </div>
          )}
          
          {/* Message Input Form */}
          <ChatInput eventId={eventId} translations={translations} />
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
function ChatInput({ eventId, translations }: { eventId: string; translations: ChatTranslations }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter, but allow new line with Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (formRef.current) {
        // Create a FormData object from the form
        const formData = new FormData(formRef.current);
        // Check if content is not just whitespace
        if (formData.get('content')?.toString().trim()) {
            startTransition(() => {
                // Programmatically call the server action
                createMessage(formData);
                // Reset the form after submission
                formRef.current?.reset();
            });
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get('content')?.toString().trim()) {
        startTransition(() => {
            createMessage(formData);
            formRef.current?.reset();
        });
    }
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