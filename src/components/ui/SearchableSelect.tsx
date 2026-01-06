import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { SearchIcon } from '../icons/SearchIcon';

interface SearchableSelectProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);


  return (
    <div className="relative" ref={wrapperRef}>
      {label && <span className="text-sm font-medium text-gray-400 mb-1 block">{label}</span>}
      <div className="relative">
        <button
          type="button"
          className="multiselect-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex-grow text-left truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="multiselect-dropdown">
           <div className="p-2 sticky top-0 bg-gray-800 z-10">
            <div className="relative">
                <SearchIcon className="w-5 h-5 text-gray-500 absolute top-1/2 left-2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full bg-black/30 border border-indigo-500/30 rounded-md py-1.5 pl-8 pr-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>
          </div>
          <ul className="max-h-96 overflow-y-auto inner-scroll p-1">
            {filteredOptions.length > 0 ? filteredOptions.map(option => (
              <li
                key={option.value}
                className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${value === option.value ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            )) : <li className="px-3 py-2 text-sm text-gray-500">Nenhum resultado</li>}
          </ul>
        </div>
      )}
    </div>
  );
};