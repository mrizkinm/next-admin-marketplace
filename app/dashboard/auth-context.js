'use client';

import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtVerify } from 'jose';

export const AuthContext = createContext(); // Membuat Context Global

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await fetchUserData();
      } catch (err) {
        console.error('Gagal mengambil data user:', err);
        try {
          await getNewAccessToken();
          await fetchUserData();
        } catch (error) {
          setError('Gagal mendapatkan token baru');
          console.error('Error mendapatkan token baru:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) throw new Error('Access token tidak ditemukan');

      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET)
      );

      console.log('User Payload:', payload);
      setUser(payload);
    } catch (error) {
      console.error('Gagal verifikasi JWT token:', error.message);
      throw error;
    }
  };

  const getNewAccessToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh-token", { method: "GET" });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Data dari refresh-token API:', responseData);

      if (responseData.accessToken) {
        Cookies.set('accessToken', responseData.accessToken, { 
          httpOnly: false, 
          secure: process.env.NODE_ENV === 'production', 
          expires: 15 / 60 / 24 // 15 menit 
        });
      } else {
        throw new Error('Access token tidak tersedia di response');
      }
    } catch (error) {
      console.error('Gagal mendapatkan akses token baru:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
