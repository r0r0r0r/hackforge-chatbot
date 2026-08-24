import { PRIME_MODELS, INITIAL_THREADS, SUGGESTED_PROMPTS } from './data.js';
import { AIService } from './aiService.js';
import { AuthService } from './authService.js';

// Storage Keys
const THREADS_STORAGE_KEY = 'omnibot_chat_threads_v2';
const ACTIVE_THREAD_KEY = 'omnibot_active_thread_id_v2';

const authService = new AuthService();

function loadStoredThreads() {
  try {
    const raw = localStorage.getItem(THREADS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse saved threads:', err);
  }
  return [...INITIAL_THREADS];
}

function saveThreadsToStorage() {
  try {
    localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(state.threads));
    if (state.activeThreadId) {
      localStorage.setItem(ACTIVE_THREAD_KEY, state.activeThreadId);
    }
  } catch (err) {
    console.warn('Failed to save threads to storage:', err);
  }
}

const initialThreads = loadStoredThreads();
const savedActiveId = localStorage.getItem(ACTIVE_THREAD_KEY);
const initialActiveId = initialThreads.some(t => t.id === savedActiveId) ? savedActiveId : (initialThreads[0]?.id || 'thread-1');

const state = {
  currentUser: authService.getCurrentUser(),
  isSidebarCollapsed: false,
  isArenaMode: true,
  isSingleModelMode: false,
  focusedModelId: 'gpt-4o',
  activeModelId: 'gpt-4o',
  activeModels: ['gpt-4o', 'gemini-2-flash', 'deepseek-r1'],
  disabledModels: new Set(),
  activeThreadId: initialActiveId,
  models: [...PRIME_MODELS],
  threads: initialThreads,
  searchQuery: '',
  editingThreadId: null,
  apiKeys: JSON.parse(localStorage.getItem('omnibot_api_keys') || '{}'),
  isLiveMode: JSON.parse(localStorage.getItem('omnibot_live_mode') || 'false'),
  attachments: []
};

const aiService = new AIService(state.apiKeys, state.isLiveMode);

// Initialize on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initAuthFlow();
  bindSidebar();
  bindSidebarSearch();
  bindFileUpload();
  bindDragAndDrop();
  bindModelDropdown();
  bindChatInput();
  bindKeyboardShortcuts();
  bindCommandPalette();
  bindSettingsModal();
  bindHeaderActions();
  renderSidebarHistory();
  renderModelDropdownMenu();
  updateActiveModelUI();
  renderActiveThreadMessages();
});

function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function showToast(message, icon = '✓') {
  const container = document.getElementById('toast-stack');
  if (!container) return;
  const pill = document.createElement('div');
  pill.className = 'toast-pill';
  pill.innerHTML = `<span style="color: #60a5fa; font-weight: 600;">${icon}</span> <span>${message}</span>`;
  container.appendChild(pill);
  setTimeout(() => {
    pill.style.opacity = '0';
    pill.style.transform = 'translateY(8px)';
    pill.style.transition = 'all 0.2s ease';
    setTimeout(() => pill.remove(), 200);
  }, 2800);
}

// ================= 5-CHAT FREE TRIAL & AUTHENTICATION FLOW =================
const GUEST_MAX_CHATS = 5;
const GUEST_COUNT_KEY = 'omnibot_guest_chat_count';

