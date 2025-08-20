'use client'

import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { clsx } from 'clsx'

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "선택해주세요",
  className
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue))
  }

  const selectedOptions = options.filter(option => value.includes(option.value))

  return (
    <div className={clsx("relative", className)}>
      {/* Selected Items Display */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map(option => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
            >
              {option.label}
              <button
                type="button"
                onClick={() => handleRemove(option.value)}
                className="hover:text-primary-900 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-left flex items-center justify-between"
      >
        <span className={clsx(
          selectedOptions.length > 0 ? "text-gray-700" : "text-gray-500"
        )}>
          {selectedOptions.length > 0 
            ? `${selectedOptions.length}개 선택됨` 
            : placeholder
          }
        </span>
        <ChevronDown className={clsx(
          "w-4 h-4 text-gray-400 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map(option => {
            const isSelected = value.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleToggle(option.value)}
                className={clsx(
                  "w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors",
                  isSelected && "bg-primary-50 text-primary-700"
                )}
              >
                <span className="font-medium">{option.label}</span>
                {isSelected && <Check className="w-4 h-4 text-primary-600" />}
              </button>
            )
          })}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
