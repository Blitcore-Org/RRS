const BASE_URL = '/api/auth';

export const authService = {
  async login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('isLoggedIn', 'true');

    return data;
  },

  async logout() {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Logout failed');
    }

    localStorage.removeItem('isLoggedIn');

    return data;
  },

  async checkAuth() {
    const response = await fetch(`${BASE_URL}/check`);
    const data = await response.json();
    return data.authenticated;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await fetch(`${BASE_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Password change failed');
    }

    return data;
  },

  async adminResetPassword(userEmail) {
    const response = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Password reset failed');
    }

    return data;
  }
}; 