function getGuestChatCount() {
  try {
    return parseInt(localStorage.getItem(GUEST_COUNT_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function incrementGuestChatCount() {
  const current = getGuestChatCount() + 1;
  localStorage.setItem(GUEST_COUNT_KEY, current.toString());
  return current;
}

function updateGuestTrialUI() {
  const counterPill = document.getElementById('trial-counter-pill');
  const countText = document.getElementById('trial-count-text');
  const signupBtn = document.getElementById('trial-signup-btn');
  const freePlanCard = document.getElementById('sidebar-free-plan-card');
  const freePlanStatus = document.getElementById('free-plan-status-text');
  const freePlanFill = document.getElementById('free-plan-progress-fill');
  const avatarEl = document.getElementById('sidebar-user-avatar');
  const nameEl = document.getElementById('sidebar-user-name');
  const emailEl = document.getElementById('sidebar-user-email');

  if (state.currentUser) {
    if (counterPill) {
      counterPill.className = 'trial-badge-pill pro-active';
      counterPill.innerHTML = `
        <span class="trial-pulse-dot"></span>
        <span>✨ Unlimited Pro</span>
      `;
    }
    if (freePlanCard) freePlanCard.style.display = 'none';
    if (avatarEl) avatarEl.textContent = state.currentUser.avatar || state.currentUser.name.substring(0, 2).toUpperCase();
    if (nameEl) nameEl.textContent = state.currentUser.name;
    if (emailEl) emailEl.textContent = state.currentUser.email;
    return;
  }

  // Guest Mode (Display 5 Free Chats badge while keeping full unlimited chatting active)
  if (counterPill && countText) {
    countText.textContent = `5/5 Free Chats`;
    counterPill.className = 'trial-badge-pill';
    if (signupBtn) signupBtn.textContent = 'Sign Up';
  }

  if (freePlanCard) freePlanCard.style.display = 'flex';
  if (freePlanStatus) {
    freePlanStatus.textContent = `5 Free Trial Chats Active`;
  }
  if (freePlanFill) {
    freePlanFill.style.width = `100%`;
  }

  if (avatarEl) avatarEl.textContent = '✦';
  if (nameEl) nameEl.textContent = 'Guest Explorer';
  if (emailEl) emailEl.textContent = `Free Plan (Unlimited Access)`;
  initIcons();
}

function initAuthFlow() {
  const tabSignin = document.getElementById('tab-signin-btn');
  const tabSignup = document.getElementById('tab-signup-btn');
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  const demoLoginBtn = document.getElementById('btn-demo-login');
  const githubLoginBtn = document.getElementById('btn-auth-github');
  const googleLoginBtn = document.getElementById('btn-auth-google');
  const logoutBtn = document.getElementById('sidebar-logout-btn');
  const closeBtn = document.getElementById('auth-close-btn');
  const headerTrialBtn = document.getElementById('trial-signup-btn');
  const userProfileBar = document.getElementById('user-profile-btn');

  // Launch workspace directly
  showAppLayout(state.currentUser);
  updateGuestTrialUI();

  // Close overlay button
  closeBtn?.addEventListener('click', () => {
    hideAuthOverlay();
  });

  // Header Trial Signup click
  headerTrialBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showAuthOverlay('manual');
  });

  // User Profile Bar in sidebar click
  userProfileBar?.addEventListener('click', () => {
    if (!state.currentUser) {
      showAuthOverlay('manual');
    }
  });

  // Tab switcher
  tabSignin?.addEventListener('click', () => {
    tabSignin.classList.add('active');
    tabSignup?.classList.remove('active');
    if (signinForm) signinForm.style.display = 'flex';
    if (signupForm) signupForm.style.display = 'none';
    setAuthTitle('Welcome to HackForge', 'Universal Multi-AI Intelligence Platform • Team HackForge');
    clearAuthFeedback();
  });

  tabSignup?.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabSignin?.classList.remove('active');
    if (signinForm) signinForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'flex';
    setAuthTitle('Create Free Account', 'Unlock unlimited AI chats, multi-model arena, and history sync');
    clearAuthFeedback();
  });

  // Sign In Form Submission
  signinForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email')?.value;
    const password = document.getElementById('signin-password')?.value;
    const submitBtn = document.getElementById('btn-signin-submit');

    setAuthLoading(submitBtn, true, 'Signing in...');
    clearAuthFeedback();

    try {
      const user = await authService.signIn(email, password);
      state.currentUser = user;
      showToast(`Welcome back, ${user.name.split(' ')[0]}!`, '👋');
      hideAuthOverlay();
      showAppLayout(user);
      updateGuestTrialUI();
    } catch (err) {
      showAuthFeedback(err.message, 'error');
    } finally {
      setAuthLoading(submitBtn, false, 'Sign In to Workspace');
    }
  });

  // Sign Up Form Submission
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name')?.value;
    const email = document.getElementById('signup-email')?.value;
    const password = document.getElementById('signup-password')?.value;
    const submitBtn = document.getElementById('btn-signup-submit');

    setAuthLoading(submitBtn, true, 'Creating account...');
    clearAuthFeedback();

    try {
      const user = await authService.signUp(name, email, password);
      state.currentUser = user;
      showToast(`Account created! Welcome, ${user.name.split(' ')[0]}.`, '✨');
      hideAuthOverlay();
      showAppLayout(user);
      updateGuestTrialUI();
    } catch (err) {
      showAuthFeedback(err.message, 'error');
    } finally {
      setAuthLoading(submitBtn, false, 'Create Free Account');
    }
  });

  // 1-Click Demo Login
  demoLoginBtn?.addEventListener('click', async () => {
    setAuthLoading(demoLoginBtn, true, 'Authenticating demo session...');
    clearAuthFeedback();
    try {
      const user = await authService.loginAsDemo();
      state.currentUser = user;
      showToast('Signed in as Demo Engineer (Alex Vance)', '⚡');
      hideAuthOverlay();
      showAppLayout(user);
      updateGuestTrialUI();
    } catch (err) {
      showAuthFeedback(err.message, 'error');
    } finally {
      setAuthLoading(demoLoginBtn, false, '1-Click Demo Sign In (Alex Vance)');
    }
  });

  // Social Logins
  githubLoginBtn?.addEventListener('click', async () => {
    const user = await authService.signUp('GitHub Engineer', `gh_user_${Date.now().toString().slice(-4)}@github.com`, 'password123');
    state.currentUser = user;
    showToast('Authenticated with GitHub', '🐙');
    hideAuthOverlay();
    showAppLayout(user);
    updateGuestTrialUI();
  });

  googleLoginBtn?.addEventListener('click', async () => {
    const user = await authService.signUp('Google Developer', `g_dev_${Date.now().toString().slice(-4)}@gmail.com`, 'password123');
    state.currentUser = user;
    showToast('Authenticated with Google', '🌐');
    hideAuthOverlay();
    showAppLayout(user);
    updateGuestTrialUI();
  });

  // Logout
  logoutBtn?.addEventListener('click', () => {
    authService.signOut();
    state.currentUser = null;
    showToast('Signed out. Switched to Guest mode.');
    showAppLayout(null);
    updateGuestTrialUI();
  });
}

function showAuthOverlay(mode = 'manual') {
  const authOverlay = document.getElementById('auth-overlay');
  const closeBtn = document.getElementById('auth-close-btn');
  const tabSignup = document.getElementById('tab-signup-btn');

  if (!authOverlay) return;
  authOverlay.classList.remove('hidden');

  if (mode === 'limit_reached') {
    if (closeBtn) closeBtn.classList.add('hidden'); // Force signup when 5 chats reached
    tabSignup?.click();
    setAuthTitle('Free Trial Limit Reached (5/5 Chats)', 'Sign up to unlock unlimited AI chats, multi-model arena & history sync');
    showAuthFeedback('🔥 You have used all 5 free trial queries! Create a free account or sign in to continue.', 'error');
  } else {
    if (closeBtn) closeBtn.classList.remove('hidden');
    clearAuthFeedback();
  }
  initIcons();
}

function hideAuthOverlay() {
  const authOverlay = document.getElementById('auth-overlay');
  if (authOverlay) authOverlay.classList.add('hidden');
}

function showAppLayout(user) {
  const appShell = document.getElementById('app-shell');
  if (appShell) appShell.style.display = 'flex';

  const avatarEl = document.getElementById('sidebar-user-avatar');
  const nameEl = document.getElementById('sidebar-user-name');
  const emailEl = document.getElementById('sidebar-user-email');

  if (user) {
    if (avatarEl) avatarEl.textContent = user.avatar || user.name.substring(0, 2).toUpperCase();
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
  } else {
    updateGuestTrialUI();
  }

  initIcons();
}

function setAuthTitle(title, sub) {
  const titleEl = document.getElementById('auth-title');
  const subEl = document.getElementById('auth-subtitle');
  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = sub;
}

function showAuthFeedback(msg, type = 'error') {
  const banner = document.getElementById('auth-feedback-banner');
  if (!banner) return;
  banner.className = `auth-feedback-banner ${type}`;
  banner.innerHTML = `<i data-lucide="${type === 'error' ? 'alert-circle' : 'check-circle-2'}" style="width: 15px; height: 15px; flex-shrink: 0;"></i> <span>${escapeHtml(msg)}</span>`;
  initIcons();
}

function clearAuthFeedback() {
  const banner = document.getElementById('auth-feedback-banner');
  if (!banner) return;
  banner.className = 'auth-feedback-banner';
  banner.innerHTML = '';
}

function setAuthLoading(btn, isLoading, text) {
  if (!btn) return;
  btn.disabled = isLoading;
  btn.innerHTML = isLoading 
    ? `<span class="typing-pulse-cursor" style="margin-right: 6px;"></span> <span>${text}</span>` 
    : `<span>${text}</span> <i data-lucide="arrow-right" style="width: 15px; height: 15px;"></i>`;
  initIcons();
}

