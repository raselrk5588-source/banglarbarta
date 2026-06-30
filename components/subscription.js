document.getElementById('subscription-container').innerHTML = `
  <div class="pw-overlay" id="pwOverlay">
    <div class="pw-box">
      <button class="pw-close" onclick="closePW()">&#x2715;</button>

      <!-- Logo + Title (always visible) -->
      <div class="pw-logo-wrap">
        <div class="pw-logo-inner">
          <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pwNewsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF2A54" />
                <stop offset="100%" stop-color="#8B0029" />
              </linearGradient>
              <linearGradient id="pwGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFDF00" />
                <stop offset="100%" stop-color="#D4AF37" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#pwNewsGrad)" />
            <g transform="translate(3, 3)">
              <path d="M5 5 h10 l6 6 v10 a2 2 0 0 1 -2 2 h-14 a2 2 0 0 1 -2 -2 v-14 a2 2 0 0 1 2 -2 z" fill="#ffffff" fill-opacity="0.95" />
              <path d="M15 5 v6 h6 z" fill="#ffffff" fill-opacity="0.6" />
              <rect x="7" y="10" width="4" height="4" rx="1" fill="url(#pwNewsGrad)" />
              <rect x="13" y="11" width="5" height="1" rx="0.5" fill="#d0d0d0" />
              <rect x="13" y="13" width="3" height="1" rx="0.5" fill="#d0d0d0" />
              <rect x="7" y="17" width="10" height="1" rx="0.5" fill="#d0d0d0" />
              <rect x="7" y="19" width="7" height="1" rx="0.5" fill="#d0d0d0" />
              <path d="M18 12 L19 15 L22 16 L19 17 L18 20 L17 17 L14 16 L17 15 Z" fill="url(#pwGoldGrad)" />
            </g>
          </svg>
        </div>
      </div>

      <!-- STEP 1: Phone -->
      <div id="pwStep1">
        <div class="pw-app-name">বাংলার বার্তা</div>
        <div class="pw-app-sub">Login with phone + OTP</div>
        <div class="pw-card">
          <label class="pw-field-label">Mobile number</label>
          <input type="tel" id="phoneIn" class="pw-phone-input" placeholder="8801XXXXXXXXX" maxlength="13"
            autocomplete="tel" onkeydown="if(event.key==='Enter')sendOTP()">
          <div class="pw-error" id="phoneErr" style="display:none"></div>
          <button class="pw-get-otp-btn" id="otpSendBtn" onclick="sendOTP()">
            <span id="otpSendTxt">Get OTP</span>
            <span id="otpSendLoad" style="display:none"><i class="fas fa-spinner fa-spin"></i> পাঠানো হচ্ছে...</span>
          </button>
          <div class="pw-hint">Use format: 8801XXXXXXXXX (no +). Also accepts: 01XXXXXXXXX<br>শুধুমাত্র রবি (018) ও
            এয়ারটেল (016)</div>
        </div>
        <div class="pw-charge">Charge: Tk 4.00+ (VAT+SD+SC) per day with Auto Renewal.</div>
      </div>

      <!-- STEP 2: OTP -->
      <div id="pwStep2" style="display:none">
        <div class="pw-app-name">OTP যাচাই</div>
        <div class="pw-app-sub" id="otpSentMsg">আপনার নম্বরে কোড পাঠানো হয়েছে।</div>
        <div class="pw-card">
          <label class="pw-field-label">OTP কোড</label>
          <input type="tel" id="otpIn" class="pw-otp-input" placeholder="------" maxlength="6"
            autocomplete="one-time-code" onkeydown="if(event.key==='Enter')verifyOTP()">
          <div class="pw-error" id="otpErr" style="display:none"></div>
          <button class="pw-get-otp-btn" id="otpVerifyBtn" onclick="verifyOTP()">
            <span id="otpVerifyTxt">যাচাই করুন ও সাবস্ক্রাইব করুন</span>
            <span id="otpVerifyLoad" style="display:none"><i class="fas fa-spinner fa-spin"></i> যাচাই হচ্ছে...</span>
          </button>
          <button class="pw-resend-btn" id="resendBtn" onclick="startResend()">
            <i class="fas fa-redo"></i> <span id="resendTxt">পুনরায় OTP পাঠান</span>
          </button>
          <div style="text-align:center;margin-top:6px">
            <button class="pw-link-btn" onclick="goStep1()">← নম্বর পরিবর্তন করুন</button>
          </div>
        </div>
        <div class="pw-charge">Charge: Tk 4.00+ (VAT+SD+SC) per day with Auto Renewal.</div>
      </div>

    </div>
  </div>
`;
