// Authentication Service with Mock LocalStorage Persistence

const USERS_DB_KEY = 'omnibot_registered_users';
const CURRENT_USER_KEY = 'omnibot_current_user';

// Pre-seeded demo user
const DEFAULT_USERS = [
  {
    id: 'usr_demo_1',
    name: 'Alex Vance',
    email: 'alex.vance@linear.app',
    password: 'password123',
    avatar: 'AV',
    plan: 'Pro Member',
    createdAt: '2026-01-15'
  }
];

export class AuthService {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    if (!localStorage.getItem(USERS_DB_KEY)) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(DEFAULT_USERS));
    }
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_DB_KEY)) || DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  }

  getCurrentUser() {
    try {
      const user = localStorage.getItem(CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  async signIn(email, password) {
    await new Promise(r => setTimeout(r, 350)); // realistic micro-delay
    const users = this.getUsers();
    const cleanEmail = email.toLowerCase().trim();

    const matched = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
    if (!matched) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const sessionUser = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      avatar: matched.avatar || matched.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      plan: matched.plan || 'Pro Member'
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }

  async signUp(name, email, password) {
    await new Promise(r => setTimeout(r, 450));
    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Please enter your full name.');
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please sign in.');
    }

    const initials = cleanName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
    const newUser = {
      id: 'usr_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: password,
      avatar: initials,
      plan: 'Pro Member',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      plan: newUser.plan
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }

  async loginAsDemo() {
    return this.signIn('alex.vance@linear.app', 'password123');
  }

  signOut() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}