// ================= 1. SIDEBAR HANDLING =================
function bindSidebar() {
  const sidebar = document.getElementById('sidebar-panel');
  const collapseBtn = document.getElementById('sidebar-collapse-btn');
  const mobileToggle = document.getElementById('mobile-sidebar-toggle');
  const newChatBtn = document.getElementById('new-chat-btn');
  const brandBtn = document.getElementById('sidebar-brand-btn');

  collapseBtn?.addEventListener('click', () => {
    state.isSidebarCollapsed = !state.isSidebarCollapsed;
    sidebar?.classList.toggle('collapsed', state.isSidebarCollapsed);
    const icon = document.getElementById('collapse-icon');
    if (icon) {
      icon.setAttribute('data-lucide', state.isSidebarCollapsed ? 'panel-left-open' : 'panel-left-close');
      initIcons();
    }
  });

  mobileToggle?.addEventListener('click', () => {
    state.isSidebarCollapsed = false;
    sidebar?.classList.remove('collapsed');
    initIcons();
  });

  newChatBtn?.addEventListener('click', createNewChatThread);
  brandBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    createNewChatThread();
  });
}

function bindSidebarSearch() {
  const input = document.getElementById('sidebar-search-input');
  const clearBtn = document.getElementById('sidebar-search-clear');

  input?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    if (clearBtn) {
      clearBtn.style.display = state.searchQuery ? 'flex' : 'none';
    }
    renderSidebarHistory();
  });

  clearBtn?.addEventListener('click', () => {
    if (input) input.value = '';
    state.searchQuery = '';
    clearBtn.style.display = 'none';
    renderSidebarHistory();
    input?.focus();
  });
}

