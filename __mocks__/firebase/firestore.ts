/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/prevent-abbreviations */
import { FirebaseApp } from 'firebase/app'
import { CollectionReference, DocumentReference, Firestore, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore'
import { get, noop, randomString, set } from '../../packages/shared/dist'

// --- Virtual Firestore database.
export const firestoreData: Record<string, Record<string, any>> = {}

// --- `firebase/firestore`.getFirestore()
export const getFirestore = (app?: FirebaseApp): Firestore => ({
  type: 'firestore',
  app: app as any,
  toJSON: noop as any,
})

// --- `firebase/firestore`.doc()
export const doc = (parent?: DocumentReference | CollectionReference | Firestore, path = randomString()): DocumentReference => ({
  type: 'document',
  path,
  id: path,
  parent: parent as any,
  converter: null as any,
  firestore: undefined as any,
  withConverter: noop as any,
})

// --- `firebase/firestore`.collection()
export const collection = (parent?: DocumentReference | CollectionReference | Firestore, path = randomString()): CollectionReference => ({
  type: 'collection',
  path,
  id: path,
  parent: parent as any,
  converter: null as any,
  firestore: undefined as any,
  withConverter: noop as any,
})

// --- `firebase/firestore`.setDoc()
export const setDoc = async(reference: any, data: any) => {
  reference.id = reference.id ?? randomString(16)
  const path = [reference.parent.id, reference.id].join('.')
  set(firestoreData, path, data)
}

// --- `firebase/firestore`.getDoc()
export const getDoc = async(reference: DocumentReference): Promise<QueryDocumentSnapshot> => {
  const path = [reference.parent.id, reference.id].join('.')
  const data = get(firestoreData, path)
  return {
    id: reference.id,
    exists: () => !!data,
    data: () => data,
    metadata: {} as any,
    get: (key: string) => get(data, key),
    ref: reference,
  }
}

// --- `firebase/firestore`.getDocs()
export const getDocs = async(colRef: CollectionReference): Promise<QuerySnapshot> => {
  const path = colRef.id
  const data = get(firestoreData, path, {})
  const docs = Object.entries(data).map(([id, docData]) => ({
    id,
    exists: () => true,
    data: () => docData,
    metadata: {} as any,
    get: (key: string) => get(docData, key),
    ref: doc(colRef, docData.id),
  }))

  // --- Return QuerySnapshot
  return {
    metadata: {} as any,
    size: data.length,
    docChanges: noop as any,
    forEach: (callback: (doc: QueryDocumentSnapshot) => void) => data.forEach(callback),
    empty: data.length > 0,
    query: undefined as any,
    docs,
  }
}

// --- `firebase/firestore`.deleteDoc()
export const deleteDoc = async(reference: DocumentReference) => {
  const path = [reference.parent.path, reference.id].join('.')
  set(firestoreData, path, undefined)
}

// --- `firebase/firestore`.writeBatch()
export const writeBatch = () => {
  const batchSet: [DocumentReference, any][] = []
  const batchDelete: DocumentReference[] = []
  return {

    // --- Write to batch
    set: (reference: DocumentReference, data: any) => {
      batchSet.push([reference, data])
    },

    // --- Add a delete to batch
    delete: (reference: DocumentReference) => {
      batchDelete.push(reference)
    },

    commit: async() => {
      if (batchSet.length > 500) throw new Error('Too many writes')
      for (const [reference, data] of batchSet) set(firestoreData, [reference.parent.id, reference.id].join('.'), data)
      if (batchDelete.length > 500) throw new Error('Too many deletes')
      for (const reference of batchDelete) deleteDoc(reference)
    },
  }
}
