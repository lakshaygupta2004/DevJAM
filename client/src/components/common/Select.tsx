import { ChangeEvent } from "react"
import { PiCaretDownBold } from "react-icons/pi"

interface SelectProps {
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  value: string
  options: string[]
  title: string
}

function Select({ onChange, value, options, title }: SelectProps) {
  return (
    <div className="relative w-full">
      <label className="mb-2 block text-sm font-medium text-devjam-text dark:text-devjam">
        {title}
      </label>
      <select
        className="w-full appearance-none rounded-md border border-devjam-accent bg-devjam-light text-white dark:bg-white dark:text-devjam px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-devjam-primary transition"
        value={value}
        onChange={onChange}
      >
        {options.sort().map((option) => {
          const value = option
          const name = option.charAt(0).toUpperCase() + option.slice(1)
          return (
            <option key={name} value={value}>
              {name}
            </option>
          )
        })}
      </select>
      <PiCaretDownBold
        size={16}
        className="absolute bottom-3 right-4 z-10 text-devjam-muted dark:text-gray-500 pointer-events-none"
      />
    </div>
  )
}

export default Select
