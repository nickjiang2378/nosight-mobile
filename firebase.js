//import { initializeApp } from "firebase/app";
//import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = require("./keys.json");
if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();

//const app = initializeApp(firebaseConfig);
//const storage = getStorage(app);

const API = "https://us-central1-nosight-c105e.cloudfunctions.net/app/addImage";

async function uploadImageAsString(string) {
    const storageRef = ref(storage, 'child.jpg');
    const message4 = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
    const snapshot = await uploadString(storageRef, message4, 'data_url');
    console.log(`Uploaded string: ${snapshot}`);
}

export async function uploadImageAsync(uri) {
    console.log(uri);
    if (!uri) {
        return;
    }
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const metadata = {
        contentType: 'image/jpeg'
    };

    // V8.10.0
    var storageRef = firebase.storage().ref().child('images/' + new Date().toISOString());
    let downloadURL = "";
    await storageRef.put(blob).then(async (snapshot) => {
        console.log('Uploaded a blob or file!');
        downloadURL = await snapshot?.ref?.getDownloadURL();
    });
    
    // Upload file and metadata to the object 'images/mountains.jpg'    
    // const storageRef = ref(storage, 'images/' + new Date().toISOString());
    // const snapshot = await uploadBytesResumable(storageRef, blob);
    // console.log("Uploaded!");
    // const downloadURL = await getDownloadURL(storageRef);
    
    console.log("File available at", downloadURL);
    blob.close();

    await fetch(API, {
        method: "POST",
        body: JSON.stringify({ img_str: downloadURL }),
        headers: { 'Content-Type': "application/json" }
    })

    console.log("Saved in DB!")

}