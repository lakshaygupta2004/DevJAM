import { useRunCode } from "@/context/RunCodeContext";
import useResponsive from "@/hooks/useResponsive";
import { ChangeEvent } from "react";
import toast from "react-hot-toast";
import { LuCopy } from "react-icons/lu";
import { PiCaretDownBold } from "react-icons/pi";

function RunView() {
  const { viewHeight } = useResponsive();
  const {
    setInput,
    output,
    isRunning,
    supportedLanguages,
    selectedLanguage,
    setSelectedLanguage,
    runCode,
  } = useRunCode();

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const lang = JSON.parse(e.target.value);
    setSelectedLanguage(lang);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Output copied to clipboard");
  };

  return (
    <div
      className="flex flex-col items-center gap-2 p-4 bg-devjam-light text-devjam-text dark:bg-white dark:text-devjam transition-colors"
      style={{ height: viewHeight }}
    >
      <h1 className="view-title text-xl font-semibold">Run Code</h1>

      <div className="flex h-[90%] w-full flex-col items-end gap-2 md:h-[92%]">
        {/* Language dropdown */}
        <div className="relative w-full">
          <select
            className="w-full appearance-none rounded-md border border-devjam-accent bg-devjam px-4 py-2 text-white dark:bg-gray-100 dark:text-devjam outline-none focus:ring-2 focus:ring-devjam-primary transition"
            value={JSON.stringify(selectedLanguage)}
            onChange={handleLanguageChange}
          >
            {supportedLanguages
              .sort((a, b) => (a.language > b.language ? 1 : -1))
              .map((lang, i) => (
                <option key={i} value={JSON.stringify(lang)}>
                  {lang.language + (lang.version ? ` (${lang.version})` : "")}
                </option>
              ))}
          </select>
          <PiCaretDownBold
            size={16}
            className="absolute bottom-3 right-4 z-10 text-white pointer-events-none"
          />
        </div>

        {/* Input area */}
        <textarea
          className="min-h-[120px] w-full resize-none rounded-md border border-devjam-accent bg-devjam text-white dark:bg-gray-100 dark:text-devjam p-2 outline-none focus:ring-2 focus:ring-devjam-primary transition"
          placeholder="Write your input here..."
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Run button */}
        <button
          className="flex w-full justify-center rounded-md bg-devjam-primary hover:bg-violet-700 p-2 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          onClick={runCode}
          disabled={isRunning}
        >
          {isRunning ? "Running..." : "Run"}
        </button>

        {/* Output section */}
        <label className="flex w-full justify-between font-medium text-sm">
          Output:
          <button onClick={copyOutput} title="Copy Output">
            <LuCopy
              size={18}
              className="cursor-pointer text-devjam hover:text-violet-300"
            />
          </button>
        </label>

        <div className="w-full flex-grow overflow-y-auto rounded-md border border-devjam-accent bg-gray-900 text-white p-2 text-sm font-mono">
          <code>
            <pre className="text-wrap whitespace-pre-wrap">{output}</pre>
          </code>
        </div>
      </div>
    </div>
  );
}

export default RunView;
