import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useViews } from "@/context/ViewContext"
import { useContextMenu } from "@/hooks/useContextMenu"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ACTIVITY_STATE } from "@/types/app"
import { FileSystemItem, Id } from "@/types/file"
import { sortFileSystemItem } from "@/utils/file"
import { getIconClassName } from "@/utils/getIconClassName"
import { Icon } from "@iconify/react"
import cn from "classnames"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai"
import { MdDelete } from "react-icons/md"
import { PiPencilSimpleFill } from "react-icons/pi"
import {
  RiFileAddLine,
  RiFolderAddLine,
  RiFolderUploadLine,
} from "react-icons/ri"
import RenameView from "./RenameView"
import useResponsive from "@/hooks/useResponsive"

function FileStructureView() {
  const { fileStructure, createFile, createDirectory, collapseDirectories } =
    useFileSystem()
  const explorerRef = useRef<HTMLDivElement | null>(null)
  const [selectedDirId, setSelectedDirId] = useState<Id | null>(null)
  const { minHeightReached } = useResponsive()

  const handleClickOutside = (e: MouseEvent) => {
    if (
      explorerRef.current &&
      !explorerRef.current.contains(e.target as Node)
    ) {
      setSelectedDirId(fileStructure.id)
    }
  }

  const handleCreateFile = () => {
    const fileName = prompt("Enter file name")
    if (fileName) {
      const parentDirId: Id = selectedDirId || fileStructure.id
      createFile(parentDirId, fileName)
    }
  }

  const handleCreateDirectory = () => {
    const dirName = prompt("Enter directory name")
    if (dirName) {
      const parentDirId: Id = selectedDirId || fileStructure.id
      createDirectory(parentDirId, dirName)
    }
  }

  const sortedFileStructure = sortFileSystemItem(fileStructure)

  return (
    <div onClick={handleClickOutside} className="flex flex-grow flex-col">
      <div className="view-title flex justify-between text-devjam-text dark:text-devjam px-2 pb-1">
        <h2 className="font-semibold">Files</h2>
        <div className="flex gap-2">
          <button
            className="rounded-md px-1 hover:bg-devjam-hover"
            onClick={handleCreateFile}
            title="Create File"
          >
            <RiFileAddLine size={20} />
          </button>
          <button
            className="rounded-md px-1 hover:bg-devjam-hover"
            onClick={handleCreateDirectory}
            title="Create Directory"
          >
            <RiFolderAddLine size={20} />
          </button>
          <button
            className="rounded-md px-1 hover:bg-devjam-hover"
            onClick={collapseDirectories}
            title="Collapse All Directories"
          >
            <RiFolderUploadLine size={20} />
          </button>
        </div>
      </div>
      <div
        className={cn(
          "min-h-[200px] flex-grow overflow-auto pr-2 sm:min-h-0 text-devjam-text dark:text-devjam",
          {
            "h-[calc(80vh-170px)]": !minHeightReached,
            "h-[85vh]": minHeightReached,
          }
        )}
        ref={explorerRef}
      >
        {sortedFileStructure.children &&
          sortedFileStructure.children.map((item) => (
            <Directory
              key={item.id}
              item={item}
              setSelectedDirId={setSelectedDirId}
            />
          ))}
      </div>
    </div>
  )
}

function Directory({
  item,
  setSelectedDirId,
}: {
  item: FileSystemItem
  setSelectedDirId: (id: Id) => void
}) {
  const [isEditing, setEditing] = useState<boolean>(false)
  const dirRef = useRef<HTMLDivElement | null>(null)
  const { coords, menuOpen, setMenuOpen } = useContextMenu({ ref: dirRef })
  const { deleteDirectory, toggleDirectory } = useFileSystem()

  const handleDirClick = (dirId: string) => {
    setSelectedDirId(dirId)
    toggleDirectory(dirId)
  }

  const handleRenameDirectory = (e: MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    setEditing(true)
  }

  const handleDeleteDirectory = (e: MouseEvent, id: Id) => {
    e.stopPropagation()
    setMenuOpen(false)
    if (confirm("Are you sure you want to delete directory?")) {
      deleteDirectory(id)
    }
  }

  useEffect(() => {
    const dirNode = dirRef.current
    if (!dirNode) return
    dirNode.tabIndex = 0
    const handleF2 = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.stopPropagation()
        setEditing(true)
      }
    }
    dirNode.addEventListener("keydown", handleF2)
    return () => {
      dirNode.removeEventListener("keydown", handleF2)
    }
  }, [])

  if (item.type === "file") {
    return <File item={item} setSelectedDirId={setSelectedDirId} />
  }

  return (
    <div className="overflow-x-auto">
      <div
        className="flex w-full items-center rounded-md px-2 py-1 hover:bg-devjam-hover"
        onClick={() => handleDirClick(item.id)}
        ref={dirRef}
      >
        {item.isOpen ? (
          <AiOutlineFolderOpen size={24} className="mr-2 min-w-fit" />
        ) : (
          <AiOutlineFolder size={24} className="mr-2 min-w-fit" />
        )}
        {isEditing ? (
          <RenameView
            id={item.id}
            preName={item.name}
            type="directory"
            setEditing={setEditing}
          />
        ) : (
          <p
            className="flex-grow cursor-pointer overflow-hidden truncate"
            title={item.name}
          >
            {item.name}
          </p>
        )}
      </div>
      <div className={cn({ hidden: !item.isOpen, block: item.isOpen, "pl-4": item.name !== "root" })}>
        {item.children &&
          item.children.map((item) => (
            <Directory
              key={item.id}
              item={item}
              setSelectedDirId={setSelectedDirId}
            />
          ))}
      </div>

      {menuOpen && (
        <DirectoryMenu
          handleDeleteDirectory={handleDeleteDirectory}
          handleRenameDirectory={handleRenameDirectory}
          id={item.id}
          left={coords.x}
          top={coords.y}
        />
      )}
    </div>
  )
}

