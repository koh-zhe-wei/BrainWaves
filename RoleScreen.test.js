const firebase = require('@firebase/testing') //<--- You want this to be the top guy!!!
const admin = require('firebase-admin');
import { getAuth } from 'firebase/auth';





const projectId = "brainwaves---auth"
process.env.GCLOUD_PROJECT = projectId
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
let app = admin.initializeApp({projectId})
let db = firebase.firestore(app)


beforeAll(async ()=>{
    await firebase.clearFirestoreData({projectId});
})

// When Document written to '/TestCollection/{DocumentId}' , trigger function to copy it to '/Copies/{DocumentId}
test("Expect to find a copy in 'Copies' Collection", async ()=>{
    const testDoc = {
        userID: "1234",
        fullName: "test",
        email: "test",
        phoneNumber: "test",
        birthday: "test",
        gender:"test",
        race:"test", 
        region:"test", 
        neededSubject:"test",
        priceRange:"test", 
        availSchedule:"test",
        image:"test",
        url:"test",
        id: "test",
        token: "test",
    }
    const ref = await setDoc(doc(db,"test","1234") , { 
        userID: "1234",
        fullName: "test",
        email: "test",
        phoneNumber: "test",
        birthday: "test",
        gender:"test",
        race:"test", 
        region:"test", 
        neededSubject:"test",
        priceRange:"test", 
        availSchedule:"test",
        image:"test",
        url:"test",
        id: "test",
        token: "test",

    }); 
    
    const copyId = ref.id

    const copyRef = await getDoc(doc(db, 'test', "1234"))

    await new Promise((r)=>setTimeout(r, 3000))

    expect(copyRef).toBeCloseTo(testDoc)
    
})