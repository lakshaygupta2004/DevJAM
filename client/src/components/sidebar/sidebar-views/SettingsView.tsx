import Select from "@/components/common/Select"
import { useSettings } from "@/context/SettingContext"
import useResponsive from "@/hooks/useResponsive"
import { editorFonts } from "@/resources/Fonts"
import { editorThemes } from "@/resources/Themes"
import { langNames } from "@uiw/codemirror-extensions-langs"
import { ChangeEvent, useEffect, useState } from "react"

function SettingsView() {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    showGitHubCorner,
    setShowGitHubCorner,
    resetSettings,
  } = useSettings()

  const { viewHeight } = useResponsive()

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  )

  const handleDarkModeToggle = () => {
    const enabled = !darkMode
    setDarkMode(enabled)
    localStorage.setItem("theme", enabled ? "dark" : "light")

    if (enabled) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleFontFamilyChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setFontFamily(e.target.value)
  const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setTheme(e.target.value)
  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setLanguage(e.target.value)
  const handleFontSizeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setFontSize(parseInt(e.target.value))
  const handleShowGitHubCornerChange = (e: ChangeEvent<HTMLInputElement>) =>
    setShowGitHubCorner(e.target.checked)

  useEffect(() => {
    const editor = document.querySelector(
      ".cm-editor > .cm-scroller"
    ) as HTMLElement
    if (editor) editor.style.fontFamily = `${fontFamily}, monospace`
  }, [fontFamily])

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setDarkMode(true)
    } else {
      document.documentElement.classList.remove("dark")
      setDarkMode(false)
    }
  }, [])

  return (
    <div
      className="relative flex flex-col items-center gap-4 p-4 bg-devjam-light text-devjam-text dark:bg-white dark:text-devjam transition-colors"
      style={{ height: viewHeight }}
    >
      <h1 className="view-title text-xl font-semibold">Settings</h1>

      {/* Font + Size */}
      <div className="flex w-full flex-col sm:flex-row sm:items-end gap-4">
        <Select
          onChange={handleFontFamilyChange}
          value={fontFamily}
          options={editorFonts}
          title="Font Family"
        />
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Font Size</label>
          <select
            value={fontSize}
            onChange={handleFontSizeChange}
            className="rounded-md border border-devjam-accent bg-devjam text-white dark:bg-gray-100 dark:text-devjam px-4 py-2 outline-none focus:ring-2 focus:ring-devjam-primary transition"
            title="Font Size"
          >
            {[...Array(13).keys()].map((size) => (
              <option key={size} value={size + 12}>
                {size + 12}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor Theme & Language */}
      <Select
        onChange={handleThemeChange}
        value={theme}
        options={Object.keys(editorThemes)}
        title="Editor Theme"
      />
      <Select
        onChange={handleLanguageChange}
        value={language}
        options={langNames}
        title="Editor Language"
      />

      {/* GitHub Corner Toggle */}
      <div className="flex w-full items-center justify-between">
        <label className="text-sm font-medium">Show GitHub Corner</label>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={showGitHubCorner}
            onChange={handleShowGitHubCornerChange}
            className="peer sr-only"
          />
          <div className="peer h-6 w-12 rounded-full bg-devjam-hover after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-6 peer-focus:outline-none" />
        </label>
      </div>

      {/* Reset Button */}
      <button
        className="mt-4 w-full rounded-md bg-devjam-hover px-4 py-2 text-sm font-semibold text-white dark:text-devjam transition hover:bg-devjam-accent/30"
        onClick={resetSettings}
      >
        Reset to Default
      </button>

      {/* 🌙 / ☀️ Dark Mode Toggle in bottom corner */}
      <div className="absolute bottom-4 left-4">
        <button
          onClick={handleDarkModeToggle}
          className="flex items-center gap-2 rounded-md px-3 py-1 bg-devjam-hover text-white dark:text-devjam hover:bg-devjam-accent/30 transition"
          title="Toggle theme"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </div>
  )
}

export default SettingsView
