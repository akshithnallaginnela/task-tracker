# 🔐 OTP Email Verification - Complete Implementation Guide

**Student Task Tracker - Email OTP System**

---

## 📋 Table of Contents

1. [What's Been Implemented](#whats-been-implemented)
2. [Backend Overview](#backend-overview)
3. [Frontend Implementation](#frontend-implementation)
4. [Testing Guide](#testing-guide)
5. [Troubleshooting](#troubleshooting)

---

## ✅ What's Been Implemented

### Backend (100% Complete)

#### Files Created

- ✅ `api/services/otpService.js` - OTP generation, storage, verification
- ✅ `api/routes/otp.js` - OTP API routes
- ✅ `api/index.js` - Updated with OTP routes

#### Features

- ✅ **6-digit OTP generation**
- ✅ **5-minute expiration**
- ✅ **Beautiful HTML email templates**
- ✅ **Signup email verification**
- ✅ **Password reset via OTP**
- ✅ **Automatic cleanup of expired OTPs**

### API Endpoints Available

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/otp/send` | Send OTP to email |
| POST | `/api/otp/verify` | Verify OTP code |
| POST | `/api/otp/reset-password` | Reset password with OTP |

---

## 🔧 Backend Overview

### OTP Service (`api/services/otpService.js`)

**Key Functions:**

```javascript
sendOTP(email, purpose)    // Send OTP via email
verifyOTP(email, otp, purpose) // Verify OTP
generateOTP()              // Generate 6-digit code
```

**Purpose Types:**

- `'signup'` - Email verification during signup
- `'reset'` - Password reset

**OTP Storage:**

- Stored in server memory (Map)
- Format: `{ otp: '123456', expires: timestamp, purpose: 'signup' }`
- Auto-cleanup every 10 minutes

**Email Templates:**

- Beautiful purple/pink gradient design
- Shows large OTP number
- 5-minute expiration warning
- Security notices

---

## 🎨 Frontend Implementation

### Step 1: Update API Service

**File:** `client/src/services/api.js`

Add this code BEFORE the `export default api;` line:

```javascript
// OTP API
export const otpAPI = {
  send: (email, purpose) => api.post('/otp/send', { email, purpose }),
  verify: (email, otp, purpose) => api.post('/otp/verify', { email, otp, purpose }),
  resetPassword: (email, otp, newPassword) => api.post('/otp/reset-password', { email, otp, newPassword })
};
```

---

### Step 2: Create OTP Input Component

**File:** `client/src/components/OTPInput.jsx`

```javascript
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
```

---

### Step 3: Update Signup Component

**File:** `client/src/components/Signup.jsx`

**Option A: Two-Step Signup (Recommended)**

Replace your current signup with this flow:

```javascript
import React, { useState } from 'react';
import { authAPI, otpAPI } from '../services/api';
import OTPInput from './OTPInput';

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [step, setStep] = useState(1); // 1: Enter details, 2: Verify OTP
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Send OTP
      await otpAPI.send(formData.email, 'signup');
      
      setStep(2);
      setResendTimer(60); // 60 second cooldown
      
      // Countdown timer
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Create Account
  const handleVerifyAndSignup = async () => {
    setError('');
    setLoading(true);

    try {
      // Verify OTP
      const verifyRes = await otpAPI.verify(formData.email, otp, 'signup');
      
      if (!verifyRes.data.verified) {
        throw new Error('Invalid OTP');
      }

      // Create account
      const signupRes = await authAPI.signup(formData);
      const { token, user } = signupRes.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      onSignup(user);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setError('');
    setLoading(true);

    try {
      await otpAPI.send(formData.email, 'signup');
      setResendTimer(60);
      
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          
          {/* Step 1: Enter Details */}
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-600 mt-2">Join Student Task Tracker</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                >
                  {loading ? 'Sending OTP...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
                <p className="text-gray-600 mt-2">
                  We sent a 6-digit code to<br />
                  <strong>{formData.email}</strong>
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <OTPInput length={6} onComplete={(code) => setOtp(code)} />
              </div>

              <div className="mb-4 text-center text-sm text-gray-600">
                ⏰ OTP expires in 5 minutes
              </div>

              <button
                onClick={handleVerifyAndSignup}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 mb-4"
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-gray-600">
                    Resend OTP in <strong>{resendTimer}s</strong>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    className="text-purple-600 font-medium hover:text-purple-700"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-4 text-gray-600 hover:text-gray-800 text-sm w-full"
              >
                ← Change Email Address
              </button>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={onSwitchToLogin} className="text-purple-600 font-medium hover:text-purple-700">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
```

---

### Step 4: Create Forgot Password Component

**File:** `client/src/components/ForgotPassword.jsx`

```javascript
import React, { useState } from 'react';
import { otpAPI } from '../services/api';
import OTPInput from './OTPInput';

const ForgotPassword = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Step 1: Send Reset OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await otpAPI.send(email, 'reset');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await otpAPI.verify(email, otp, 'reset');
      if (res.data.verified) {
        setStep(3);
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await otpAPI.resetPassword(email, otp, newPassword);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successfully!</h2>
            <p className="text-gray-600">You can now login with your new password.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          
          {/* Step 1: Enter Email */}
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
                <p className="text-gray-600 mt-2">Enter your email to receive a reset code</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Check Your Email</h2>
                <p className="text-gray-600 mt-2">
                  Enter the 6-digit code sent to<br />
                  <strong>{email}</strong>
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <OTPInput length={6} onComplete={(code) => setOtp(code)} />
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Create New Password</h2>
                <p className="text-gray-600 mt-2">Enter your new password</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          <button
            onClick={onBack}
            className="mt-6 text-gray-600 hover:text-gray-800 text-sm w-full"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
```

---

## 🧪 Testing Guide

### Test 1: Signup with OTP

1. **Start both servers**:

   ```bash
   # Terminal 1 - Backend
   cd c:\Users\Akshith\task-tracker
   npm start
   
   # Terminal 2 - Frontend
   cd c:\Users\Akshith\task-tracker\client
   npm run dev
   ```

2. **Go to**: <http://localhost:5173>

3. **Click "Sign Up"**

4. **Enter details**:
   - Name: Test User
   - Email: <your-real-email@gmail.com>
   - Password: Test123456

5. **Click "Send Verification Code"**

6. **Check your email** for OTP

7. **Enter the 6-digit OTP**

8. **Click "Verify & Create Account"**

9. **✅ You should be registered and logged in!**

---

### Test 2: Password Reset

1. **Go to Login page**

2. **Click "Forgot Password?"**

3. **Enter your email**

4. **Check email for reset OTP**

5. **Enter OTP**

6. **Set new password**

7. **✅ Password reset successful!**

---

## 📧 Email Examples

### Signup OTP Email

```
Subject: 🔐 Verify Your Email - Student Task Tracker

Beautiful purple gradient email with:
- Large 6-digit OTP number
- "OTP expires in 5 minutes" warning
- Security notice
```

### Password Reset OTP Email

```
Subject: 🔑 Reset Your Password - Student Task Tracker

Beautiful purple gradient email with:
- Large 6-digit OTP number
- Expiration warning
- "Didn't request this?" security warning
```

---

## 🛠️ Troubleshooting

### OTP Not Received

1. ✅ Check spam folder
2. ✅ Verify email address is correct
3. ✅ Check server console for errors
4. ✅ Wait 1-2 minutes (sometimes delayed)

### "OTP Expired" Error

- OTPs expire in 5 minutes
- Request a new OTP

### "Email Already Registered"

- User already exists
- Use "Forgot Password" to reset

### Server Errors

1. Check `.env` has correct Gmail credentials
2. Restart server: `npm start`
3. Check server console for error messages

---

## 🎯 Next Steps

### Recommended Enhancements

1. **Rate Limiting**: Limit OTP requests per email (prevent spam)
2. **SMS OTP**: Add Twilio for SMS verification
3. **Remember Device**: "Trust this device for 30 days"
4. **2FA Setup**: Optional two-factor authentication
5. **Email Customization**: Let users choose notification preferences

---

## 📝 Summary

### ✅ Completed

- Backend OTP service
- Email sending with templates
- Signup verification
- Password reset
- Frontend components (to implement)

### 🎯 Benefits

- ✅ Validate email addresses
- ✅ Prevent fake signups
- ✅ Secure password recovery
- ✅ Professional user experience
- ✅ Beautiful email templates

---

**🎉 Your OTP system is ready to use!**

For questions or issues, check the server console logs for debugging information.

---

**Created for:** Student Task Tracker
**Date:** February 2026
**Email:** <student.task.tracker.v1@gmail.com>
