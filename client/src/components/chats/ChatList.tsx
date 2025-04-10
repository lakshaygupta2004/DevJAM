import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { SyntheticEvent, useEffect, useRef } from "react"

function ChatList() {
  const {
    messages,
    isNewMessage,
    setIsNewMessage,
    lastScrollHeight,
    setLastScrollHeight,
  } = useChatRoom()
  const { currentUser } = useAppContext()
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  const handleScroll = (e: SyntheticEvent) => {
    const container = e.target as HTMLDivElement
    setLastScrollHeight(container.scrollTop)
  }

  useEffect(() => {
    if (!messagesContainerRef.current) return
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (isNewMessage) {
      setIsNewMessage(false)
    }
    if (messagesContainerRef.current)
      messagesContainerRef.current.scrollTop = lastScrollHeight
  }, [isNewMessage, setIsNewMessage, lastScrollHeight])

  return (
    <div
      className="flex-grow overflow-auto rounded-md bg-devjam-hover dark:bg-gray-100 p-2 transition-colors"
      ref={messagesContainerRef}
      onScroll={handleScroll}
    >
      {/* Chat messages */}
      {messages.map((message, index) => {
        const isUser = message.username === currentUser.username
        return (
          <div
            key={index}
            className={
              `mb-2 w-[80%] break-words rounded-md px-3 py-2 
              ${isUser ? "ml-auto bg-devjam-primary text-white" : "bg-devjam-light text-white dark:bg-gray-200 dark:text-devjam"}`
            }
          >
            <div className="flex justify-between text-xs mb-1">
              <span className="text-devjam-primary dark:text-purple-700 font-semibold">
                {message.username}
              </span>
              <span className="text-devjam-muted dark:text-gray-500">
                {message.timestamp}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{message.message}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ChatList
