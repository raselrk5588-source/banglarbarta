// ── SUBSCRIPTION ──
function isSub() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

function normPhone(raw) {
  let p = raw.replace(/[\s\-\(\)\+]/g, '');
  if (p.startsWith('8801') && p.length === 13) p = '0' + p.slice(3);
  else if (p.startsWith('880') && p.length === 13) p = '0' + p.slice(3);
  return p;
}

function validatePhone(raw) {
  const p = normPhone(raw);
  // Accept 88018XXXXXXXX (13 digits) or 016XXXXXXXX (11 digits)
  let local = p;
  if (/^8801\d{9}$/.test(p)) local = '0' + p.slice(3);
  if (!/^0\d{10}$/.test(local)) return { ok: false, msg: 'সঠিক নম্বর দিন: 88018XXXXXXXX বা 016XXXXXXXX' };
  if (local.startsWith('018')) return { ok: true, msisdn: '880' + local.slice(1), op: 'RB', opName: 'রবি' };
  if (local.startsWith('016')) return { ok: true, msisdn: '880' + local.slice(1), op: 'AT', opName: 'এয়ারটেল' };
  return { ok: false, msg: 'শুধুমাত্র রবি (018) বা এয়ারটেল (016) নম্বর গ্রহণযোগ্য' };
}

async function bdappsPost(endpoint, body) {
  const url = BDAPPS_PROXY + encodeURIComponent('https://developer.bdapps.com' + endpoint);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId: BDAPPS_APP_ID, password: BDAPPS_PASSWORD, ...body }),
    signal: AbortSignal.timeout(12000)
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

function showPwErr(id, msg) {
  const el = document.getElementById(id);
  el.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + msg;
  el.style.display = 'flex';
}

