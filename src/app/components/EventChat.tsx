import { createMessage } from "@/app/lib/actions/messages";
import { PaperAirplaneIcon, LockClosedIcon } from "@heroicons/react/24/outline";

// Define the type for a message based on what getMessagesByEventId returns
type Message = {
  id: string;
  content: string;
  createdAt: Date;
  isPrivate: boolean;
  user: {
    id: number;
    displayName: string | null;
  };
};

interface EventChatProps {
  eventId: string;
  currentUserId?: number;
  initialMessages: Message[];
}

// Main Chat Component
export default function EventChat({ eventId, currentUserId, initialMessages }: EventChatProps) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4">Discussion</h2>
        
        {/* Message Display Area */}
        <div className="space-y-4 mb-4 h-72 overflow-y-auto p-2 bg-base-100 rounded-box">
          {initialMessages.length > 0 ? (
            initialMessages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} currentUserId={currentUserId} />
            ))
          ) : (
            <p className="text-center text-base-content/60 pt-4">No messages yet. Start the conversation!</p>
          )}
        </div>

        {/* Message Input Form */}
        <ChatInput eventId={eventId} />
      </div>
    </div>
  );
}

// Single Message Component
function ChatMessage({ message, currentUserId }: { message: Message; currentUserId?: number }) {
  const isCurrentUser = message.user.id === currentUserId;
  const chatAlignment = isCurrentUser ? "chat-end" : "chat-start";
  const bubbleColor = isCurrentUser ? "chat-bubble-primary" : "chat-bubble";

  return (
    <div className={`chat ${chatAlignment}`}>
      <div className="chat-header flex items-center gap-2 pb-1">
        {message.user.displayName}
        <time className="text-xs opacity-50">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
        {message.isPrivate && <LockClosedIcon className="h-3 w-3 text-warning" title="Private note" />}
      </div>
      <div className={`chat-bubble ${bubbleColor}`}>{message.content}</div>
    </div>
  );
}

// Input Form Component
function ChatInput({ eventId }: { eventId: string }) {
  return (
    <form action={createMessage} className="mt-2">
      <input type="hidden" name="eventId" value={eventId} />
      <div className="form-control">
        <textarea
          name="content"
          className="textarea textarea-bordered w-full"
          placeholder="Write a message..."
          required
        ></textarea>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="form-control">
          <label className="label cursor-pointer gap-2">
            <input type="checkbox" name="isPrivate" value="true" className="checkbox checkbox-sm" />
            <span className="label-text text-sm">Private Note</span>
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Send <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}