import { auth } from './firebase'
import { useNavigation } from '@react-navigation/core'
import { signOut } from "firebase/auth";
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, Text, Image, Button, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import tw from 'tailwind-rn'
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { collection, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db , storage} from './firebase';
import { setUrl, getDownloadURL, ref, uploadBytesResumable , withPath, forURL,getStorage} from 'firebase/storage';
import { setStatusBarStyle } from 'expo-status-bar';


const HomeScreen = () => {
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
    const userRef = doc(db,"tutor",userUID)

    useEffect(() => {
        async function fetchProfileData() {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            console.log("smmol");
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

    useLayoutEffect(() => {
        const unsub = onSnapshot(doc(db, "student", auth.currentUser.uid), (snapshot) => {
            console.log(snapshot);
            if (!snapshot.exists()) {
                navigation.navigate("Modal")
            }
        });

        return unsub();
    }, []);

    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        console.log(`You swiped PASS on ${userSwiped.fullName}`);

        setDoc(doc(db, 'student', auth.currentUser.uid, 'passes', userSwiped.id),
            userSwiped);
        setDoc(doc(db, 'tutor', userSwiped.id, 'passes', auth.currentUser.uid),
            userSwiped);
    };

    const swipeRight = async (cardIndex) => {

    };

    useEffect(() => {
        let unsub;

        const fetchCards = async () => {
            unsub = onSnapshot(collection(db, 'tutor'), (snapshot) => {
                setProfiles(
                    snapshot.docs.filter(doc => doc.id !== auth.currentUser.uid).map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            });
        };

        fetchCards();
        return unsub;
    }, [])
    
    console.log(profiles);
    

    


    

    return (
        <SafeAreaView>
            {/* Header */}
            <View style={tw("flex-row items-center justify-between px-5")}>
                <TouchableOpacity onPress={handleSignOut}>
                    <
                        Ionicons name='arrow-back-circle' size={30} color="#000000"
                    />
                </TouchableOpacity>
                

                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                <Image
                style={styles.avatar}
                resizeMode="contain"
                source={{ uri: url }}
            />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name='chatbubbles' size={30} color="#000000" />
                </TouchableOpacity>
                
                
                    
            </View>

            <Text>Email: {auth.currentUser?.email}</Text>
            <Text>Email: {userUID}</Text>
            <Text>Email: {gender}</Text>
            {/*End of Header */}

            {/* Cards */}
            <View style={tw("flex-1 -mt-1")}>
                <Swiper
                    containerStyle={{ backgroundColor: "transparent" }}
                    cards={profiles}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(cardIndex) => {
                        console.log('Swipe PASS');
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        console.log('Swipe MATCH');
                        swipeRight(cardIndex);
                    }}
                    backgroundColor={"#4FD0E9"}
                    overlayLabels={{
                        left: {
                            title: "NOPE",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red",
                                },
                            },
                        },
                        right: {
                            title: "MATCH",
                            style: {
                                label: {
                                    textAlign: "left",
                                    color: "green",
                                },
                            },
                        },
                    }}
                    
                    renderCard={(card) => card ? (
                        <View key={card.id} style={tw("bg-white h-3/4 rounded-xl")}>
                            
                            <Image
                                style={tw("absolute top-0 h-full w-full rounded-xl")}
                                source ={{ uri: card.url }}
                            />

                            <View style={[tw("absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl"
                            ),
                            styles.cardShadow,
                            ]}
                            >
                                <View>
                                    <Text style={tw("text-xl font-bold")}>
                                        {card.fullName}
                                    </Text>
                                    <Text>{card.type}</Text>
                                </View>
                                <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                            </View>
                        </View>
                    ) : (
                        <View
                            style={[
                                tw(
                                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
                                ),
                                styles.cardShadow,
                            ]}
                        >
                            <Text style={tw("font-bold pb-5")}>No more profiles</Text>

                            <Image
                                style={tw("h-20 w-full")}
                                height={100}
                                width={100}
                                source={{ uri: "https://links.papareact.com/6gb" }}
                            />
                        </View>
                    )}
                />
            </View>

            {/* Signout */}

            
        </SafeAreaView>
    );
};

export default HomeScreen

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    avatar: {
        
        width: 80,
        height: 80,
        borderRadius: 50, 
        
       },
       
});