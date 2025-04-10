import { useAppContext } from "@/context/AppContext"
import { RemoteUser, USER_CONNECTION_STATUS } from "@/types/user"
import Avatar from "react-avatar"

function Users() {
  const { users } = useAppContext()

  return (
    <div className="flex min-h-[200px] flex-grow justify-center overflow-y-auto bg-devjam dark:bg-white py-2 transition-colors">
      <div className="flex h-full w-full flex-wrap items-start gap-x-4 gap-y-6 px-4">
        {users.map((user) => (
          <User key={user.socketId} user={user} />
        ))}
      </div>
    </div>
  )
}

const User = ({ user }: { user: RemoteUser }) => {
  const { username, status } = user
  const title = `${username} - ${status === USER_CONNECTION_STATUS.ONLINE ? "online" : "offline"}`

  return (
    <div
      className="relative flex w-[100px] flex-col items-center gap-2 text-devjam-text dark:text-devjam"
      title={title}
    >
      <Avatar name={username} size="50" round="12px" title={title} />
      <p className="line-clamp-2 max-w-full text-ellipsis break-words text-sm text-center">
        {username}
      </p>
      <div
        className={`absolute right-5 top-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-200 ${
          status === USER_CONNECTION_STATUS.ONLINE
            ? "bg-green-500"
            : "bg-devjam-danger"
        }`}
      ></div>
    </div>
  )
}

export default Users
