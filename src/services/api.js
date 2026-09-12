const BASE_URL = import.meta.env.VITE_API_URL || 'https://solve.ivy.homes';
const API_KEY = import.meta.env.VITE_API_KEY || 'IVY26-007DED9E24B4';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
    this.apiKey = API_KEY;
    this.token = localStorage.getItem('ivy_access_token') || null;
    this.refreshToken = localStorage.getItem('ivy_refresh_token') || null;
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  setAuth(tokens) {
    if (tokens.access_token) {
      this.token = tokens.access_token;
      localStorage.setItem('ivy_access_token', tokens.access_token);
    }
    if (tokens.refresh_token) {
      this.refreshToken = tokens.refresh_token;
      localStorage.setItem('ivy_refresh_token', tokens.refresh_token);
    }
    if (tokens.expires_in) {
      const expiresAt = Date.now() + tokens.expires_in * 1000;
      localStorage.setItem('ivy_expires_at', expiresAt.toString());
    }
  }

  clearAuth() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('ivy_access_token');
    localStorage.removeItem('ivy_refresh_token');
    localStorage.removeItem('ivy_expires_at');
    localStorage.removeItem('ivy_user');
  }

  onRefreshed(token) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  addRefreshSubscriber(callback) {
    this.refreshSubscribers.push(callback);
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      this.clearAuth();
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.setAuth(data);
      return data.access_token;
    } catch (err) {
      this.clearAuth();
      throw err;
    }
  }

  async request(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    let response = await fetch(url, { ...options, headers });

    // Handle 401 token expiration transparently
    if (response.status === 401 && this.refreshToken && !path.includes('/auth/login') && !path.includes('/auth/refresh')) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;
          this.onRefreshed(newToken);
        } catch (refreshErr) {
          this.isRefreshing = false;
          throw refreshErr;
        }
      }

      const retryPromise = new Promise((resolve, reject) => {
        this.addRefreshSubscriber(async (token) => {
          try {
            headers['Authorization'] = `Bearer ${token}`;
            const retryRes = await fetch(url, { ...options, headers });
            resolve(retryRes);
          } catch (e) {
            reject(e);
          }
        });
      });

      response = await retryPromise;
    }

    if (!response.ok) {
      let errData = {};
      try {
        errData = await response.json();
      } catch (e) {
        errData = { detail: response.statusText };
      }
      const error = new Error(errData.detail || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = errData;
      throw error;
    }

    return response.json();
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setAuth(data);
    if (data.user) {
      localStorage.setItem('ivy_user', JSON.stringify(data.user));
    }
    return data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout request ignored server error:', e);
    } finally {
      this.clearAuth();
    }
  }

  // Collection endpoints (using limit & offset)
  async getListings(params = {}) {
    const query = new URLSearchParams();
    // Default limit 50, offset 0
    query.set('limit', params.limit || 50);
    query.set('offset', params.offset || 0);

    if (params.locality) query.set('locality', params.locality.toLowerCase());
    if (params.bhk) query.set('bhk', params.bhk);
    if (params.min_price) query.set('min_price', params.min_price);
    if (params.max_price) query.set('max_price', params.max_price);
    if (params.furnishing) query.set('furnishing', params.furnishing);
    if (params.property_type) query.set('property_type', params.property_type);

    return this.request(`/v1/listings?${query.toString()}`);
  }

  async getListing(id) {
    // Discrepancy #8: Detail endpoint is plural /v1/listings/{id}
    return this.request(`/v1/listings/${id}`);
  }

  async getRentals(params = {}) {
    const query = new URLSearchParams();
    query.set('limit', params.limit || 50);
    query.set('offset', params.offset || 0);
    if (params.locality) query.set('locality', params.locality.toLowerCase());
    if (params.bhk) query.set('bhk', params.bhk);
    if (params.furnishing) query.set('furnishing', params.furnishing);

    return this.request(`/v1/rentals?${query.toString()}`);
  }

  async getRental(id) {
    return this.request(`/v1/rentals/${id}`);
  }

  async getProjects(params = {}) {
    const query = new URLSearchParams();
    query.set('limit', params.limit || 50);
    query.set('offset', params.offset || 0);
    if (params.locality) query.set('locality', params.locality.toLowerCase());
    if (params.project_status) query.set('project_status', params.project_status);

    return this.request(`/v1/projects?${query.toString()}`);
  }

  async getProject(id) {
    return this.request(`/v1/projects/${id}`);
  }

  // Saved / Favourites
  // Discrepancy #11: /v1/favourites is 404, real endpoint is /v1/saved with { listing_id }
  async getSaved() {
    return this.request('/v1/saved');
  }

  async saveListing(listing_id) {
    return this.request('/v1/saved', {
      method: 'POST',
      body: JSON.stringify({ listing_id }),
    });
  }

  async removeSavedListing(listing_id) {
    return this.request(`/v1/saved/${listing_id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
export default api;