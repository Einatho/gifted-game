import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';

interface Player {
  id: string;
  name: string;
  created_at: string;
}

interface AuthStore {
  player: Player | null;
  isLoading: boolean;

  signIn: (name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      player: null,
      isLoading: false,

      signIn: async (name: string) => {
        set({ isLoading: true });
        try {
          const trimmed = name.trim();
          if (!trimmed) {
            set({ isLoading: false });
            return { success: false, error: 'נא להזין שם' };
          }

          const { data, error } = await supabase
            .from('players')
            .insert({ name: trimmed })
            .select()
            .single();

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          // Create initial progress record
          await supabase.from('player_progress').insert({
            player_id: data.id,
            category_progress: {
              math: { currentLevel: 1, questionsCompleted: 0, correctAnswers: 0, bestScore: 0, starsEarned: 0, unlockedLevels: [1,2,3,4,5,6,7,8,9,10] },
              verbal: { currentLevel: 1, questionsCompleted: 0, correctAnswers: 0, bestScore: 0, starsEarned: 0, unlockedLevels: [1,2,3,4,5,6,7,8,9,10] },
              visual: { currentLevel: 1, questionsCompleted: 0, correctAnswers: 0, bestScore: 0, starsEarned: 0, unlockedLevels: [1,2,3,4,5,6,7,8,9,10] },
              logic: { currentLevel: 1, questionsCompleted: 0, correctAnswers: 0, bestScore: 0, starsEarned: 0, unlockedLevels: [1,2,3,4,5,6,7,8,9,10] },
            },
            achievements: [],
          });

          set({ player: data, isLoading: false });
          return { success: true };
        } catch (e: any) {
          set({ isLoading: false });
          return { success: false, error: e.message || 'שגיאה לא צפויה' };
        }
      },

      signOut: () => {
        set({ player: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'gifted-game-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ player: state.player }),
    }
  )
);