const File = ({
  item,
  setSelectedDirId,
}: {
  item: FileSystemItem
  setSelectedDirId: (id: Id) => void
}) => {
  const { deleteFile, openFile } = useFileSystem()
  const [isEditing, setEditing] = useState(false)
  const { setIsSidebarOpen } = useViews()
  const { isMobile } = useWindowDimensions()
  const { activityState, setActivityState } = useAppContext()
  const fileRef = useRef<HTMLDivElement | null>(null)
  const { menuOpen, coords, setMenuOpen } = useContextMenu({ ref: fileRef })

  const handleFileClick = (fileId: string) => {
    if (isEditing) return
    setSelectedDirId(fileId)
    openFile(fileId)
    if (isMobile) setIsSidebarOpen(false)
    if (activityState === ACTIVITY_STATE.DRAWING) {
      setActivityState(ACTIVITY_STATE.CODING)
    }
  }

  const handleRenameFile = (e: MouseEvent) => {
    e.stopPropagation()
    setEditing(true)
    setMenuOpen(false)
  }

  const handleDeleteFile = (e: MouseEvent, id: Id) => {
    e.stopPropagation()
    setMenuOpen(false)
    if (confirm("Are you sure you want to delete file?")) {
      deleteFile(id)
    }
  }

  useEffect(() => {
    const fileNode = fileRef.current
    if (!fileNode) return
    fileNode.tabIndex = 0
    const handleF2 = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.stopPropagation()
        setEditing(true)
      }
    }
    fileNode.addEventListener("keydown", handleF2)
    return () => fileNode.removeEventListener("keydown", handleF2)
  }, [])

  return (
    <div
      className="flex w-full items-center rounded-md px-2 py-1 hover:bg-devjam-hover"
      onClick={() => handleFileClick(item.id)}
      ref={fileRef}
    >
      <Icon
        icon={getIconClassName(item.name)}
        fontSize={22}
        className="mr-2 min-w-fit"
      />
      {isEditing ? (
        <RenameView
          id={item.id}
          preName={item.name}
          type="file"
          setEditing={setEditing}
        />
      ) : (
        <p className="flex-grow cursor-pointer overflow-hidden truncate" title={item.name}>
          {item.name}
        </p>
      )}

      {menuOpen && (
        <FileMenu
          top={coords.y}
          left={coords.x}
          id={item.id}
          handleRenameFile={handleRenameFile}
          handleDeleteFile={handleDeleteFile}
        />
      )}
    </div>
  )
}

const FileMenu = ({
  top,
  left,
  id,
  handleRenameFile,
  handleDeleteFile,
}: {
  top: number
  left: number
  id: Id
  handleRenameFile: (e: MouseEvent) => void
  handleDeleteFile: (e: MouseEvent, id: Id) => void
}) => (
  <div
    className="absolute z-10 w-[150px] rounded-md border border-devjam-accent bg-devjam p-1 shadow-lg text-devjam-text"
    style={{ top, left }}
  >
    <button
      onClick={handleRenameFile}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-devjam-hover"
    >
      <PiPencilSimpleFill size={18} />
      Rename
    </button>
    <button
      onClick={(e) => handleDeleteFile(e, id)}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-devjam-danger hover:bg-devjam-hover"
    >
      <MdDelete size={20} />
      Delete
    </button>
  </div>
)

const DirectoryMenu = FileMenu

export default FileStructureView