function renderSidebarHistory() {
  const container = document.getElementById('sidebar-history-list');
  if (!container) return;

  const groups = ['Today', 'Yesterday', 'Previous 7 Days'];
  let filteredThreads = state.threads;

  if (state.searchQuery) {
    filteredThreads = state.threads.filter(t => 
      t.title.toLowerCase().includes(state.searchQuery) ||
      (t.messages && t.messages.some(m => m.text && m.text.toLowerCase().includes(state.searchQuery)))
    );
  }

  if (filteredThreads.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem 0.75rem; text-align: center; color: var(--text-muted); font-size: 0.76rem;">
        No conversations found
      </div>
    `;
    initIcons();
    return;
  }

  let html = '';
  groups.forEach(group => {
    const items = filteredThreads.filter(t => (t.timeGroup || 'Today') === group);
    if (items.length > 0) {
      html += `
        <div class="history-time-group">
          <div class="time-group-label hide-on-collapse">${group}</div>
          ${items.map(t => {
            const isActive = t.id === state.activeThreadId;
            const model = getModel(t.modelId);
            const isEditing = state.editingThreadId === t.id;

            return `
              <div class="history-item ${isActive ? 'active' : ''}" onclick="window.selectThread('${t.id}')">
                <div class="history-item-left">
                  <span style="display: flex; align-items: center; color: ${model.brandColor};">${model.iconSvg}</span>
                  ${isEditing ? `
                    <input 
                      type="text" 
                      class="history-rename-input" 
                      id="rename-input-${t.id}" 
                      value="${escapeHtml(t.title)}" 
                      onclick="event.stopPropagation()" 
                      onkeydown="window.handleRenameKey(event, '${t.id}')"
                      onblur="window.finishRename('${t.id}')"
                    >
                  ` : `
                    <span class="history-item-title hide-on-collapse" title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</span>
                  `}
                </div>
                <div class="history-actions hide-on-collapse">
                  <button class="history-action-btn" title="Rename conversation" onclick="event.stopPropagation(); window.startRename('${t.id}')">
                    <i data-lucide="pencil" style="width: 12px; height: 12px;"></i>
                  </button>
                  <button class="history-action-btn delete-btn" title="Delete conversation" onclick="event.stopPropagation(); window.deleteThread('${t.id}')">
                    <i data-lucide="trash" style="width: 12px; height: 12px;"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  });

  container.innerHTML = html;
  initIcons();

  if (state.editingThreadId) {
    const input = document.getElementById(`rename-input-${state.editingThreadId}`);
    if (input) {
      input.focus();
      input.select();
    }
  }
}

window.startRename = (threadId) => {
  state.editingThreadId = threadId;
  renderSidebarHistory();
};

window.handleRenameKey = (e, threadId) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    window.finishRename(threadId);
  } else if (e.key === 'Escape') {
    state.editingThreadId = null;
    renderSidebarHistory();
  }
};

window.finishRename = (threadId) => {
  const input = document.getElementById(`rename-input-${threadId}`);
  if (input) {
    const newTitle = input.value.trim();
    if (newTitle) {
      const thread = state.threads.find(t => t.id === threadId);
      if (thread) {
        thread.title = newTitle;
        saveThreadsToStorage();
        showToast('Conversation renamed');
      }
    }
  }
  state.editingThreadId = null;
  renderSidebarHistory();
};

window.selectThread = (threadId) => {
  state.activeThreadId = threadId;
  const thread = state.threads.find(t => t.id === threadId);
  if (thread && thread.modelId) {
    state.activeModelId = thread.modelId;
    updateActiveModelUI();
  }
  saveThreadsToStorage();
  renderSidebarHistory();
  renderActiveThreadMessages();
};

window.deleteThread = (threadId) => {
  state.threads = state.threads.filter(t => t.id !== threadId);
  if (state.activeThreadId === threadId) {
    if (state.threads.length > 0) {
      state.activeThreadId = state.threads[0].id;
    } else {
      createNewChatThread();
      return;
    }
  }
  saveThreadsToStorage();
  renderSidebarHistory();
  renderActiveThreadMessages();
  showToast('Conversation deleted');
};

function createNewChatThread() {
  const newId = 'thread-' + Date.now();
  const newThread = {
    id: newId,
    title: 'New Conversation',
    modelId: state.activeModelId,
    updatedAt: 'Just now',
    timeGroup: 'Today',
    messages: []
  };

  state.threads.unshift(newThread);
  state.activeThreadId = newId;
  saveThreadsToStorage();
  renderSidebarHistory();
  renderActiveThreadMessages();
  document.getElementById('main-chat-input')?.focus();
  showToast('New session initialized');
}

// ================= 2. MODEL SELECTOR DROPDOWN =================
function bindModelDropdown() {
  const trigger = document.getElementById('model-selector-trigger');
  const menu = document.getElementById('model-dropdown-menu');

  trigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    menu?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!trigger?.contains(e.target) && !menu?.contains(e.target)) {
      menu?.classList.remove('open');
    }
  });
}

function renderModelDropdownMenu() {
  const menu = document.getElementById('model-dropdown-menu');
  if (!menu) return;

  menu.innerHTML = state.models.map(m => {
    const isSelected = m.id === state.activeModelId;
    return `
      <div class="model-option-item ${isSelected ? 'selected' : ''}" onclick="window.selectModel('${m.id}')">
        <div class="model-option-info">
          <span style="color: ${m.brandColor};">${m.iconSvg}</span>
          <div>
            <div class="model-option-title">${m.name}</div>
            <div class="model-option-sub">${m.role}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.68rem; padding: 0.15rem 0.4rem; border-radius: 4px; background: rgba(255,255,255,0.06); color: var(--text-secondary);">${m.badgeText}</span>
          <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">${m.speed}</div>
        </div>
      </div>
    `;
  }).join('');
}

window.selectModel = (modelId) => {
  state.activeModelId = modelId;
  state.focusedModelId = modelId;
  state.isSingleModelMode = true;
  const menu = document.getElementById('model-dropdown-menu');
  menu?.classList.remove('open');

  const curThread = state.threads.find(t => t.id === state.activeThreadId);
  if (curThread) {
    curThread.modelId = modelId;
  }

  updateActiveModelUI();
  renderSidebarHistory();
  renderModelDropdownMenu();
  renderActiveThreadMessages();
  showToast(`Chatting exclusively with ${getModel(modelId).name}`);
};

function getModel(modelId) {
  return state.models.find(m => m.id === modelId) || state.models[0];
}

function updateActiveModelUI() {
  const model = getModel(state.isSingleModelMode ? state.focusedModelId : state.activeModelId);
  const avatarEl = document.getElementById('header-active-avatar');
  const nameEl = document.getElementById('header-active-name');
  const speedEl = document.getElementById('header-active-speed');
  const arenaToggle = document.getElementById('header-arena-toggle');
  const arenaText = document.getElementById('arena-toggle-text');

  if (avatarEl) {
    avatarEl.innerHTML = `<span style="color: ${model.brandColor};">${model.iconSvg}</span>`;
  }
  if (nameEl) nameEl.textContent = state.isSingleModelMode ? model.name : 'Multi-Model Arena';
  if (speedEl) speedEl.textContent = model.speed;

  if (arenaToggle && arenaText) {
    if (state.isSingleModelMode) {
      arenaToggle.classList.add('active');
      arenaText.innerHTML = `<span>← Compare All (3x)</span>`;
      arenaToggle.title = 'Switch back to 3-Column Parallel Comparison';
    } else {
      arenaToggle.classList.remove('active');
      arenaText.innerHTML = `<span>Multi-Bot Arena (3x)</span>`;
      arenaToggle.title = 'Currently comparing 3 models side-by-side';
    }
  }
}

// ================= 3. MESSAGES AREA: MULTI-COLUMN OR SINGLE FOCUS =================
function renderActiveThreadMessages() {
  const container = document.getElementById('messages-container');
  if (!container) return;

  const currentThread = state.threads.find(t => t.id === state.activeThreadId);
  if (!currentThread) return;

  // 1. SINGLE MODEL FOCUS MODE
  if (state.isSingleModelMode) {
    const model = getModel(state.focusedModelId);
    const turns = [];
    const msgs = currentThread.messages;

    for (let i = 0; i < msgs.length; i++) {
      if (msgs[i].sender === 'user') {
        const userMsg = msgs[i];
        let botMsg = null;
        for (let j = i + 1; j < msgs.length && msgs[j].sender === 'bot'; j++) {
          if (msgs[j].botId === model.id) {
            botMsg = msgs[j];
            break;
          }
        }
        turns.push({ userMsg, botMsg });
      }
    }

    container.innerHTML = `
      <div class="single-mode-wrapper">
        <!-- Top Sticky Switch Back Bar -->
        <div class="single-mode-header-bar">
          <button class="btn-back-to-comparison" onclick="window.switchBackToComparison()">
            <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i>
            <span>Back to Multi-Model Comparison (3x)</span>
          </button>
          <div class="single-mode-indicator">
            <span style="color: ${model.brandColor};">${model.iconSvg}</span>
            <span>Chatting exclusively with <strong>${model.name}</strong></span>
            <span style="font-size: 0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; background: rgba(255,255,255,0.06); color: var(--text-secondary); margin-left: 0.35rem;">${model.provider}</span>
          </div>
        </div>

        <!-- Single Model Scrollable Stream -->
        <div class="single-mode-messages-scroll" id="single-mode-scroll">
          <div class="single-mode-content-width">
            ${turns.map(({ userMsg, botMsg }) => {
              const parsedMarkdown = botMsg ? (window.marked ? window.marked.parse(botMsg.text) : botMsg.text) : '';
              return `
                <div class="single-mode-user-card">
                  <div class="single-mode-user-bubble">
                    ${escapeHtml(userMsg.text)}
                  </div>
                </div>

                ${botMsg ? `
                  <div class="single-mode-bot-card">
                    <div class="fiesta-bot-avatar" style="color: ${model.brandColor}; margin-top: 3px;">
                      ${model.iconSvg}
                    </div>
                    <div class="single-mode-bot-body" id="${botMsg.id}">
                      <div class="single-mode-bot-header">
                        <div style="display: flex; align-items: center; gap: 0.45rem;">
                          <span style="font-weight: 600; color: #ffffff; font-size: 0.88rem;">${model.name}</span>
                          <span style="font-size: 0.72rem; color: var(--text-muted);">${model.provider}</span>
                        </div>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">
                          ${botMsg.latencyMs ? `<span>${botMsg.latencyMs}ms</span>` : ''}
                        </div>
                      </div>

                      <div class="markdown-stream">
                        ${formatCodeBlocks(parsedMarkdown)}
                      </div>

                      <div class="fiesta-bot-actions">
                        <button class="fiesta-bot-action-btn" title="Copy" onclick="window.copyText('${escapeHtml(botMsg.text).replace(/'/g, "\\'")}')">
                          <i data-lucide="copy" style="width: 13px; height: 13px;"></i> Copy
                        </button>
                        <button class="fiesta-bot-action-btn" title="Helpful" onclick="window.triggerConfetti(this)">
                          <i data-lucide="thumbs-up" style="width: 13px; height: 13px;"></i>
                        </button>
                        <button class="fiesta-bot-action-btn" title="Not helpful" onclick="showToast('Feedback noted')">
                          <i data-lucide="thumbs-down" style="width: 13px; height: 13px;"></i>
                        </button>
                        <span style="margin-left: auto; cursor: pointer; font-size: 0.72rem; color: var(--text-muted);" onclick="showToast('Feedback form opened')">Share feedback</span>
                      </div>
                    </div>
                  </div>
                ` : `
                  <div class="single-mode-bot-card">
                    <div class="fiesta-bot-avatar" style="color: ${model.brandColor};">
                      ${model.iconSvg}
                    </div>
                    <div class="single-mode-bot-body" id="loading-single-${model.id}">
                      <span class="typing-pulse-cursor"></span>
                    </div>
                  </div>
                `}
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    const scrollEl = document.getElementById('single-mode-scroll');
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
    initIcons();
    return;
  }

  // 2. MULTI-COLUMN COMPARISON ARENA MODE
  const activeModelObjects = state.activeModels.map(id => getModel(id));
  
  let gridHtml = `<div class="fiesta-multi-grid">`;

  activeModelObjects.forEach(model => {
    const isDisabled = state.disabledModels.has(model.id);

    const turns = [];
    const msgs = currentThread.messages;
    
    for (let i = 0; i < msgs.length; i++) {
      if (msgs[i].sender === 'user') {
        const userMsg = msgs[i];
        let botMsg = null;
        for (let j = i + 1; j < msgs.length && msgs[j].sender === 'bot'; j++) {
          if (msgs[j].botId === model.id) {
            botMsg = msgs[j];
            break;
          }
        }
        turns.push({ userMsg, botMsg });
      }
    }

    gridHtml += `
      <div class="fiesta-column ${isDisabled ? 'disabled' : ''}" id="col-${model.id}">
        <!-- Column Top Header -->
        <div class="column-top-bar">
          <div class="column-header-left">
            <span class="column-model-icon" style="color: ${model.brandColor};">${model.iconSvg}</span>
            <span class="column-model-name">${model.name}</span>
          </div>
          <div class="column-header-right">
            <button class="column-action-icon-btn" title="Chat only with ${model.name}" onclick="window.focusModel('${model.id}')">
              <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
            </button>
            <label class="column-switch-label" title="Toggle ${model.name}">
              <input type="checkbox" ${isDisabled ? '' : 'checked'} onchange="window.toggleModelActive('${model.id}', this.checked)">
              <span class="column-switch-slider"></span>
            </label>
          </div>
        </div>

        <!-- Column Messages Scroll Feed -->
        <div class="column-messages-scroll" id="scroll-col-${model.id}">
          ${turns.map(({ userMsg, botMsg }) => {
            const parsedMarkdown = botMsg ? (window.marked ? window.marked.parse(botMsg.text) : botMsg.text) : '';
            return `
              <!-- User Prompt Row -->
              <div class="fiesta-user-row">
                <div class="fiesta-user-avatar">
                  <i data-lucide="user" style="width: 14px; height: 14px;"></i>
                </div>
                <div class="fiesta-user-content">${escapeHtml(userMsg.text)}</div>
                <button class="fiesta-user-edit-btn" title="Edit prompt" onclick="window.editPrompt('${escapeHtml(userMsg.text).replace(/'/g, "\\'")}')">
                  <i data-lucide="pencil" style="width: 12px; height: 12px;"></i>
                </button>
              </div>

              <!-- Model Response Row -->
              ${botMsg ? `
                <div class="fiesta-bot-row">
                  <div class="fiesta-bot-avatar" style="color: ${model.brandColor};">
                    ${model.iconSvg}
                  </div>
                  <div class="fiesta-bot-body" id="${botMsg.id}">
                    <div class="markdown-stream">
                      ${formatCodeBlocks(parsedMarkdown)}
                    </div>
                    <div class="fiesta-bot-actions">
                      <button class="fiesta-bot-action-btn" title="Copy response" onclick="window.copyText('${escapeHtml(botMsg.text).replace(/'/g, "\\'")}')">
                        <i data-lucide="copy" style="width: 13px; height: 13px;"></i>
                      </button>
                      <button class="fiesta-bot-action-btn" title="Helpful" onclick="window.triggerConfetti(this)">
                        <i data-lucide="thumbs-up" style="width: 13px; height: 13px;"></i>
                      </button>
                      <button class="fiesta-bot-action-btn" title="Not helpful" onclick="showToast('Feedback noted')">
                        <i data-lucide="thumbs-down" style="width: 13px; height: 13px;"></i>
                      </button>
                      <span style="margin-left: auto; cursor: pointer;" onclick="showToast('Feedback logged')">Share feedback</span>
                    </div>
                  </div>
                </div>
              ` : `
                <div class="fiesta-bot-row">
                  <div class="fiesta-bot-avatar" style="color: ${model.brandColor};">
                    ${model.iconSvg}
                  </div>
                  <div class="fiesta-bot-body" id="loading-${model.id}">
                    <span class="typing-pulse-cursor"></span>
                  </div>
                </div>
              `}
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  gridHtml += `</div>`;
  container.innerHTML = gridHtml;
  scrollAllColumnsToBottom();
  initIcons();
}

function scrollAllColumnsToBottom() {
  if (state.isSingleModelMode) {
    const singleScroll = document.getElementById('single-mode-scroll');
    if (singleScroll) singleScroll.scrollTop = singleScroll.scrollHeight;
    return;
  }
  state.activeModels.forEach(modelId => {
    const scrollContainer = document.getElementById(`scroll-col-${modelId}`);
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  });
}

window.toggleModelActive = (modelId, isChecked) => {
  if (isChecked) {
    state.disabledModels.delete(modelId);
    showToast(`Enabled ${getModel(modelId).name}`);
  } else {
    state.disabledModels.add(modelId);
    showToast(`Disabled ${getModel(modelId).name}`);
  }
  renderActiveThreadMessages();
};

window.focusModel = (modelId) => {
  state.isSingleModelMode = true;
  state.focusedModelId = modelId;
  state.activeModelId = modelId;
  updateActiveModelUI();
  renderActiveThreadMessages();
  showToast(`Chatting exclusively with ${getModel(modelId).name}`, '✨');
};

window.switchBackToComparison = () => {
  state.isSingleModelMode = false;
  updateActiveModelUI();
  renderActiveThreadMessages();
  showToast('Switched back to Multi-Model Comparison (3x)', '⚡');
};

window.editPrompt = (text) => {
  const input = document.getElementById('main-chat-input');
  if (input) {
    input.value = text;
    input.focus();
    input.dispatchEvent(new Event('input'));
  }
};

function formatCodeBlocks(htmlContent) {
  return htmlContent.replace(/<pre><code(?:\s+class="language-([a-zA-Z0-9_-]+)")?>([\s\S]*?)<\/code><\/pre>/gi, (match, lang, code) => {
    const language = lang || 'code';
    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span>${language}</span>
          <button class="code-copy-btn" onclick="window.copyCodeSnippet(this)">
            <i data-lucide="copy" style="width: 12px; height: 12px;"></i> Copy
          </button>
        </div>
        <pre><code class="language-${language}">${code}</code></pre>
      </div>
    `;
  });
}

function scrollMessagesToBottom() {
  const viewport = document.getElementById('messages-viewport');
  if (viewport) {
    viewport.scrollTop = viewport.scrollHeight;
  }
}

window.copyCodeSnippet = (btn) => {
  const codeEl = btn.closest('.code-block-wrapper')?.querySelector('pre code');
  if (codeEl) {
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
      showToast('Copied code to clipboard');
    });
  }
};

window.copyText = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard');
  });
};

window.triggerConfetti = (btn) => {
  if (window.confetti) {
    window.confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.85 }
    });
  }
  showToast('Feedback logged');
};

