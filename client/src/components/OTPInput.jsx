import React, { useState, useRef } from 'react';

const OTPInput = ({ length = 6, onComplete }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only last character
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Call onComplete if all filled
        if (newOtp.every(digit => digit !== '') && onComplete) {
            onComplete(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length);

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, i) => {
            if (i < length) newOtp[i] = char;
        });
        setOtp(newOtp);

        // Focus last filled input
        const lastIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[lastIndex]?.focus();

        // Call onComplete if all filled
        if (newOtp.every(digit => digit !== '') && onComplete) {
            onComplete(newOtp.join(''));
        }
    };

    return (
        <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-purple-300 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
            ))}
        </div>
    );
};

export default OTPInput;
