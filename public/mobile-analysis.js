(() => {
  const isNozzle = /\/nozzle8\.html$/i.test(window.location.pathname);
  const dashboardUrl = isNozzle ? 'https://nova-analysis.vercel.app/' : '/';
  const materialUrl = 'https://asme-material.vercel.app/';
  const maxJobs = 300;

  const init = () => {
    const titleElement = document.querySelector('#main_title, .app-header h1, .glass-container h1, h1');
    const shell = document.createElement('section');
    shell.className = `mobile-analysis-shell${isNozzle ? ' mobile-analysis-shell-nozzle' : ''}`;
    shell.innerHTML = `
      <header class="mobile-analysis-topbar">
        <strong class="mobile-analysis-title"></strong>
        <div class="mobile-analysis-actions">
          <a class="mobile-analysis-button" href="${dashboardUrl}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m3 10 9-7 9 7M5 9v11h5v-6h4v6h5V9"/></svg><span>Dashboard</span></a>
          <a class="mobile-analysis-button" href="${materialUrl}" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg><span>See Material</span></a>
        </div>
      </header>
      ${isNozzle ? `
        <nav class="mobile-analysis-mode-tabs" aria-label="Nozzle analysis type">
          <button type="button" class="mobile-analysis-mode-tab is-active" data-analysis="shell">Shell Nozzle</button>
          <button type="button" class="mobile-analysis-mode-tab" data-analysis="head">Head Nozzle</button>
        </nav>` : ''}
      ${/\/bellow\.html$/i.test(window.location.pathname) ? `
        <nav class="mobile-analysis-mode-tabs" aria-label="Bellow input method">
          <button type="button" class="mobile-analysis-mode-tab" data-method="pdf">Upload PV Elite Report</button>
          <button type="button" class="mobile-analysis-mode-tab" data-method="manual">Enter Geometry Manually</button>
        </nav>` : ''}
      <div class="mobile-analysis-batch-row">
        <label class="mobile-analysis-count" hidden><span>No. of Analyses</span><input type="number" min="1" max="300" value="1" aria-label="Number of analyses"></label>
        <button type="button" class="mobile-analysis-batch-toggle" role="switch" aria-checked="false">
          <span>Batch Mode</span><i aria-hidden="true"></i>
        </button>
      </div>
      <nav class="mobile-analysis-job-tabs" aria-label="Analysis jobs"></nav>
    `;
    shell.querySelector('.mobile-analysis-title').textContent = (titleElement?.textContent || document.title).replace(/\s+/g, ' ').trim();
    const pageContainer = document.querySelector('.glass-container, .main-workspace, main');
    if (pageContainer) pageContainer.before(shell);
    else document.body.prepend(shell);

    const batchToggle = shell.querySelector('.mobile-analysis-batch-toggle');
    const batchCount = shell.querySelector('.mobile-analysis-count');
    const countInput = shell.querySelector('.mobile-analysis-count input');
    const nozzleToggle = isNozzle ? document.querySelector('#batchToggle') : null;
    const nozzleCount = isNozzle ? document.querySelector('#numAnalyses') : null;
    const syncNozzleMax = () => {
      if (nozzleCount) nozzleCount.max = String(window.innerWidth < 768 ? maxJobs : 20);
    };
    syncNozzleMax();
    window.addEventListener('resize', syncNozzleMax);
    const tabs = shell.querySelector('.mobile-analysis-job-tabs');
    const storedValues = new Map();
    let activeJob = 1;
    const batchEnabled = () => batchToggle.getAttribute('aria-checked') === 'true';
    const jobCount = () => Math.max(1, Math.min(maxJobs, Number.parseInt(isNozzle ? nozzleCount?.value : countInput.value, 10) || 1));
    const getFormControls = () => [...document.querySelectorAll('input, select, textarea')].filter(control => (
      !control.closest('.mobile-analysis-shell, .mobile-analysis-material-modal, .modal-overlay') &&
      !['button', 'submit', 'reset'].includes(control.type)
    ));
    const captureValues = () => getFormControls().map((control, index) => ({
      key: control.id || control.name || String(index),
      index,
      value: control.value,
      checked: 'checked' in control ? control.checked : undefined,
      files: control.type === 'file' ? Array.from(control.files || []) : undefined
    }));
    const restoreValues = values => {
      if (!values) return;
      const controls = getFormControls();
      values.forEach(entry => {
        const control = controls.find(item => (item.id || item.name) === entry.key) || controls[entry.index];
        if (!control) return;
        if (control.type === 'file') {
          if (entry.files) {
            const transfer = new DataTransfer();
            entry.files.forEach(file => transfer.items.add(file));
            control.files = transfer.files;
          }
        } else {
          control.value = entry.value;
        }
        if (entry.checked !== undefined) control.checked = entry.checked;
        control.dispatchEvent(new Event('input', { bubbles: true }));
        control.dispatchEvent(new Event('change', { bubbles: true }));
      });
    };
    const updateNozzleBlocks = () => {
      document.querySelectorAll('#forms-container > .analysis-block').forEach((block, index) => {
        block.hidden = batchEnabled() && index + 1 !== activeJob;
      });
    };
    const hideNozzleMaterialSubheadings = () => {
      if (!isNozzle) return;
      const materialsCard = [...document.querySelectorAll('.glass-card')].find(card => /2\.\s*Materials/i.test(card.querySelector('.card-header')?.textContent || ''));
      materialsCard?.querySelectorAll('.section-label').forEach(label => label.classList.add('mobile-material-subheading'));
    };
    const saveCurrent = () => {
      if (batchEnabled() && !isNozzle) storedValues.set(activeJob, captureValues());
    };
    const createTabs = () => {
      tabs.hidden = !batchEnabled();
      batchCount.hidden = !batchEnabled();
      shell.querySelector('.mobile-analysis-batch-row').classList.toggle('is-batch-enabled', batchEnabled());
      tabs.replaceChildren();
      if (!batchEnabled()) {
        activeJob = 1;
        updateNozzleBlocks();
        return;
      }
      const total = jobCount();
      if (activeJob > total) activeJob = total;
      for (let job = 1; job <= total; job += 1) {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = `mobile-analysis-job-tab${job === activeJob ? ' is-active' : ''}`;
        tab.textContent = `Job ${job}`;
        tab.setAttribute('aria-pressed', String(job === activeJob));
        tab.addEventListener('click', () => selectJob(job));
        tabs.appendChild(tab);
      }
      updateNozzleBlocks();
      tabs.querySelector('.is-active')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    const selectJob = job => {
      if (job === activeJob) return;
      saveCurrent();
      activeJob = job;
      if (isNozzle) {
        updateNozzleBlocks();
      } else {
        restoreValues(storedValues.get(job) || storedValues.get(1));
      }
      createTabs();
    };
    const syncNozzleControls = () => {
      if (!isNozzle || !nozzleToggle || !nozzleCount) return;
      const enabled = batchEnabled();
      const batchChanged = nozzleToggle.checked !== enabled;
      nozzleToggle.checked = enabled;
      if (batchChanged) nozzleToggle.dispatchEvent(new Event('change', { bubbles: true }));
      if (enabled && !batchChanged) {
        nozzleCount.value = countInput.value;
        nozzleCount.dispatchEvent(new Event('change', { bubbles: true }));
      }
      countInput.value = nozzleCount.value;
    };
    batchToggle.addEventListener('click', () => {
      const enabled = !batchEnabled();
      batchToggle.setAttribute('aria-checked', String(enabled));
      if (!isNozzle && enabled) storedValues.set(1, captureValues());
      activeJob = 1;
      syncNozzleControls();
      createTabs();
    });
    batchToggle.addEventListener('keydown', event => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        batchToggle.click();
      }
    });
    countInput.addEventListener('input', () => {
      const count = Number.parseInt(countInput.value, 10);
      if (count > maxJobs) countInput.value = String(maxJobs);
      if (count < 1) countInput.value = '1';
      if (activeJob > jobCount()) activeJob = jobCount();
      syncNozzleControls();
      createTabs();
    });
    countInput.addEventListener('change', () => {
      countInput.value = String(jobCount());
      syncNozzleControls();
      createTabs();
    });
    if (isNozzle) {
      batchToggle.setAttribute('aria-checked', String(Boolean(nozzleToggle?.checked)));
      countInput.value = nozzleCount?.value || '1';
      batchCount.hidden = !nozzleToggle?.checked;
      new MutationObserver(() => {
        createTabs();
        hideNozzleMaterialSubheadings();
      }).observe(document.querySelector('#forms-container') || document.body, { childList: true });
    } else {
      document.addEventListener('input', saveCurrent, true);
      document.addEventListener('change', saveCurrent, true);
    }

    const methodButtons = [...shell.querySelectorAll('.mobile-analysis-mode-tab')];
    if (methodButtons.length) {
      if (isNozzle) {
        methodButtons.forEach(button => {
          button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
          button.addEventListener('click', () => {
            if (typeof window.switchAnalysis !== 'function') return;
            window.switchAnalysis(button.dataset.analysis);
            methodButtons.forEach(item => {
              const selected = item === button;
              item.classList.toggle('is-active', selected);
              item.setAttribute('aria-pressed', String(selected));
            });
          });
        });
      } else {
        let selectedMethod = 'pdf';
        const syncMethodTabs = () => methodButtons.forEach(button => {
          const selected = button.dataset.method === selectedMethod;
          button.classList.toggle('is-active', selected);
          button.setAttribute('aria-pressed', String(selected));
        });
        methodButtons.forEach(button => button.addEventListener('click', () => {
          if (typeof window.setInputMethod !== 'function') return;
          window.setInputMethod(button.dataset.method);
          selectedMethod = button.dataset.method;
          syncMethodTabs();
        }));
        document.querySelector('.method-toggle')?.setAttribute('aria-hidden', 'true');
        document.querySelector('.method-toggle')?.classList.add('mobile-analysis-method-toggle');
        syncMethodTabs();
      }
    }

    hideNozzleMaterialSubheadings();

    const swipeSurface = document.querySelector('#forms-container, #analysisForm, .form-body, .glass-container');
    let touchStart;
    swipeSurface?.addEventListener('touchstart', event => {
      if (event.touches.length !== 1 || event.target.closest('input, select, textarea, button, a, [contenteditable="true"]')) return;
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: true });
    swipeSurface?.addEventListener('touchend', event => {
      if (!touchStart || event.changedTouches.length !== 1 || !batchEnabled()) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
      selectJob(Math.max(1, Math.min(jobCount(), activeJob + (dx < 0 ? 1 : -1))));
    }, { passive: true });
    createTabs();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();