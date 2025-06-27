import { auth } from '../firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper to get fresh auth token
async function getAuthToken() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('No authenticated user found');
      return null;
    }
    return await currentUser.getIdToken(true);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

export const api = {
  async request(endpoint, options = {}) {
    try {
      const token = await getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      };

      console.log(`[API] ${options.method || 'GET'} ${endpoint}`, options.body || '');
      const startTime = Date.now();
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const responseTime = Date.now() - startTime;
      const text = await response.text();
      
      console.log(`[API] ${response.status} ${endpoint} (${responseTime}ms)`);
      
      let data;
      try {
        data = text ? JSON.parse(text) : {};
        console.debug('[API] Response:', data);
      } catch (e) {
        console.error('[API] Invalid JSON response:', text);
        throw new Error('Invalid server response');
      }
      
      if (!response.ok) {
        const error = new Error(data.error || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = data;
        console.error('[API] Error response:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`[API] Request failed (${endpoint}):`, error);
      throw error;
    }
  },

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  async post(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST' });
  },

  // Cats
  async getCats() {
    console.log('[API] Fetching all cats');
    const response = await this.request('/api/cats');
    console.log('[API] API Response:', response);
    console.log(`[API] Found ${response.cats?.length || 0} cats`);
    return response; // Return the full response object
  },

  async getCat(catId) {
    if (!catId) {
      console.error('[API] No catId provided to getCat');
      throw new Error('Cat ID is required');
    }
    console.log(`[API] Fetching cat ${catId}`);
    return this.request(`/api/cats/${catId}`);
  },

  // Swipes
  async swipe(catId, liked) {
    if (!catId) {
      console.error('[API] No catId provided to swipe');
      throw new Error('Cat ID is required');
    }
    console.log(`[API] Swiping ${liked ? 'right' : 'left'} on cat ${catId}`);
    return this.request('/api/swipe', {
      method: 'POST',
      body: { 
        catId, 
        liked,
        timestamp: new Date().toISOString()
      }
    });
  },

  // Matches
  async getMatches() {
    console.log('[API] Fetching matches');
    return this.request('/api/matches');
  },

  // Profile
  async updateProfile(profileData) {
    console.log('[API] Updating profile');
    return this.request('/api/update-user', {
      method: 'POST',
      body: profileData
    });
  },

  // Uploads
  async uploadFile(file) {
    console.log('[API] Uploading file:', file.name);
    const formData = new FormData();
    formData.append('file', file);
    
    // For file uploads, we need to omit the Content-Type header
    // so the browser can set it with the correct boundary
    const { headers, ...options } = {
      method: 'POST',
      body: formData,
    };
    
    return this.request('/api/upload', options);
  }
};

// Message APIs
export const getMessages = async (matchId) => {
  try {
    const response = await api.get(`/api/messages/${matchId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (matchId, content) => {
  try {
    const response = await api.post('/api/messages', {
      matchId,
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const markMessagesAsRead = async (matchId) => {
  try {
    const response = await api.post(`/api/messages/${matchId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Update the default export to include the new functions
export default {
  ...api,
  getMessages,
  sendMessage,
  markMessagesAsRead
};