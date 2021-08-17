import { firestoreService, storageService } from "../firebaseInstance";
import { v4 as uuidv4 } from "uuid";

const createUserdataInFirestore = async (faceImageRef, userdata) => {
    const fileRef = storageService.ref().child(`userImage/${userdata.uid}/${uuidv4()}`);
    const uploadTaskSnapshot = await fileRef.put(faceImageRef.current);
    userdata.imageURL = await uploadTaskSnapshot.ref.getDownloadURL();
    firestoreService.collection("users").add(userdata);
};

const readUserdataFromEmail = (email) => {
    return firestoreService.collection("users").where("email", "==", email).get();
}

export {createUserdataInFirestore, readUserdataFromEmail};