window.speakText = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const clean = text.replace(/[`*#_[\]()]/g, '');
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 1.05;
    window.speechSynthesis.speak(u);
    showToast('Audio playback started');
  }
};

window.useSuggestedPrompt = (promptText, title) => {
  const input = document.getElementById('main-chat-input');
  if (input) {
    input.value = promptText;
    handleSendMessage();
  }
};

// ================= 4. INPUT, FILE UPLOAD & STREAMING =================
function bindChatInput() {
  const textarea = document.getElementById('main-chat-input');
  const sendBtn = document.getElementById('main-send-btn');
  const voiceBtn = document.getElementById('voice-dictation-btn');
  const promptsBtn = document.getElementById('open-prompts-btn');

  textarea?.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
  });

  textarea?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  sendBtn?.addEventListener('click', handleSendMessage);

  voiceBtn?.addEventListener('click', () => {
    const samples = [
      'Explain the key differences between Postgres row locks and optimistic concurrency control in high-load services.',
      'What are the benchmark scores comparing Claude 3.5 Sonnet vs GPT-4o on SWE-bench?',
      'Write a production Node.js Redis idempotency wrapper for Stripe webhook retries.',
      'Review the attached file for potential race conditions and performance bottlenecks.'
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    if (textarea) {
      textarea.value = picked;
      textarea.dispatchEvent(new Event('input'));
      showToast('Voice dictation transcribed');
    }
  });

  promptsBtn?.addEventListener('click', () => {
    openCommandPalette();
  });
}

function bindFileUpload() {
  const attachBtn = document.getElementById('attach-file-btn');
  const fileInput = document.getElementById('file-upload-input');

  attachBtn?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIncomingFiles(Array.from(e.target.files));
      fileInput.value = '';
    }
  });
}

function bindDragAndDrop() {
  const viewport = document.getElementById('main-chat-viewport');
  const overlay = document.getElementById('drag-drop-overlay');

  if (!viewport || !overlay) return;

  let dragCounter = 0;

  viewport.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    overlay.style.display = 'flex';
  });

  viewport.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  viewport.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      overlay.style.display = 'none';
    }
  });

  viewport.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    overlay.style.display = 'none';

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleIncomingFiles(Array.from(e.dataTransfer.files));
    }
  });
}

function handleIncomingFiles(files) {
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      state.attachments.push({
        name: file.name,
        size: file.size,
        content: typeof content === 'string' ? content : ''
      });
      renderAttachmentsUI();
      showToast(`Ingested ${file.name} (${formatBytes(file.size)})`, '📁');
    };
    reader.readAsText(file);
  });
}

function renderAttachmentsUI() {
  const container = document.getElementById('attachment-preview-container');
  if (!container) return;

  if (state.attachments.length === 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = state.attachments.map((f, i) => `
    <div class="attachment-chip">
      <i data-lucide="file-code" style="width: 13px; height: 13px; color: #a5b4fc;"></i>
      <span style="font-weight: 500;">${escapeHtml(f.name)}</span>
      <span class="attachment-chip-size">${formatBytes(f.size)}</span>
      <button class="attachment-remove-btn" onclick="window.removeAttachment(${i})" title="Remove attachment">
        <i data-lucide="x" style="width: 11px; height: 11px;"></i>
      </button>
    </div>
  `).join('');
  initIcons();
}

window.removeAttachment = (index) => {
  state.attachments.splice(index, 1);
  renderAttachmentsUI();
};

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function handleSendMessage() {
  const textarea = document.getElementById('main-chat-input');
  if (!textarea || !textarea.value.trim()) return;

  const promptText = textarea.value.trim();
  const currentAttachments = [...state.attachments];
  
  // Clear input & attachments preview
  textarea.value = '';
  textarea.style.height = 'auto';
  state.attachments = [];
  renderAttachmentsUI();

  let currentThread = state.threads.find(t => t.id === state.activeThreadId);
  if (!currentThread) {
    createNewChatThread();
    currentThread = state.threads[0];
  }

  if (currentThread.messages.length === 0) {
    currentThread.title = promptText.length > 38 ? promptText.substring(0, 36) + '...' : promptText;
    renderSidebarHistory();
  }

  currentThread.messages.push({
    id: 'msg-u-' + Date.now(),
    sender: 'user',
    text: promptText,
    attachments: currentAttachments.map(a => ({ name: a.name, size: a.size })),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  // Keep guest trial display synced
  if (!state.currentUser) {
    incrementGuestChatCount();
    updateGuestTrialUI();
  }

  saveThreadsToStorage();

  // Target models based on current mode
  let targetBots = [];
  if (state.isSingleModelMode) {
    targetBots = [getModel(state.focusedModelId)];
  } else {
    targetBots = state.activeModels
      .filter(id => !state.disabledModels.has(id))
      .map(id => getModel(id));
  }

  const replySlots = targetBots.map(bot => {
    const replyId = `reply-${bot.id}-${Date.now()}`;
    const botReply = {
      id: replyId,
      sender: 'bot',
      botId: bot.id,
      text: 'Generating...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [],
      thinking: null
    };
    currentThread.messages.push(botReply);
    return { bot, botReply };
  });

  renderActiveThreadMessages();

  const streamPromises = replySlots.map(async ({ bot, botReply }) => {
    let accumulatedText = '';
    const generator = aiService.generateStreamResponse(bot, promptText, {
      systemPrompt: bot.systemPrompt,
      role: bot.role,
      attachments: currentAttachments
    });

    for await (const chunk of generator) {
      if (!chunk.isComplete) {
        accumulatedText += chunk.text;
        botReply.text = accumulatedText;
        if (chunk.thinking) botReply.thinking = chunk.thinking;
        updateLiveMessageDOM(botReply.id, accumulatedText, botReply.thinking, bot.id);
      } else {
        if (chunk.text) accumulatedText = chunk.text;
        botReply.text = accumulatedText;
        botReply.latencyMs = chunk.latencyMs;
        botReply.tokenCount = chunk.tokenCount;
        botReply.citations = chunk.citations || [];
        if (chunk.thinking) botReply.thinking = chunk.thinking;
        saveThreadsToStorage();
        renderActiveThreadMessages();
      }
    }
  });

  await Promise.all(streamPromises);
  saveThreadsToStorage();
}

function updateLiveMessageDOM(cardId, rawText, thinking, modelId) {
  const card = document.getElementById(cardId);
  if (card) {
    const streamBody = card.querySelector('.markdown-stream') || card;
    const parsed = window.marked ? window.marked.parse(rawText) : rawText;
    streamBody.innerHTML = formatCodeBlocks(parsed) + `<span class="typing-pulse-cursor"></span>`;
  }
  if (state.isSingleModelMode) {
    const singleScroll = document.getElementById('single-mode-scroll');
    if (singleScroll) {
      singleScroll.scrollTop = singleScroll.scrollHeight;
    }
  } else if (modelId) {
    const scrollContainer = document.getElementById(`scroll-col-${modelId}`);
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }
}

// ================= 5. HEADER ACTIONS =================
function bindHeaderActions() {
  const arenaToggle = document.getElementById('header-arena-toggle');
  const clearBtn = document.getElementById('clear-current-thread-btn');
  const exportBtn = document.getElementById('export-thread-btn');

  arenaToggle?.addEventListener('click', () => {
    if (state.isSingleModelMode) {
      window.switchBackToComparison();
    } else {
      window.focusModel(state.activeModelId);
    }
  });

  clearBtn?.addEventListener('click', () => {
    const thread = state.threads.find(t => t.id === state.activeThreadId);
    if (thread) {
      thread.messages = [];
      saveThreadsToStorage();
      renderActiveThreadMessages();
      showToast('Conversation cleared');
    }
  });

  exportBtn?.addEventListener('click', () => {
    const thread = state.threads.find(t => t.id === state.activeThreadId);
    if (!thread || thread.messages.length === 0) {
      showToast('No messages to export');
      return;
    }

    let md = `# ${thread.title}\n*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;
    thread.messages.forEach(m => {
      if (m.sender === 'user') {
        md += `### User\n\n${m.text}\n\n`;
      } else {
        const model = getModel(m.botId);
        md += `### ${model.name} (${model.provider})\n\n${m.text}\n\n---\n\n`;
      }
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${thread.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export downloaded');
  });
}

// ================= 6. COMMAND PALETTE (⌘K) =================
function bindCommandPalette() {
  const modal = document.getElementById('command-palette-modal');
  const btn = document.getElementById('command-palette-btn');
  const input = document.getElementById('command-palette-input');

  btn?.addEventListener('click', openCommandPalette);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeCommandPalette();
  });

  input?.addEventListener('input', (e) => {
    renderCommandResults(e.target.value.toLowerCase().trim());
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCommandPalette();
  });
}

