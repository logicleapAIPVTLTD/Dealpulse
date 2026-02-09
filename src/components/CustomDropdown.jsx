import React, { useState, useEffect, useRef } from 'react';
import './CustomDropdown.css';

export default function CustomDropdown({ label, options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find the label for the currently selected value
  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown-wrapper" ref={dropdownRef}>
      <label>{label}</label>
      <div className="custom-dropdown-container">
        <button className="custom-dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
          {selectedOption ? (
            <div className="dropdown-option-item">
              {selectedOption.icon}
              <span>{selectedOption.label}</span>
            </div>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
          {/* Arrow Icon */}
          <svg className={`arrow ${isOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>

        {isOpen && (
          <ul className="custom-dropdown-menu">
            {options.map((option) => (
              <li key={option.value} onClick={() => handleSelect(option.value)} className="dropdown-option-item">
                {option.icon}
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}