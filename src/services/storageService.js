import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { storage } from '../firebase/confic';

// Upload a local image URI (react-native) to Firebase Storage and return download URL
export async function uploadImageForUser(uid, localUri, filename = null) {
  if (!localUri) return null;

  try {
    // If it's already a remote URL, return as-is
    if (localUri.startsWith('http')) return localUri;

    const uriParts = localUri.split('/');
    const name =
      filename || uriParts[uriParts.length - 1] || `img_${Date.now()}`;
    const path = `teachers/${uid}/thumbnails/${Date.now()}_${name}`;

    // Fetch the file and convert to blob
    const response = await fetch(localUri);
    const blob = await response.blob();

    const ref = storageRef(storage, path);
    await uploadBytes(ref, blob);
    const url = await getDownloadURL(ref);
    return url;
  } catch (error) {
    console.error('uploadImageForUser error:', error);
    throw error;
  }
}