function openCommandPalette() {
  const modal = document.getElementById('command-palette-modal');
  const input = document.getElementById('command-palette-input');
  if (modal) {
    modal.classList.add('active');
    if (input) {
      input.value = '';
      input.focus();
    }
    renderCommandResults('');
  }
}

function closeCommandPalette() {
  document.getElementById('command-palette-modal')?.classList.remove('active');
}

function renderCommandResults(query) {
  const container = document.getElementById('command-results-list');
  if (!container) return;

  const commands = [
    { title: 'New Conversation', sub: 'Create a clean chat session', icon: 'plus', action: () => { closeCommandPalette(); createNewChatThread(); } },
    { title: 'Claude 3.5 Sonnet', sub: 'Anthropic Reasoning & Code', icon: 'bot', action: () => { closeCommandPalette(); window.selectModel('claude-3-5-sonnet'); } },
    { title: 'GPT-4o', sub: 'OpenAI Multimodal Intelligence', icon: 'sparkles', action: () => { closeCommandPalette(); window.selectModel('gpt-4o'); } },
    { title: 'Gemini 2.0 Flash', sub: 'Google Ultra-Fast Inference', icon: 'zap', action: () => { closeCommandPalette(); window.selectModel('gemini-2-flash'); } },
    { title: 'Perplexity Sonar Pro', sub: 'Live Web Grounding', icon: 'globe', action: () => { closeCommandPalette(); window.selectModel('perplexity-sonar'); } },
    { title: 'DeepSeek R1', sub: 'Explicit Reasoning & Chain of Thought', icon: 'brain', action: () => { closeCommandPalette(); window.selectModel('deepseek-r1'); } },
    { title: 'Toggle Multi-Bot Arena', sub: 'Compare 4 models simultaneously', icon: 'swords', action: () => { closeCommandPalette(); document.getElementById('header-arena-toggle')?.click(); } },
    { title: 'API Keys & Settings', sub: 'Local credential & Ollama configuration', icon: 'key', action: () => { closeCommandPalette(); openSettingsModal(); } }
  ];

  SUGGESTED_PROMPTS.forEach(p => {
    commands.push({
      title: p.title,
      sub: p.subtitle,
      icon: 'terminal',
      action: () => {
        closeCommandPalette();
        window.useSuggestedPrompt(p.prompt, p.title);
      }
    });
  });

  const filtered = query ? commands.filter(c => c.title.toLowerCase().includes(query) || c.sub.toLowerCase().includes(query)) : commands;

  container.innerHTML = filtered.map((c, i) => `
    <div class="command-item" onclick="window.runCommand(${i})">
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <i data-lucide="${c.icon}" style="width: 15px; height: 15px; color: var(--text-muted);"></i>
        <div>
          <div style="font-weight: 500; font-size: 0.82rem; color: #ffffff;">${c.title}</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${c.sub}</div>
        </div>
      </div>
      <i data-lucide="corner-down-left" style="width: 12px; height: 12px; color: var(--text-dim);"></i>
    </div>
  `).join('');

  window._filteredCommands = filtered;
  initIcons();
}

