import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";

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
        remove: async (folderId, childFiles, childFolders) => {
            const folderRef = doc(collection(firestore, "folders"), folderId)
            try {
                await deleteDoc(folderRef)
            } catch (e) {
                console.error("Error deleting folder: ", e);
            }
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
        remove: async (fileId) => {
            const fileRef = doc(collection(firestore, "files"), fileId)
            try {
                await deleteDoc(fileRef)
            } catch (e) {
                console.error("Error deleting file: ", e);
            }
        },
        collection: collection(firestore, "files")
    },
    formatDoc: (doc) => {
        return { id: doc.id, ...doc.data() }
    },
    getCurrentTimestamp: serverTimestamp,
}

export const storageManager = {
    delete: async (filePath) => {
        const fileRef = ref(storage, filePath)
        try {
            await deleteObject(fileRef)
        } catch (error) {
            console.error('Error deleting the file', error)
        }
    }
}


export const auth = getAuth(app)
export const storage = getStorage(app);
export default app
