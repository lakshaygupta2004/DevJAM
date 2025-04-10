import { useNavigate } from "react-router-dom"

function ConnectionStatusPage() {
  return (
    <div className="flex h-screen min-h-screen flex-col items-center justify-center gap-6 px-4 text-center bg-devjam text-devjam-text dark:bg-white dark:text-devjam transition-colors">
      <ConnectionError />
    </div>
  )
}

const ConnectionError = () => {
  const navigate = useNavigate()
  const reloadPage = () => {
    window.location.reload()
  }

  const gotoHomePage = () => {
    navigate("/")
  }

  return (
    <>
      <span className="whitespace-break-spaces text-lg font-medium text-devjam-muted dark:text-gray-500">
        Oops! Something went wrong. Please try again
      </span>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          className="rounded-md bg-devjam-primary hover:bg-violet-700 px-8 py-2 font-semibold text-white transition"
          onClick={reloadPage}
        >
          Try Again
        </button>
        <button
          className="rounded-md bg-devjam-primary hover:bg-violet-700 px-8 py-2 font-semibold text-white transition"
          onClick={gotoHomePage}
        >
          Go to HomePage
        </button>
      </div>
    </>
  )
}

export default ConnectionStatusPage
