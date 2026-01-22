import { Platform } from 'react-native';
import {
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

export async function requestAVPermissions() {
  if (Platform.OS !== 'android') return true;

  const res = await requestMultiple([
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
  ]);

  return (
    res[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED &&
    res[PERMISSIONS.ANDROID.RECORD_AUDIO] === RESULTS.GRANTED
  );
}
