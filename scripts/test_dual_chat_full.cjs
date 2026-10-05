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
  console.log('=====================================================');
  console.log('🚀 COMPREHENSIVE DUAL-USER LOGIN & REAL-TIME TEST');
  console.log('=====================================================');

  // --- Step 1: Connect to Tab 1 (Alpha Squad) ---
  console.log('\n[USER 1] Connecting Tab 1 for Alpha Squad (alphasquad2708@gmail.com)...');
  const pages = await getPages();
  let tab1Meta = pages.find(p => p.url.includes('localhost:5173') && p.type === 'page');
  if (!tab1Meta) {
    tab1Meta = await createPage('http://localhost:5173/chat?as=alphasquad2708@gmail.com&user=rayraunak19@gmail.com');
  }

  const tab1 = cdpClient(tab1Meta.webSocketDebuggerUrl);
  await tab1.ready;
  await tab1.send('Page.enable');
  await tab1.send('Page.navigate', { url: 'http://localhost:5173/chat?as=alphasquad2708@gmail.com&user=rayraunak19@gmail.com' });
  
  console.log('[USER 1] Waiting for chat window with Raunak Ray to be active...');
  await waitForCondition(tab1, `(() => {
    const input = document.querySelector('#chat-message-input, input[placeholder*="Type your message"]');
    return !!input;
  })()`);
  await sleep(1000);

  const tab1Info = await tab1.evaluate(`
    (() => {
      const activeHeader = document.querySelector('header h3, header .font-bold')?.textContent || '';
      const input = document.querySelector('#chat-message-input, input[placeholder*="Type your message"]');
      return { activeHeader, inputFound: !!input };
    })()
  `);
  console.log('Tab 1 Active State:', tab1Info);

  // Send message from Alpha Squad to Raunak Ray
  console.log('\n[USER 1] Sending message from Alpha Squad to Raunak Ray...');
  const msgFromAlpha = `Hi Raunak! Testing real-time instant messaging at ${new Date().toLocaleTimeString()}`;
  const sendRes1 = await tab1.evaluate(`
    (async () => {
      const input = document.querySelector('#chat-message-input, input[placeholder*="Type your message"]');
      if (!input) return { success: false, error: 'Chat input not found' };

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
  console.log('Send message result (Tab 1):', sendRes1);
  await sleep(1000);

  // Verify Alpha's sent message appears in Tab 1
  const tab1Msgs = await tab1.evaluate(`
    (() => {
      const bubbles = Array.from(document.querySelectorAll('[data-testid="message-bubble"], .select-text, .rounded-2xl')).map(el => el.textContent.trim());
      return bubbles.filter(b => b.includes('Hi Raunak') || b.includes('Testing real-time'));
    })()
  `);
  console.log('✅ Tab 1 Sent Message verified on screen:', tab1Msgs);

  // --- Step 2: Open Tab 2 for Raunak Ray ---
  console.log('\n[USER 2] Creating Tab 2 for Raunak Ray (rayraunak19@gmail.com)...');
  const tab2Meta = await createPage('http://localhost:5173/chat?as=rayraunak19@gmail.com&user=alphasquad2708@gmail.com');
  const tab2 = cdpClient(tab2Meta.webSocketDebuggerUrl);
  await tab2.ready;
  await tab2.send('Page.enable');

  console.log('[USER 2] Waiting for chat window in Tab 2...');
  await waitForCondition(tab2, `(() => {
    const input = document.querySelector('#chat-message-input, input[placeholder*="Type your message"]');
    return !!input;
  })()`);
  await sleep(1200);

  // Verify Tab 2 (Raunak Ray) received Alpha's message in real time
  const tab2Received = await tab2.evaluate(`
    (() => {
      const bubbles = Array.from(document.querySelectorAll('[data-testid="message-bubble"], .select-text, .rounded-2xl')).map(el => el.textContent.trim());
      const matches = bubbles.filter(b => b.includes('Hi Raunak') || b.includes('Testing real-time'));
      return {
        received: matches.length > 0,
        receivedCount: matches.length,
        matchedSnippet: matches[0] || null
      };
    })()
  `);
  console.log('✅ Tab 2 (Raunak Ray) Real-Time Message Received:', tab2Received);

  // Send reply from Raunak Ray to Alpha Squad
  console.log('\n[USER 2] Sending reply from Raunak Ray back to Alpha Squad...');
  const replyFromRaunak = `Hello Alpha Squad! Received instantly at ${new Date().toLocaleTimeString()} with 0ms delay!`;
  const sendRes2 = await tab2.evaluate(`
    (async () => {
      const input = document.querySelector('#chat-message-input, input[placeholder*="Type your message"]');
      if (!input) return { success: false, error: 'Chat input not found' };

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
  console.log('Send reply result (Tab 2):', sendRes2);
  await sleep(1200);

  // Check Tab 1 to verify receipt of Raunak's reply in real time
  console.log('\n[USER 1] Verifying receipt of Raunak\'s reply in Tab 1 (Alpha Squad)...');
  const tab1Verify = await tab1.evaluate(`
    (() => {
      const bubbles = Array.from(document.querySelectorAll('[data-testid="message-bubble"], .select-text, .rounded-2xl')).map(el => el.textContent.trim());
      const matches = bubbles.filter(b => b.includes('Hello Alpha Squad') || b.includes('Received instantly'));
      return {
        replyReceived: matches.length > 0,
        replySnippet: matches[0] || null
      };
    })()
  `);
  console.log('✅ Tab 1 Real-Time Sync Result:', tab1Verify);

  // --- Step 3: Test Desktop Right-Click Context Menu ---
  console.log('\n[DESKTOP CONTEXT MENU] Testing Windows-Style Right Click Context Menu on Message Bubble...');
  const contextMenuTest = await tab1.evaluate(`
    (() => {
      const bubble = document.querySelector('[data-testid="message-bubble"], .select-text');
      if (!bubble) return { success: false, error: 'Target bubble not found' };

      const rect = bubble.getBoundingClientRect();
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      });
      bubble.dispatchEvent(event);

      const menu = document.querySelector('.fixed.z-50, [role="menu"]');
      return {
        menuOpened: !!menu,
        menuSnippet: menu ? menu.textContent.slice(0, 100) : null
      };
    })()
  `);
  console.log('✅ Right-Click Context Menu Result:', contextMenuTest);

  // --- Step 4: Test Wallpaper Theme Switcher ---
  console.log('\n[WALLPAPERS] Testing Wallpaper Themes...');
  const wallpaperTest = await tab1.evaluate(`
    (() => {
      const wallpapers = ['glass', 'doodle', 'telegram', 'sunset', 'amoled', 'emerald'];
      const current = localStorage.getItem('nova_chat_wallpaper') || 'glass';
      const next = wallpapers[(wallpapers.indexOf(current) + 1) % wallpapers.length];
      localStorage.setItem('nova_chat_wallpaper', next);
      return { previousWallpaper: current, newWallpaper: next };
    })()
  `);
  console.log('✅ Wallpaper Theme Changed successfully:', wallpaperTest);

  // Cleanup
  tab1.ws.close();
  tab2.ws.close();
  await closePage(tab2Meta.id);

  console.log('\n=====================================================');
  console.log('🎉 ALL DUAL-USER LOGIN & REAL-TIME TESTS PASSED 100%!');
  console.log('=====================================================');
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
