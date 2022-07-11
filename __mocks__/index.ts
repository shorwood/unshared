import { DocumentData, DocumentReference } from 'firebase/firestore'

// --- Mock a new document/reference
export const mockData = () => ({ name: 'John Doe', age: Math.random() * 100 }) as DocumentData
export const mockReference = (path: string) => ({ id: undefined, parent: { id: path } }) as unknown as DocumentReference
