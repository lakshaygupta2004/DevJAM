import { useAppContext } from "@/context/AppContext";
import { useChatRoom } from "@/context/ChatContext";
import { useSocket } from "@/context/SocketContext";
import { ChatMessage } from "@/types/chat";
import { SocketEvent } from "@/types/socket";
import { formatDate } from "@/utils/formateDate";
import { FormEvent, useRef } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { v4 as uuidV4 } from "uuid";

function ChatInput() {
  const { currentUser } = useAppContext();
  const { socket } = useSocket();
  const { setMessages } = useChatRoom();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputVal = inputRef.current?.value.trim();

    if (inputVal && inputVal.length > 0) {
      const message: ChatMessage = {
        id: uuidV4(),
        message: inputVal,
        username: currentUser.username,
        timestamp: formatDate(new Date().toISOString()),
      };
      socket.emit(SocketEvent.SEND_MESSAGE, { message });
      setMessages((messages) => [...messages, message]);

      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex justify-between rounded-md border border-devjam-accent bg-devjam dark:bg-white dark:border-gray-300 transition"
    >
      <input
        type="text"
        className="w-full flex-grow rounded-md border-none bg-devjam text-devjam-text dark:bg-gray-100 dark:text-devjam placeholder-gray-400 p-2 outline-none"
        placeholder="Enter a message..."
        ref={inputRef}
      />
      <button
        className="flex items-center justify-center rounded-r-md bg-devjam-primary hover:bg-violet-700 text-white dark:text-white p-2 transition"
        type="submit"
      >
        <LuSendHorizonal size={24} />
      </button>
    </form>
  );
}

export default ChatInput;
