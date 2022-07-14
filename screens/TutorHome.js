import { auth } from './firebase'
import { useNavigation } from '@react-navigation/core'
import { signOut } from "firebase/auth";
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, Text, Image, Button, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import tw from 'tailwind-rn'
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { collection, doc, onSnapshot, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db , storage} from './firebase';

const TutorHome = () => {
    const navigation = useNavigation();
    const [profiles, setProfiles] = useState([]);
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNum] = useState('')
    const [birthday, setBirthday] = useState('')
    const [gender, setGender] = useState('')
    const [race, setRace] = useState('')
    const [region, setRegion] = useState('')
    const [employment, setEmployment] = useState('')
    const [type, setType] = useState('')
    const [priceRange, setPriceRange] = useState('')
    const [availSchedule , setAvailSchedule] = useState('')
    const [image , setImage] = useState('')
    const [url , setURL] = useState('')

    const user = auth.currentUser; 
    const userUID = user.uid;
    const userfullName = user.fullName;
    const userRef = doc(db,"tutor",userUID)

    useEffect(() => {
        async function fetchProfileData() {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
          }
          try {
            console.log("try entered");
            const fN = docSnap.get("fullName");
            const pN = docSnap.get("phoneNumber");
            const bD = docSnap.get("birthday");
            const u = docSnap.get("url");
            const gen = docSnap.get("gender");
            const ra = docSnap.get("race");
            const reg = docSnap.get("region");
            const emp = docSnap.get("employment");
            const typ = docSnap.get("type");
            const price = docSnap.get("priceRange");
            const schedule = docSnap.get("availSchedule");
            const ig = docSnap.get("image");
            setFullName(fN);
            setPhoneNum(pN);
            setBirthday(bD);
            setURL(u);
            setGender(gen);
            setRace(ra);
            setRegion(reg);
            setEmployment(emp);
            setType(typ);
            setPriceRange(price);
            setAvailSchedule(schedule);
            setImage(ig);
            //console.log("docSnap.firstName: ", docSnap.get("fullName"));
            console.log("Full Name: ", fullName);
            /*
            console.log("Phone Number: ", phoneNumber);
            console.log("Birthday: ", birthday);
            console.log("URL: ", url);
            console.log("Gender: ", gender);
            console.log("Race: ", race);
            console.log("Region: ", region);
            console.log("Employment: ", employment);
            console.log("Type: ", type);
            console.log("Price Range: ", priceRange);
            console.log("Schedule: ", availSchedule);
            console.log("Image: ", image);
            */
            
          } catch (error) {
            console.log("Error in finding profile", error);
          }
        }
        fetchProfileData();
      }, []);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                navigation.replace("Role")
            })
            .catch(error => alert(error.message))
    }

    useEffect(() => {
        let unsub;

        const fetchCards = async () => {
            const swipes = await getDocs(collection(db, 'student', user.uid, 'swipes')).then(
                    (snapshot) => snapshot.docs.map((doc) => doc.id)
                    );

            const swipedStudentIds = swipes.length > 0 ? swipes : ['empty'];

            console.log(swipedStudentIds)

            unsub = onSnapshot(
                query(
                    collection(db, "student"),
                    where('id', 'in', [...swipedStudentIds])),
                    (snapshot) => {
                setProfiles(
                    snapshot.docs
                    .filter((doc) => doc.id !== user.uid)
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            }
            );
        };

        fetchCards();
        return unsub;
    }, []);

    return (
        <SafeAreaView>
            {/* Header */}
            <View style={tw("flex-row items-center justify-between px-5")}>
                <TouchableOpacity onPress={handleSignOut}>
                    <
                        Ionicons name='arrow-back-circle' size={30} color="#000000"
                    />
                </TouchableOpacity>

                <Text> Available Assignments </Text>
                
                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                <Image
                style={tw("h-10 w-10 rounded-full")}
                resizeMode="contain"
                source={{ uri: url }}
            />
                </TouchableOpacity>
                
                    
            </View>

            <Text style ={styles.titleText}> User: {fullName}</Text>
            {/*End of Header */}

            <Text> I am the Tutor Home Page </Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    baseText: {
      fontFamily: "Cochin"
    },
    titleText: {
      fontSize: 20,
      fontWeight: "bold"
    }
  });

export default TutorHome;