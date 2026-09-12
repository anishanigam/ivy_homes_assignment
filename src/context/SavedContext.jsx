import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [savedItems, setSavedItems] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (!isAuthenticated) {
      setSavedItems([]);
      setSavedIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const res = await api.getSaved();
      const results = res.results || [];
      setSavedItems(results);
      setSavedIds(new Set(results.map((item) => item.listing_id)));
    } catch (err) {
      console.warn('Error fetching saved listings:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved, user?.email]);

  const toggleSave = async (listing) => {
    if (!isAuthenticated || !listing) return;
    const lid = listing.listing_id;
    const isCurrentlySaved = savedIds.has(lid);

    // Optimistic update
    const nextSavedIds = new Set(savedIds);
    if (isCurrentlySaved) {
      nextSavedIds.delete(lid);
      setSavedIds(nextSavedIds);
      setSavedItems((prev) => prev.filter((item) => item.listing_id !== lid));
      try {
        await api.removeSavedListing(lid);
      } catch (err) {
        console.error('Failed to remove saved listing, rolling back', err);
        fetchSaved();
      }
    } else {
      nextSavedIds.add(lid);
      setSavedIds(nextSavedIds);
      setSavedItems((prev) => [listing, ...prev]);
      try {
        await api.saveListing(lid);
      } catch (err) {
        console.error('Failed to save listing, rolling back', err);
        fetchSaved();
      }
    }
  };

  const isSaved = (listingId) => savedIds.has(listingId);

  return (
    <SavedContext.Provider
      value={{
        savedItems,
        savedIds,
        loading,
        toggleSave,
        isSaved,
        refetch: fetchSaved,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
}