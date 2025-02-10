import React from "react";

interface RadioButtonProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children?: React.ReactNode;
}

const RadioButton: React.FC<RadioButtonProps> = ({ name, value, checked, onChange, children }) => {
  return (
    <label
      className={`relative flex items-center gap-2 cursor-pointer font-bold transition-colors  ${
        checked ? "text-gray-900" : "text-gray-500"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="hidden" />
      <span
        className={`w-4 h-4 rounded-full border transition-all ${
          checked ? "border-green100 bg-white" : "border-gray-300 bg-white"
        } flex items-center justify-center`}
      >
        {checked && <span className="w-2.5 h-2.5 bg-green100 rounded-full"></span>}
      </span>
      {children}
    </label>
  );
};

export default RadioButton;
