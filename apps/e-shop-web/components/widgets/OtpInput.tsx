import React from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, length = 6 }) => {
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      const newValue = value.substring(0, idx) + value.substring(idx + 1);
      onChange(newValue.padEnd(length, ''));
      return;
    }
    if (val.length === 1) {
      const newValue = value.substring(0, idx) + val + value.substring(idx + 1);
      onChange(newValue);
      if (idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
  ) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    idx: number,
  ) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasteData) return;

    const newValue = value.split('');
    for (let i = 0; i < pasteData.length && idx + i < length; i++) {
      newValue[idx + i] = pasteData[i];
    }
    onChange(newValue.join(''));

    // Focus the next input after the pasted digits
    const nextFocus = Math.min(idx + pasteData.length, length - 1);
    inputsRef.current[nextFocus]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 md:gap-4 my-2">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={(e) => handlePaste(e, idx)}
          className="w-12 h-14 md:w-14 md:h-16 text-center border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30 text-2xl font-semibold transition-all duration-150 outline-none bg-white shadow-sm"
        />
      ))}
    </div>
  );
};

export default OtpInput;
