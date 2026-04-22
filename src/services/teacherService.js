import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase/confic';

/**
 * Add a subject to the user's subjects subcollection and append to the user's subjects array
 * @param {string} uid
 * @param {object} subject - subject object
 * @param {string} thumbnailUrl - optional thumbnail url to set on user
 */
export async function addSubjectForUser(uid, subject = {}, thumbnailUrl = '') {
  if (!uid) throw new Error('uid is required');

  try {
    // 1) add to subcollection users/{uid}/subjects
    const subjectsColl = collection(db, 'users', uid, 'subjects');
    const docRef = await addDoc(subjectsColl, {
      ...subject,
      createdAt: new Date().toISOString(),
    });

    // 2) append to users/{uid} subjects array using arrayUnion (keeps a copy on the main doc)
    const userRef = doc(db, 'users', uid);
    const subjectForArray = { ...subject, subjectId: docRef.id };

    await updateDoc(userRef, {
      subjects: arrayUnion(subjectForArray),
      updatedAt: new Date().toISOString(),
      ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('addSubjectForUser error:', error);
    return { success: false, error };
  }
}
