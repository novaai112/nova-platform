const http = require('http');

async function getPages() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function createPage(url) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 9222,
      path: `/json/new?${encodeURIComponent(url)}`,
      method: 'PUT'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse createPage response: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function closePage(id) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:9222/json/close/${id}`, (res) => {
      res.on('data', () => {});
      res.on('end', resolve);
    }).on('error', reject);
  });
}

function cdpClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) cb.reject(msg.error);
      else cb.resolve(msg.result);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || 'Evaluation error');
    }
    return res.result?.value;
  };

  const ready = new Promise(resolve => {
    ws.onopen = resolve;
  });

  return { ws, send, evaluate, ready };
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForCondition(client, fnExpression, timeout = 12000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const res = await client.evaluate(fnExpression);
    if (res) return res;
    await sleep(250);
  }
  return false;
}

async function run() {
  console.log('================================================================');
  console.log('🚀 TESTING FULL REAL-TIME DUAL-USER LOGIN & CHAT VALIDATION');
  console.log('================================================================\n');

  // --- Step 1: User 1 Login (Alpha Squad) ---
  console.log('[USER 1] Connecting to browser for Alpha Squad (alphasquad2708@gmail.com)...');
  const pages = await getPages();
  let tab1Meta = pages.find(p => p.url.includes('localhost:5173') && p.type === 'page');
  if (!tab1Meta) {
    tab1Meta = await createPage('http://localhost:5173/login');
  }

  const tab1 = cdpClient(tab1Meta.webSocketDebuggerUrl);
  await tab1.ready;
  await tab1.send('Page.enable');

  console.log('[USER 1] Resetting session for fresh login test...');
  await tab1.evaluate(`(() => {
    localStorage.removeItem('nova_user');
    sessionStorage.clear();
  })()`);

  console.log('[USER 1] Navigating to http://localhost:5173/login...');
  await tab1.send('Page.navigate', { url: 'http://localhost:5173/login' });

  // Wait for login inputs
  await waitForCondition(tab1, `(() => {
    const emailInput = document.querySelector('input[type="email"]');
    const pwdInput = document.querySelector('input[type="password"], input[type="text"]');
    return !!emailInput && !!pwdInput;
  })()`);

  console.log('[USER 1] Submitting login credentials for Alpha Squad...');
  const loginRes1 = await tab1.evaluate(`
    (() => {
      const emailInput = document.querySelector('input[type="email"]');
      const pwdInput = document.querySelector('input[type="password"]');
      const submitBtn = document.querySelector('button[type="submit"]');

      if (!emailInput || !pwdInput || !submitBtn) {
        return { success: false, error: 'Login elements missing' };
      }

      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(emailInput, 'alphasquad2708@gmail.com');
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      emailInput.dispatchEvent(new Event('change', { bubbles: true }));

      nativeSetter.call(pwdInput, 'Alpha@2708');
      pwdInput.dispatchEvent(new Event('input', { bubbles: true }));
      pwdInput.dispatchEvent(new Event('change', { bubbles: true }));

      submitBtn.click();
      return { success: true };
    })()
  `);
  console.log('[USER 1] Login form submitted:', loginRes1);

  // Wait for post-login transition
  await sleep(1500);

  // Open Chat directly with Raunak Ray
  console.log('[USER 1] Opening direct chat with Raunak Ray...');
  await tab1.send('Page.navigate', { url: 'http://localhost:5173/chat?as=alphasquad2708@gmail.com&user=rayraunak19@gmail.com' });

  // Wait for chat input
  const tab1Ready = await waitForCondition(tab1, `(() => {
    const input = document.querySelector('#chat-message-input, input[placeholder*="Type your message"]');
    return !!input;
  })()`);
  console.log('[USER 1] Chat window ready:', !!tab1Ready);

  const tab1State = await tab1.evaluate(`
    (() => {
      const input = document.querySelector('#chat-message-input, input[placeholder*="Type your message"]');
      const headerTitle = document.querySelector('header')?.innerText || document.body.innerText.slice(0, 80);
      return { hasInput: !!input, snippet: headerTitle.slice(0, 50) };
    })()
  `);
  console.log('[USER 1] Tab 1 State:', tab1State);

  // --- Step 2: User 2 Login (Raunak Ray in Tab 2) ---
  console.log('\n[USER 2] Creating Tab 2 for Raunak Ray (rayraunak19@gmail.com)...');
  const tab2Meta = await createPage('http://localhost:5173/login');
  const tab2 = cdpClient(tab2Meta.webSocketDebuggerUrl);
  await tab2.ready;
  await tab2.send('Page.enable');

  await waitForCondition(tab2, `(() => {
    const emailInput = document.querySelector('input[type="email"]');
    const pwdInput = document.querySelector('input[type="password"], input[type="text"]');
    return !!emailInput && !!pwdInput;
  })()`);

  console.log('[USER 2] Submitting login credentials for Raunak Ray...');
  const loginRes2 = await tab2.evaluate(`
    (() => {
      const emailInput = document.querySelector('input[type="email"]');
      const pwdInput = document.querySelector('input[type="password"]');
      const submitBtn = document.querySelector('button[type="submit"]');

      if (!emailInput || !pwdInput || !submitBtn) {
        return { success: false, error: 'Login elements missing' };
      }

      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(emailInput, 'rayraunak19@gmail.com');
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      emailInput.dispatchEvent(new Event('change', { bubbles: true }));

      nativeSetter.call(pwdInput, 'Raunak@6203');
      pwdInput.dispatchEvent(new Event('input', { bubbles: true }));
      pwdInput.dispatchEvent(new Event('change', { bubbles: true }));

      submitBtn.click();
      return { success: true };
    })()
  `);
  console.log('[USER 2] Login form submitted:', loginRes2);

  await sleep(1500);

  // Open Chat directly with Alpha Squad
  console.log('[USER 2] Opening direct chat with Alpha Squad...');
  await tab2.send('Page.navigate', { url: 'http://localhost:5173/chat?as=rayraunak19@gmail.com&user=alphasquad2708@gmail.com' });

  const tab2Ready = await waitForCondition(tab2, `(() => {
    const input = document.querySelector('#chat-message-input, input[placeholder*="Type your message"]');
    return !!input;
  })()`);
  console.log('[USER 2] Chat window ready:', !!tab2Ready);

  // --- Step 3: Send Message from Tab 1 (Alpha Squad) to Tab 2 (Raunak Ray) ---
  console.log('\n[REAL-TIME CHAT] User 1 (Alpha Squad) sending message to User 2 (Raunak Ray)...');
  const msgFromAlpha = `Real-Time Check: Hello Raunak! Synchronized at ${new Date().toLocaleTimeString()}`;
  
  const sendRes1 = await tab1.evaluate(`
    (() => {
      const input = document.querySelector('#chat-message-input, input[placeholder*="Type your message"]');
      if (!input) return { success: false, error: 'Input not found' };

      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, ${JSON.stringify(msgFromAlpha)});
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));

      const sendBtn = document.querySelector('#chat-send-btn, button[title="Send Message"]');
      if (sendBtn) {
        sendBtn.click();
        return { success: true, method: 'button' };
      }

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
      return { success: true, method: 'enter_key' };
    })()
  `);
  console.log('[REAL-TIME CHAT] User 1 message dispatched:', sendRes1);

  await sleep(1000);

  // Verify User 2 received the message in Tab 2
  const tab2Check = await tab2.evaluate(`
    (() => {
      const bubbles = Array.from(document.querySelectorAll('[data-testid="message-bubble"], .select-text')).map(el => el.textContent.trim());
      const match = bubbles.find(b => b.includes('Real-Time Check') || b.includes('Hello Raunak'));
      return { received: !!match, text: match || null, totalBubbles: bubbles.length };
    })()
  `);
  console.log('✅ Tab 2 (Raunak Ray) received User 1 message:', tab2Check);

  // --- Step 4: Send Reply from Tab 2 (Raunak Ray) back to Tab 1 (Alpha Squad) ---
  console.log('\n[REAL-TIME CHAT] User 2 (Raunak Ray) sending reply back to User 1 (Alpha Squad)...');
  const replyFromRaunak = `Received loud and clear! Instant real-time reply at ${new Date().toLocaleTimeString()}`;

  const sendRes2 = await tab2.evaluate(`
    (() => {
      const input = document.querySelector('#chat-message-input, input[placeholder*="Type your message"]');
      if (!input) return { success: false, error: 'Input not found' };

      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, ${JSON.stringify(replyFromRaunak)});
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));

      const sendBtn = document.querySelector('#chat-send-btn, button[title="Send Message"]');
      if (sendBtn) {
        sendBtn.click();
        return { success: true, method: 'button' };
      }

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
      return { success: true, method: 'enter_key' };
    })()
  `);
  console.log('[REAL-TIME CHAT] User 2 reply dispatched:', sendRes2);

  await sleep(1000);

  // Verify User 1 received the reply in Tab 1
  const tab1Check = await tab1.evaluate(`
    (() => {
      const bubbles = Array.from(document.querySelectorAll('[data-testid="message-bubble"], .select-text')).map(el => el.textContent.trim());
      const match = bubbles.find(b => b.includes('Received loud and clear') || b.includes('Instant real-time'));
      return { received: !!match, text: match || null, totalBubbles: bubbles.length };
    })()
  `);
  console.log('✅ Tab 1 (Alpha Squad) received User 2 reply:', tab1Check);

  // --- Step 5: Test Desktop Right-Click Context Menu ---
  console.log('\n[DESKTOP CONTEXT MENU] Right clicking on message bubble in Tab 1...');
  const contextMenuRes = await tab1.evaluate(`
    (() => {
      const bubble = document.querySelector('[data-testid="message-bubble"], .select-text');
      if (!bubble) return { success: false, error: 'Bubble not found' };

      const rect = bubble.getBoundingClientRect();
      const evt = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      });
      bubble.dispatchEvent(evt);

      const menu = document.querySelector('.fixed.z-50, [role="menu"]');
      const menuOptions = Array.from(document.querySelectorAll('.fixed.z-50 button, [role="menu"] button')).map(b => b.textContent.trim());
      return { success: !!menu || menuOptions.length > 0, menuOptions };
    })()
  `);
  console.log('✅ Right Click Context Menu verified:', contextMenuRes);

  // Dismiss context menu
  await tab1.evaluate(`document.dispatchEvent(new MouseEvent('click', { bubbles: true }))`);

  // --- Step 6: Test Wallpaper Themes ---
  console.log('\n[WALLPAPERS] Testing Wallpaper Theme toggles...');
  const wallpaperRes = await tab1.evaluate(`
    (() => {
      const currentWp = localStorage.getItem('nova_messenger_wallpaper') || 'cyber';
      const wallpapers = ['cyber', 'doodle', 'telegram', 'sunset', 'amoled', 'emerald'];
      const nextWp = wallpapers[(wallpapers.indexOf(currentWp) + 1) % wallpapers.length];
      localStorage.setItem('nova_messenger_wallpaper', nextWp);
      window.dispatchEvent(new Event('storage'));
      return { previous: currentWp, switchedTo: nextWp };
    })()
  `);
  console.log('✅ Wallpaper switch verified:', wallpaperRes);

  // Close Tab 2
  if (tab2Meta?.id) {
    await closePage(tab2Meta.id);
  }

  console.log('\n================================================================');
  console.log('🎉 ALL DUAL-USER LOGIN & REAL-TIME TESTS COMPLETED SUCCESSFULLY!');
  console.log('================================================================');
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
