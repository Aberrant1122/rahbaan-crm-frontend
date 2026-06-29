'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    className?: string;
    align?: 'left' | 'right';
}

export default function CustomSelect({
    value,
    onChange,
    options,
    className = '',
    align = 'left'
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Get the label of the currently selected option
    const selectedOption = options.find(opt => opt.value === value) || options[0];

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className={`relative inline-block ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-primary/50 focus:border-primary/50 outline-none transition-all shadow-sm cursor-pointer"
            >
                <span className="truncate mr-2">{selectedOption ? selectedOption.label : ''}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    className={`absolute z-50 mt-1.5 w-full min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-xl py-1 max-h-60 overflow-y-auto animate-in ${
                        align === 'right' ? 'right-0' : 'left-0'
                    }`}
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                                    isSelected
                                        ? 'bg-primary/5 text-primary font-bold'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
