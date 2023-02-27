import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
}
const app = initializeApp(firebaseConfig)

const firestore = getFirestore(app)

export const database = {
    folders: {
        add: async (folder) => {
            try {
                await addDoc(collection(firestore, "folders"), folder)
            } catch (e) {
                console.error("Error adding folder: ", e);
            }
        },
        get: (folderId) => {
            const docRef = doc(collection(firestore, "folders"), folderId)
            return getDoc(docRef)
        },
        collection: collection(firestore, "folders")

    },
    files: {
        add: async (file) => {
            try {
                await addDoc(collection(firestore, "files"), file)
            } catch (e) {
                console.error("Error adding file: ", e);
            }
        },
        collection: collection(firestore, "files")
    },
    formatDoc: (doc) => {
        return { id: doc.id, ...doc.data() }
    },
    getCurrentTimestamp: serverTimestamp,
}

export const auth = getAuth(app)
export const storage = getStorage(app);
export default app