window.runCommand = (index) => {
  if (window._filteredCommands && window._filteredCommands[index]) {
    window._filteredCommands[index].action();
  }
};

// ================= 7. KEYBOARD SHORTCUTS =================
function bindKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault();
      createNewChatThread();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      document.getElementById('sidebar-collapse-btn')?.click();
    }
  });
}

// ================= 8. SETTINGS MODAL =================
function bindSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const userProfile = document.getElementById('user-profile-btn');
  const iconBtn = document.getElementById('open-settings-icon-btn');
  const closeBtn = document.getElementById('close-settings-modal-btn');
  const form = document.getElementById('modal-api-keys-form');

  userProfile?.addEventListener('click', openSettingsModal);
  iconBtn?.addEventListener('click', openSettingsModal);
  closeBtn?.addEventListener('click', closeSettingsModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeSettingsModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.apiKeys = {
      'perplexity-sonar': document.getElementById('modal-key-perplexity')?.value || '',
      'claude-3-5-sonnet': document.getElementById('modal-key-claude')?.value || '',
      'gemini-2-flash': document.getElementById('modal-key-gemini')?.value || '',
      'gpt-4o': document.getElementById('modal-key-openai')?.value || '',
      'ollama-url': document.getElementById('modal-key-ollama-url')?.value || '',
      'ollama-model': document.getElementById('modal-key-ollama-model')?.value || ''
    };
    state.isLiveMode = !!document.getElementById('modal-live-mode-check')?.checked;

    localStorage.setItem('omnibot_api_keys', JSON.stringify(state.apiKeys));
    localStorage.setItem('omnibot_live_mode', JSON.stringify(state.isLiveMode));
    aiService.setApiKeys(state.apiKeys);
    aiService.setLiveMode(state.isLiveMode);

    closeSettingsModal();
    showToast('API credentials saved');
  });
}

