import { auth } from './firebase'
import { useNavigation } from '@react-navigation/core'
import { signOut } from "firebase/auth";
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, Text, Image, Button, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import tw from 'tailwind-rn'
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { collection, doc, onSnapshot, setDoc, getDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db , storage} from './firebase';
import generateId from '../lib/generateId';

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
    const [neededSubject, setneededSubject] = useState('')

    const user = auth.currentUser; 
    const userUID = user.uid;
    const userfullName = user.fullName;
    const userSubj = user.neededSubject;
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
            const passes = await getDocs(collection(db, 'tutor', user.uid, 'passes')).then(
                (snapshot) => snapshot.docs.map((doc) => doc.id)
                );

            const swipes = await getDocs(collection(db, 'tutor', user.uid, 'swipes')).then(
                    (snapshot) => snapshot.docs.map((doc) => doc.id)
                    );

            const passedStudentIds = passes.length > 0 ? passes : ['empty'];
            const swipedStudentIds = swipes.length > 0 ? swipes : ['empty'];

            unsub = onSnapshot(
                query(
                    collection(db, "student"),
                    where('id', 'not-in', [...passedStudentIds, ...swipedStudentIds])),
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
    
    //console.log(profiles); 
    
    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        console.log(`You swiped PASS on ${userSwiped.fullName}`);

        setDoc(doc(db, 'tutor', user.uid, 'passes', userSwiped.id),
            userSwiped);
    };

    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        const loggedInProfile = await (
            await getDoc(doc(db, 'tutor', user.uid))
        ).data();

        //Check if the user swiped on you...
        getDoc(doc(db, 'student', userSwiped.id, "swipes", user.uid)).then(
            (documentSnapshot) => {
                if (documentSnapshot.exists()) {
                    //user has matched
                    //Create a MATCH
                    console.log(`Hooray, You MATCHED with ${userSwiped.fullName}`);

                    setDoc(doc(db, 'tutor', user.uid, 'swipes', userSwiped.id),
            userSwiped);

            //CREATE A MATCH!!!
            setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
                users: {
                    [user.uid]: loggedInProfile,
                    [userSwiped.id]: userSwiped 
                },
                usersMatched: [user.uid, userSwiped.id],
                timestamp: serverTimestamp(),
            });

            navigation.navigate("Match", {
                loggedInProfile,
                userSwiped,
            });
                } else {
                    console.log(
                    `You swiped on ${userSwiped.fullName} (${userSwiped.job})`
                );
                
        setDoc(doc(db, 'tutor', user.uid, 'swipes', userSwiped.id),
            userSwiped);
                }
            }
        )
    };

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
                style={styles.avatarPlaceholder}
                resizeMode="contain"
                source={{ uri: url }}
            />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                <Ionicons name='chatbox' size={30}
            />
                </TouchableOpacity>
                
                    
            </View>

            <Text style ={styles.titleText}> {fullName}</Text>
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
                                    <Text>Needs help in: {card.neededSubject}</Text>
                                </View>
                                <Text style={tw("text-2xl font-bold")}>{card.birthday}</Text>
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    baseText: {
      fontFamily: "Cochin"
    },
    titleText: {
      fontSize: 20,
      fontWeight: "bold",
      alignItems: 'center',
      justifyContent: "center",
      marginTop:5,
      marginLeft:180,
    },
    avatarPlaceholder: {
        backgroundColor: '#ffffff',
        width: 80,
        height: 80,
        borderRadius: 70, 
        alignItems: 'center',
        justifyContent: "center",
        
        
       },
  });

export default TutorHome;