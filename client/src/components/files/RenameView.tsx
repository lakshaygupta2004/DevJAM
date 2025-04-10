import { useFileSystem } from "@/context/FileContext";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface RenameViewProps {
  id: string;
  preName: string;
  type: "file" | "directory";
  setEditing: (isEditing: boolean) => void;
}

function RenameView({ id, preName, setEditing, type }: RenameViewProps) {
  const [name, setName] = useState<string>(preName || "");
  const { renameFile, openFile, renameDirectory } = useFileSystem();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

    if (name === "") {
      toast.error(`${capitalizedType} name cannot be empty`);
    } else if (name.length > 25) {
      toast.error(
        `${capitalizedType} name cannot be longer than 25 characters`
      );
    } else if (name === preName) {
      toast.error(`${capitalizedType} name cannot be the same as before`);
    } else {
      const isRenamed =
        type === "directory" ? renameDirectory(id, name) : renameFile(id, name);

      if (isRenamed && type === "file") {
        openFile(id);
      }
      if (!isRenamed) {
        toast.error(`${capitalizedType} with same name already exists`);
      } else {
        setEditing(false);
      }
    }
  };

  const handleFormKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        formRef.current?.requestSubmit();
      } else if (e.key === "Escape") {
        setEditing(false);
      }
    },
    [setEditing]
  );

  const handleDocumentEvent = useCallback(
    (e: KeyboardEvent | MouseEvent) => {
      const formNode = formRef.current;

      if (formNode && !formNode.contains(e.target as Node)) {
        // Handle outside click logic here
        setEditing(false);
      }
    },
    [setEditing]
  );

  useEffect(() => {
    const formNode = formRef.current;

    if (!formNode) return;

    formNode.focus();

    formNode.addEventListener("keydown", handleFormKeyDown);
    document.addEventListener("keydown", handleDocumentEvent);
    document.addEventListener("click", handleDocumentEvent);

    return () => {
      formNode.removeEventListener("keydown", handleFormKeyDown);
      document.removeEventListener("keydown", handleDocumentEvent);
      document.removeEventListener("click", handleDocumentEvent);
    };
  }, [handleDocumentEvent, handleFormKeyDown, setEditing]);

  return (
    <div className="rounded-md w-full">
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="flex w-full items-center gap-2 rounded-md"
      >
        <input
          type="text"
          className="w-full flex-grow rounded-md bg-devjam text-devjam-text dark:bg-white dark:text-devjam placeholder-gray-400 px-2 py-1 text-base outline-none focus:ring-2 focus:ring-devjam-primary transition"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Rename..."
        />
      </form>
    </div>
  );
}

export default RenameView;