function openSettingsModal() {
  const modal = document.getElementById('settings-modal');
  if (modal) {
    const keyPerplex = document.getElementById('modal-key-perplexity');
    const keyClaude = document.getElementById('modal-key-claude');
    const keyGemini = document.getElementById('modal-key-gemini');
    const keyOpenai = document.getElementById('modal-key-openai');
    const keyOllamaUrl = document.getElementById('modal-key-ollama-url');
    const keyOllamaModel = document.getElementById('modal-key-ollama-model');
    const liveCheck = document.getElementById('modal-live-mode-check');

    if (keyPerplex) keyPerplex.value = state.apiKeys['perplexity-sonar'] || '';
    if (keyClaude) keyClaude.value = state.apiKeys['claude-3-5-sonnet'] || '';
    if (keyGemini) keyGemini.value = state.apiKeys['gemini-2-flash'] || '';
    if (keyOpenai) keyOpenai.value = state.apiKeys['gpt-4o'] || '';
    if (keyOllamaUrl) keyOllamaUrl.value = state.apiKeys['ollama-url'] || '';
    if (keyOllamaModel) keyOllamaModel.value = state.apiKeys['ollama-model'] || '';
    if (liveCheck) liveCheck.checked = state.isLiveMode;

    modal.classList.add('active');
  }
}

function closeSettingsModal() {
  document.getElementById('settings-modal')?.classList.remove('active');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

// ================= VIEW ROUTER & HIGH-TECH BUFFERING PORTAL =================
let isTransitioning = false;

window.showWorkspace = function(skipBuffering = false) {
  if (isTransitioning) return;
  const landing = document.getElementById('landing-view');
  const appShell = document.getElementById('app-shell');
  const overlay = document.getElementById('workspace-transition-overlay');
  const statusText = document.getElementById('transition-status-text');
  const progressFill = document.getElementById('transition-progress-fill');
  const percentText = document.getElementById('transition-percent-text');

  // If direct link or user prefers no buffering
  if (skipBuffering || !overlay) {
    if (landing) landing.style.display = 'none';
    if (appShell) appShell.style.display = 'flex';
    window.location.hash = '#studio';
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
      scrollToBottom();
      const input = document.getElementById('main-chat-input') || document.getElementById('chat-input-textarea');
      if (input) input.focus();
    }, 80);
    return;
  }

  isTransitioning = true;

  // Reset overlay state
  overlay.style.display = 'flex';
  overlay.style.opacity = '1';
  if (progressFill) progressFill.style.width = '0%';
  if (percentText) percentText.textContent = '0%';
  if (statusText) statusText.textContent = 'Connecting to Universal AI Gateway...';

  // Highlight model sync pills sequentially
  const syncPills = overlay.querySelectorAll('.sync-pill');
  syncPills.forEach((p, idx) => {
    p.classList.remove('active');
    setTimeout(() => p.classList.add('active'), 200 + (idx * 220));
  });

  const steps = [
    { percent: 22, status: '✦ Connecting to Frontier AI Matrix...', delay: 150 },
    { percent: 54, status: '⚡ Initializing Claude 3.5, GPT-4o & Gemini Streams...', delay: 450 },
    { percent: 85, status: '🔒 Securing Sandbox Session & Persistence Store...', delay: 780 },
    { percent: 100, status: '🚀 Welcome to HackForge Studio!', delay: 1050 }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      if (progressFill) progressFill.style.width = `${step.percent}%`;
      if (percentText) percentText.textContent = `${step.percent}%`;
      if (statusText) statusText.textContent = step.status;
    }, step.delay);
  });

  // Complete transition after buffering finishes
  setTimeout(() => {
    if (landing) landing.style.display = 'none';
    if (appShell) appShell.style.display = 'flex';
    window.location.hash = '#studio';
    if (window.lucide) window.lucide.createIcons();

    // Smooth fade out of loader
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
      isTransitioning = false;
      scrollToBottom();
      const input = document.getElementById('main-chat-input') || document.getElementById('chat-input-textarea');
      if (input) input.focus();
    }, 320);
  }, 1250);
};

window.showLanding = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const landing = document.getElementById('landing-view');
  const appShell = document.getElementById('app-shell');
  if (landing) {
    landing.style.display = 'block';
    landing.scrollTop = 0;
  }
  if (appShell) appShell.style.display = 'none';
  window.location.hash = '#landing';
  if (window.lucide) window.lucide.createIcons();
};

// Handle Browser Back & Forward Navigation
window.addEventListener('hashchange', () => {
  if (window.location.hash === '#studio' || window.location.hash === '#workspace' || window.location.hash === '#app') {
    window.showWorkspace(true);
  } else if (window.location.hash === '#landing' || window.location.hash === '' || window.location.hash === '#features' || window.location.hash === '#architecture' || window.location.hash === '#impact' || window.location.hash === '#enterprise' || window.location.hash === '#faqs') {
    const landing = document.getElementById('landing-view');
    const appShell = document.getElementById('app-shell');
    if (landing && appShell && appShell.style.display === 'flex') {
      landing.style.display = 'block';
      appShell.style.display = 'none';
    }
  }
});

// Check if user came with #studio or #app hash on initial load
if (window.location.hash === '#app' || window.location.hash === '#workspace' || window.location.hash === '#studio') {
  window.showWorkspace(true);
} else {
  // Default to landing page on initial load
  const landing = document.getElementById('landing-view');
  const appShell = document.getElementById('app-shell');
  if (landing) landing.style.display = 'block';
  if (appShell) appShell.style.display = 'none';
}

// ================= DYNAMIC SCROLL-REACTIVE BACKGROUND ENGINE =================
function initScrollBackgroundReactive() {
  const landing = document.getElementById('landing-view');
  if (!landing) return;

  const sections = [
    { id: 'landing-hero', name: 'hero' },
    { id: 'architecture', name: 'architecture' },
    { id: 'features', name: 'features' },
    { id: 'impact', name: 'impact' },
    { id: 'enterprise', name: 'enterprise' },
    { id: 'faqs', name: 'faqs' }
  ];

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = landing.scrollTop;
        const scrollHeight = landing.scrollHeight - landing.clientHeight;
        const progress = Math.min(Math.max(scrollTop / (scrollHeight || 1), 0), 1);

        document.documentElement.style.setProperty('--scroll-p', progress.toFixed(4));
        document.documentElement.style.setProperty('--scroll-deg', `${(progress * 360).toFixed(1)}deg`);
        document.documentElement.style.setProperty('--blob-shift-y', `${(progress * 280).toFixed(1)}px`);

        // Detect active section based on scroll offset
        let activeSec = 'hero';
        for (const sec of sections) {
          const el = document.getElementById(sec.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.55 && rect.bottom >= window.innerHeight * 0.15) {
              activeSec = sec.name;
            }
          }
        }

        document.body.setAttribute('data-scroll-section', activeSec);
        ticking = false;
      });
      ticking = true;
    }
  }

  landing.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run immediately on load
}

initScrollBackgroundReactive();


