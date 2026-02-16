import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Profile, WheelItem, WheelSettings, SpinRecord } from '../types';
import { DEFAULT_WHEEL_SETTINGS, DEFAULT_WHEEL_ITEM } from '../types';

interface ProfileStoreState {
  profiles: Profile[];
  activeProfileId: string | null;

  createProfile: (name: string) => string;
  renameProfile: (id: string, name: string) => void;
  duplicateProfile: (id: string) => string | null;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;

  addItem: (label: string, weight?: number) => void;
  updateItem: (itemId: string, patch: Partial<WheelItem>) => void;
  removeItem: (itemId: string) => void;
  bulkAddItems: (labels: string[]) => void;

  updateSettings: (patch: Partial<WheelSettings>) => void;

  addHistoryRecord: (record: SpinRecord) => void;
  clearHistory: () => void;

  resetCooldowns: () => void;
  resetEliminations: () => void;
}

function createDefaultProfile(name: string): Profile {
  return {
    id: nanoid(),
    name,
    items: [],
    settings: { ...DEFAULT_WHEEL_SETTINGS },
    history: [],
    historyLimit: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createItem(label: string, weight = 1): WheelItem {
  return {
    id: nanoid(),
    label,
    ...DEFAULT_WHEEL_ITEM,
    weight,
  };
}

function getActiveProfile(state: { profiles: Profile[]; activeProfileId: string | null }): Profile | undefined {
  return state.profiles.find((p) => p.id === state.activeProfileId);
}

function updateActiveProfile(
  state: { profiles: Profile[] },
  activeProfileId: string | null,
  updater: (profile: Profile) => Profile,
): Profile[] {
  return state.profiles.map((p) => {
    if (p.id === activeProfileId) {
      return { ...updater(p), updatedAt: new Date().toISOString() };
    }
    return p;
  });
}

// Create initial sample profile
const sampleProfile: Profile = {
  id: nanoid(),
  name: 'My First Wheel',
  items: [
    createItem('Pizza'),
    createItem('Sushi'),
    createItem('Tacos'),
    createItem('Burger'),
    createItem('Pasta'),
  ],
  settings: { ...DEFAULT_WHEEL_SETTINGS },
  history: [],
  historyLimit: 100,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set, get) => ({
      profiles: [sampleProfile],
      activeProfileId: sampleProfile.id,

      createProfile: (name: string) => {
        const profile = createDefaultProfile(name);
        set((state) => ({
          profiles: [...state.profiles, profile],
          activeProfileId: profile.id,
        }));
        return profile.id;
      },

      renameProfile: (id: string, name: string) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p,
          ),
        }));
      },

      duplicateProfile: (id: string) => {
        const state = get();
        const source = state.profiles.find((p) => p.id === id);
        if (!source) return null;
        const newProfile: Profile = {
          ...structuredClone(source),
          id: nanoid(),
          name: `${source.name} (Copy)`,
          history: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        // Regenerate item IDs
        newProfile.items = newProfile.items.map((item) => ({ ...item, id: nanoid() }));
        set((state) => ({
          profiles: [...state.profiles, newProfile],
          activeProfileId: newProfile.id,
        }));
        return newProfile.id;
      },

      deleteProfile: (id: string) => {
        set((state) => {
          const remaining = state.profiles.filter((p) => p.id !== id);
          const newActiveId =
            state.activeProfileId === id
              ? remaining[0]?.id ?? null
              : state.activeProfileId;
          return { profiles: remaining, activeProfileId: newActiveId };
        });
      },

      setActiveProfile: (id: string) => {
        set({ activeProfileId: id });
      },

      addItem: (label: string, weight = 1) => {
        const state = get();
        set({
          profiles: updateActiveProfile(state, state.activeProfileId, (p) => ({
            ...p,
            items: [...p.items, createItem(label, weight)],
          })),
        });
      },

      updateItem: (itemId: string, patch: Partial<WheelItem>) => {
        const state = get();
        set({
          profiles: updateActiveProfile(state, state.activeProfileId, (p) => ({
            ...p,
            items: p.items.map((item) =>
              item.id === itemId ? { ...item, ...patch } : item,
            ),
          })),
        });
      },

      removeItem: (itemId: string) => {
        const state = get();
        set({
          profiles: updateActiveProfile(state, state.activeProfileId, (p) => ({
            ...p,
            items: p.items.filter((item) => item.id !== itemId),
          })),
        });
      },

      bulkAddItems: (labels: string[]) => {
        const state = get();
        const newItems = labels
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
          .map((l) => createItem(l));
        set({
          profiles: updateActiveProfile(state, state.activeProfileId, (p) => ({
            ...p,
            items: [...p.items, ...newItems],
          })),
        });
      },

      updateSettings: (patch: Partial<WheelSettings>) => {
        const state = get();
        set({
          profiles: updateActiveProfile(state, state.activeProfileId, (p) => ({
            ...p,
            settings: { ...p.settings, ...patch },
          })),
        });
      },

      addHistoryRecord: (record: SpinRecord) => {
        const state = get();
        set({
          profiles: updateActiveProfile(state, state.activeProfileId, (p) => {
            const newHistory = [record, ...p.history].slice(0, p.historyLimit);
            return { ...p, history: newHistory };
          }),
        });
      },

      clearHistory: () => {
        const state = get();
        set({
          profiles: updateActiveProfile(state, state.activeProfileId, (p) => ({
            ...p,
            history: [],
          })),
        });
      },

      resetCooldowns: () => {
        const state = get();
        set({
          profiles: updateActiveProfile(state, state.activeProfileId, (p) => ({
            ...p,
            items: p.items.map((item) => ({
              ...item,
              cooldownSpinsRemaining: 0,
              cooldownExpiresAt: 0,
            })),
          })),
        });
      },

      resetEliminations: () => {
        const state = get();
        set({
          profiles: updateActiveProfile(state, state.activeProfileId, (p) => ({
            ...p,
            items: p.items.map((item) => ({
              ...item,
              temporarilyEliminated: false,
            })),
          })),
        });
      },
    }),
    {
      name: 'wheel-spinner-profiles',
    },
  ),
);

// Selector for active profile
export function useActiveProfile(): Profile | undefined {
  return useProfileStore((state) =>
    state.profiles.find((p) => p.id === state.activeProfileId),
  );
}
