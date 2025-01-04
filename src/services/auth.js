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

    return data;
  },

  async checkAuth() {
    const response = await fetch(`${BASE_URL}/check`);
    const data = await response.json();
    return data.authenticated;
  }
}; 