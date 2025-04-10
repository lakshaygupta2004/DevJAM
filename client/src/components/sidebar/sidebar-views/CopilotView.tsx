import { useCopilot } from "@/context/CopilotContext";
import { useFileSystem } from "@/context/FileContext";
import { useSocket } from "@/context/SocketContext";
import useResponsive from "@/hooks/useResponsive";
import { SocketEvent } from "@/types/socket";
import toast from "react-hot-toast";
import { LuClipboardPaste, LuCopy, LuRepeat } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

function CopilotView() {
  const { socket } = useSocket();
  const { viewHeight } = useResponsive();
  const { generateCode, output, isRunning, setInput } = useCopilot();
  const { activeFile, updateFileContent, setActiveFile } = useFileSystem();

  const copyOutput = async () => {
    try {
      const content = output.replace(/```[\w]*\n?/g, "").trim();
      await navigator.clipboard.writeText(content);
      toast.success("Output copied to clipboard");
    } catch (error) {
      toast.error("Unable to copy output to clipboard");
      console.log(error);
    }
  };

  const pasteCodeInFile = () => {
    if (activeFile) {
      const fileContent = activeFile.content ? `${activeFile.content}\n` : "";
      const content = `${fileContent}${output.replace(/```[\w]*\n?/g, "").trim()}`;
      updateFileContent(activeFile.id, content);
      // Update the content of the active file if it's the same file
      setActiveFile({ ...activeFile, content });
      toast.success("Code pasted successfully");
      // Emit the FILE_UPDATED event to the server
      socket.emit(SocketEvent.FILE_UPDATED, {
        fileId: activeFile.id,
        newContent: content,
      });
    }
  };

  const replaceCodeInFile = () => {
    if (activeFile) {
      const isConfirmed = confirm(
        `Are you sure you want to replace the code in the file?`
      );
      if (!isConfirmed) return;
      const content = output.replace(/```[\w]*\n?/g, "").trim();
      updateFileContent(activeFile.id, content);
      // Update the content of the active file if it's the same file
      setActiveFile({ ...activeFile, content });
      toast.success("Code replaced successfully");
      // Emit the FILE_UPDATED event to the server
      socket.emit(SocketEvent.FILE_UPDATED, {
        fileId: activeFile.id,
        newContent: content,
      });
    }
  };

  return (
    <div
      className="flex max-h-full min-h-[400px] w-full flex-col gap-2 p-4 bg-devjam-light dark:bg-white text-devjam-text dark:text-devjam transition-colors"
      style={{ height: viewHeight }}
    >
      <h1 className="view-title text-xl font-semibold text-devjam">Copilot</h1>

      <textarea
        className="min-h-[120px] w-full rounded-md border border-devjam-accent bg-devjam text-white dark:bg-gray-100 dark:text-devjam placeholder-gray-400 p-2 outline-none focus:ring-2 focus:ring-devjam-primary transition"
        placeholder="What code do you want to generate?"
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="mt-1 flex w-full justify-center rounded-md bg-devjam-primary hover:bg-violet-700 p-2 font-bold text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
        onClick={generateCode}
        disabled={isRunning}
      >
        {isRunning ? "Generating..." : "Generate Code"}
      </button>

      {output && (
        <div className="flex justify-end gap-4 pt-2 text-devjam-text dark:text-devjam">
          <button title="Copy Output" onClick={copyOutput}>
            <LuCopy
              size={18}
              className="cursor-pointer hover:text-violet-300"
            />
          </button>
          <button title="Replace code in file" onClick={replaceCodeInFile}>
            <LuRepeat
              size={18}
              className="cursor-pointer hover:text-violet-300"
            />
          </button>
          <button title="Paste code in file" onClick={pasteCodeInFile}>
            <LuClipboardPaste
              size={18}
              className="cursor-pointer hover:text-violet-300"
            />
          </button>
        </div>
      )}

      <div className="h-full w-full overflow-y-auto rounded-lg border border-devjam-accent bg-gray-900 p-2">
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "javascript";

              return !inline ? (
                <SyntaxHighlighter
                  style={dracula}
                  language={language}
                  PreTag="pre"
                  className="!m-0 !rounded-md !bg-gray-900 !text-white"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-800 rounded px-1" {...props}>
                  {children}
                </code>
              );
            },
            pre({ children }) {
              return <pre className="h-full">{children}</pre>;
            },
          }}
        >
          {output}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default CopilotView;
