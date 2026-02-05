import { useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

type SoundType = 'correct' | 'incorrect' | 'levelUp' | 'achievement' | 'click' | 'countdown';

// Sound file mappings (would need actual sound files in assets/sounds/)
const soundFiles: Record<SoundType, any> = {
  correct: null, // require('@/assets/sounds/correct.mp3'),
  incorrect: null, // require('@/assets/sounds/incorrect.mp3'),
  levelUp: null, // require('@/assets/sounds/level-up.mp3'),
  achievement: null, // require('@/assets/sounds/achievement.mp3'),
  click: null, // require('@/assets/sounds/click.mp3'),
  countdown: null, // require('@/assets/sounds/countdown.mp3'),
};

export function useSound() {
  const soundsRef = useRef<Record<SoundType, Audio.Sound | null>>({
    correct: null,
    incorrect: null,
    levelUp: null,
    achievement: null,
    click: null,
    countdown: null,
  });

  const isLoadedRef = useRef(false);

  // Load sounds on mount
  useEffect(() => {
    const loadSounds = async () => {
      if (Platform.OS === 'web' || isLoadedRef.current) return;

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        // Load each sound if files exist
        for (const [type, file] of Object.entries(soundFiles)) {
          if (file) {
            const { sound } = await Audio.Sound.createAsync(file);
            soundsRef.current[type as SoundType] = sound;
          }
        }
        isLoadedRef.current = true;
      } catch (error) {
        console.log('Error loading sounds:', error);
      }
    };

    loadSounds();

    // Cleanup
    return () => {
      Object.values(soundsRef.current).forEach(async (sound) => {
        if (sound) {
          await sound.unloadAsync();
        }
      });
    };
  }, []);

  const play = useCallback(async (type: SoundType) => {
    if (Platform.OS === 'web') return;

    try {
      const sound = soundsRef.current[type];
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  }, []);

  const playCorrect = useCallback(() => play('correct'), [play]);
  const playIncorrect = useCallback(() => play('incorrect'), [play]);
  const playLevelUp = useCallback(() => play('levelUp'), [play]);
  const playAchievement = useCallback(() => play('achievement'), [play]);
  const playClick = useCallback(() => play('click'), [play]);
  const playCountdown = useCallback(() => play('countdown'), [play]);

  return {
    play,
    playCorrect,
    playIncorrect,
    playLevelUp,
    playAchievement,
    playClick,
    playCountdown,
  };
}

