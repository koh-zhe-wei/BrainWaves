import { auth, db, storage } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


const handleLogin = () => {
    signInWithEmailAndPassword(auth,email,password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log('Logged in with:', user.email);
    })
    .catch(error => alert(error.message))
}


test('handlelogin - email undefined', () => {
    const email = ""
    const password = "aaaaaa"
    expect(handleLogin).toThrowError("email is not defined") 

})











