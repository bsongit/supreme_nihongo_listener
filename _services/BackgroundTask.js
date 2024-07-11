import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Speech from './Speech';

const TASK_NAME = 'BACKGROUND_SPEAKER_TASK';

TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  const { phrases, voices, firstTranslate } = data;
  if (phrases.length === 0) return BackgroundFetch.Result.NoData;

  const randomIndex = Math.floor(Math.random() * phrases.length);
  const phrase = phrases[randomIndex];
  const language = firstTranslate ? 'pt' : 'jp';
  const voice = voices[firstTranslate ? 'pt' : 'jp'][Math.floor(Math.random() * voices[firstTranslate ? 'pt' : 'jp'].length)];
  
  await Speech.speak(phrase[language], { _voiceIndex: Math.floor(1 + Math.random() * 4), language, voice });

  return BackgroundFetch.Result.NewData;
});

export const registerBackgroundTask = async (phrases, voices, firstTranslate) => {
  await BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 60, // Minimum interval in seconds
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });


//   TaskManager.setTaskOptionsAsync(TASK_NAME, {
//     data: {
//       phrases,
//       voices,
//       firstTranslate
//     },
//   });
};