import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Lexer types
export interface Token {
  type: string;
  lexeme: string;
  line: number;
  column: number;
}

export interface LexerError {
  message: string;
  line: number;
  column: number;
}

export interface LexerResponse {
  success: boolean;
  data?: {
    tokens: Token[];
    html?: string;
  };
  errors?: LexerError[];
}

// Lexer API functions
export const analyzeCode = async (input: string): Promise<LexerResponse> => {
  try {
    const response = await api.post('/api/lexer/analyze', { input });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data: LexerResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    throw error;
  }
};

// Export the configured axios instance
export default api; 