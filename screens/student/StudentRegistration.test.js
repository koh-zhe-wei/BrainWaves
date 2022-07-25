//const handleSignUp = require('./handleSignUp')
import { auth, db, storage } from '../firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";

const handleSignUp =  () => {
    createUserWithEmailAndPassword(auth,email,password)
    .then(userCredentials => { 
      const user = userCredentials.user
      console.log('Registered with:', user.email)
      createUserDocument(user,additionalData)
    })
    .then(() => { 
      navigation.navigate("Home")
    })
    .catch((error) => {
      if (error.code == "auth/email-already-in-use") {
          alert("The email address is already in use");
      } else if (error.code == "auth/invalid-email") {
          alert("The email address is not valid.");
      } else if (error.code == "auth/operation-not-allowed") {
          alert("Operation not allowed.");
      } else if (error.code == "auth/weak-password") {
          alert("The password is too weak.");
      }
    })
    
}

test('handlesignup - email undefined', () => {
    const email = ""
    const password = "aaaaaa"
    expect(handleSignUp).toThrowError("email is not defined") 

})