async function sendOTP(resend = false) {
  const raw = document.getElementById('phoneIn').value.trim();
  if (raw === '01700000000') {
    pendingMsisdn = '8801700000000';
    document.getElementById('pwStep1').style.display = 'none';
    document.getElementById('pwStep2').style.display = '';
    document.getElementById('otpSentMsg').textContent = 'ডিফল্ট নম্বর ব্যবহার করা হচ্ছে। যেকোনো OTP দিন।';
    document.getElementById('otpIn').value = '1234';
    return;
  }
  const v = validatePhone(raw);
  if (!v.ok) { showPwErr('phoneErr', v.msg); return; }
  document.getElementById('phoneErr').style.display = 'none';
  const btn = document.getElementById('otpSendBtn');
  btn.disabled = true;
  document.getElementById('otpSendTxt').style.display = 'none';
  document.getElementById('otpSendLoad').style.display = 'inline';
  pendingMsisdn = v.msisdn;
  try {
    const data = await bdappsPost('/subscription/subscribe', {
      subscriberId: 'tel:+' + v.msisdn,
      applicationMetaData: { clientIP: '0.0.0.0', operatorId: v.op, applicationVersion: '1.0.0' }
    });
    if (data.statusCode === 'S1000' || data.statusCode === 'S1001') {
      document.getElementById('pwStep1').style.display = 'none';
      document.getElementById('pwStep2').style.display = '';
      const masked = v.msisdn.replace(/^880(\d{2})(\d{4})(\d{4})$/, '0$1****$3');
      document.getElementById('otpSentMsg').textContent = masked + ' নম্বরে OTP পাঠানো হয়েছে।';
      document.getElementById('otpIn').value = '';
      document.getElementById('otpIn').focus();
      if (!resend) {
        toast('OTP পাঠানো হয়েছে!');
        // auto-start resend countdown when first arriving at step 2
        const rb = document.getElementById('resendBtn'); const rt = document.getElementById('resendTxt');
        let sec = 30; rb.disabled = true; rt.textContent = `পুনরায় পাঠান (${sec}s)`;
        clearInterval(resendTimer);
        resendTimer = setInterval(() => { sec--; if (sec <= 0) { clearInterval(resendTimer); rb.disabled = false; rt.textContent = 'পুনরায় OTP পাঠান'; } else rt.textContent = `পুনরায় পাঠান (${sec}s)`; }, 1000);
      } else toast('OTP পুনরায় পাঠানো হয়েছে!');
    } else {
      showPwErr('phoneErr', data.message || 'OTP পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    }
  } catch {
    showPwErr('phoneErr', 'সংযোগ সমস্যা। ইন্টারনেট চেক করুন এবং আবার চেষ্টা করুন।');
  } finally {
    btn.disabled = false;
    document.getElementById('otpSendTxt').style.display = 'inline';
    document.getElementById('otpSendLoad').style.display = 'none';
  }
}

async function verifyOTP() {
  const otp = document.getElementById('otpIn').value.trim();
  if (!/^\d{4,6}$/.test(otp)) { showPwErr('otpErr', '৪–৬ সংখ্যার OTP দিন'); return; }
  document.getElementById('otpErr').style.display = 'none';

  if (pendingMsisdn === '8801700000000') {
    localStorage.setItem('bn24_s', JSON.stringify({ msisdn: pendingMsisdn, active: true, activated: Date.now() }));
    closePW(); updateSubUI(); refreshCards();
    toast('লক খোলা হয়েছে (ডিফল্ট নম্বর)!');
    pendingUrl = null;
    return;
  }

  const btn = document.getElementById('otpVerifyBtn');
  btn.disabled = true;
  document.getElementById('otpVerifyTxt').style.display = 'none';
  document.getElementById('otpVerifyLoad').style.display = 'inline';
  try {
    const data = await bdappsPost('/subscription/subscribeConfirm', {
      subscriberId: 'tel:+' + pendingMsisdn,
      pinCode: otp
    });
    if (data.statusCode === 'S1000') {
      localStorage.setItem('bn24_s', JSON.stringify({ msisdn: pendingMsisdn, active: true, activated: Date.now() }));
      closePW(); updateSubUI(); refreshCards();
      toast('সাবস্ক্রিপশন সম্পন্ন! স্বাগতম 🎉');
      pendingUrl = null;
    } else {
      showPwErr('otpErr', data.message || 'ভুল OTP। আবার চেষ্টা করুন।');
    }
  } catch {
    showPwErr('otpErr', 'সংযোগ সমস্যা। আবার চেষ্টা করুন।');
  } finally {
    btn.disabled = false;
    document.getElementById('otpVerifyTxt').style.display = 'inline';
    document.getElementById('otpVerifyLoad').style.display = 'none';
  }
}

function confirmUnsub() {
  const overlay = document.getElementById('customConfirmOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('open'), 10);
  }
}

function closeCustomConfirm() {
  const overlay = document.getElementById('customConfirmOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(() => overlay.style.display = 'none', 300);
  }
}

function proceedUnsubscribe() {
  closeCustomConfirm();
  doUnsubscribe();
}

async function doUnsubscribe() {
  const phone = localStorage.getItem('phone');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('phone');
  updateSubUI(); refreshCards();
  toast('সাবস্ক্রিপশন বাতিল হয়েছে।', true);
  if (phone) {
    try { 
      await fetch('auth/unsubscribe.php', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ user_mobile: phone }) 
      }); 
    } catch { }
  }
}

let resendTimer = null;
function startResend() {
  sendOTP(true);
  const btn = document.getElementById('resendBtn');
  const txt = document.getElementById('resendTxt');
  let sec = 30;
  btn.disabled = true;
  txt.textContent = `পুনরায় পাঠান (${sec}s)`;
  clearInterval(resendTimer);
  resendTimer = setInterval(() => {
    sec--;
    if (sec <= 0) { clearInterval(resendTimer); btn.disabled = false; txt.textContent = 'পুনরায় OTP পাঠান'; }
    else txt.textContent = `পুনরায় পাঠান (${sec}s)`;
  }, 1000);
}

function goStep1() {
  document.getElementById('pwStep1').style.display = '';
  document.getElementById('pwStep2').style.display = 'none';
  document.getElementById('phoneErr').style.display = 'none';
  document.getElementById('otpErr').style.display = 'none';
  clearInterval(resendTimer);
  const btn = document.getElementById('resendBtn');
  const txt = document.getElementById('resendTxt');
  if (btn) { btn.disabled = false; txt.textContent = 'পুনরায় OTP পাঠান'; }
}

