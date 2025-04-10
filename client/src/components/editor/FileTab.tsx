import { useFileSystem } from "@/context/FileContext"
import { getIconClassName } from "@/utils/getIconClassName"
import { Icon } from "@iconify/react"
import { IoClose } from "react-icons/io5"
import cn from "classnames"
import { useEffect, useRef } from "react"
import customMapping from "@/utils/customMapping"
import { useSettings } from "@/context/SettingContext"
import langMap from "lang-map"

function FileTab() {
  const {
    openFiles,
    closeFile,
    activeFile,
    updateFileContent,
    setActiveFile,
  } = useFileSystem()
  const fileTabRef = useRef<HTMLDivElement>(null)
  const { setLanguage } = useSettings()

  const changeActiveFile = (fileId: string) => {
    if (activeFile?.id === fileId) return
    updateFileContent(activeFile?.id || "", activeFile?.content || "")
    const file = openFiles.find((file) => file.id === fileId)
    if (file) setActiveFile(file)
  }

  useEffect(() => {
    const fileTabNode = fileTabRef.current
    if (!fileTabNode) return
    const handleWheel = (e: WheelEvent) => {
      fileTabNode.scrollLeft += e.deltaY > 0 ? 100 : -100
    }
    fileTabNode.addEventListener("wheel", handleWheel)
    return () => fileTabNode.removeEventListener("wheel", handleWheel)
  }, [])

  useEffect(() => {
    if (!activeFile?.name) return
    const ext = activeFile.name.split(".").pop()
    if (!ext) return
    if (customMapping[ext]) {
      setLanguage(customMapping[ext])
      return
    }
    const language = langMap.languages(ext)
    setLanguage(language[0])
  }, [activeFile?.name, setLanguage])

  return (
    <div
      className="flex h-[50px] w-full select-none gap-2 overflow-x-auto bg-devjam-light px-2 pb-0 pt-2 text-devjam-text dark:bg-white dark:text-devjam transition-colors"
      ref={fileTabRef}
    >
      {openFiles.map((file) => (
        <span
          key={file.id}
          className={cn(
            "flex w-fit items-center rounded-t-md px-3 py-1 text-sm transition-colors",
            {
              "bg-devjam hover:bg-devjam-hover text-white": file.id === activeFile?.id,
              "bg-devjam-light hover:bg-devjam hover:text-white": file.id !== activeFile?.id,
            }
          )}
          onClick={() => changeActiveFile(file.id)}
        >
          <Icon
            icon={getIconClassName(file.name)}
            fontSize={20}
            className="mr-2 min-w-fit"
          />
          <p
            className="max-w-[120px] truncate"
            title={file.name}
          >
            {file.name}
          </p>
          <IoClose
            className="ml-2 rounded-md p-1 text-sm hover:bg-devjam-accent"
            size={18}
            onClick={(e) => {
              e.stopPropagation()
              closeFile(file.id)
            }}
          />
        </span>
      ))}
    </div>
  )
}

export default FileTab
