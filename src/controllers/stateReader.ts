import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, setDoc, doc } from "firebase/firestore";
import Item from "../itemTree/item";
import { firebaseConfig } from "./stateReader.config";
import { deserialize, serialize } from "./stateReader.serializer";
import initialState from "./stateReader.initial";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const userId = "ilya-test";
const docRef = doc(db, "users", userId);

const SHOULD_READ_LOCALSTORAGE = true;

export const loadLocally = (): Item => {
  const data = localStorage.getItem("items:v1");

  return data && SHOULD_READ_LOCALSTORAGE ? deserialize(data) : initialState;
};

export const saveLocally = (root: Item): void => {
  if (SHOULD_READ_LOCALSTORAGE)
    localStorage.setItem("items:v1", serialize(root));
};

export const saveToFirestore = async (root: Item) => {
  const str = serialize(root);
  console.log(`Saving state: ${str.length} symbols`);
  await setDoc(docRef, { itemsSerialized: str });
  console.log(`Saved`);
};

export const loadFromFirestore = async (): Promise<Item> => {
  console.log("Loading from firebase");
  const querySnapshot = await getDoc(docRef);
  const str = querySnapshot.data()?.itemsSerialized;
  if (str) {
    console.log("Loaded from firebase");
    const res = deserialize(str);
    return res;
  }
  throw new Error("Data is empty");
};
