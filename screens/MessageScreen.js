import { useRoute } from "@react-navigation/native";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TouchableWithoutFeedback, Text, TouchableOpacity, Image, Button, TextInput, KeyboardAvoidingView, Platform, Keyboard, FlatList} from "react-native";
import tw from "tailwind-rn";
import Header from "../components/Header";
import ReceiverMessage from "../components/ReceiverMessage";
import SenderMessage from "../components/SenderMessage";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import { auth, db } from "./firebase";



const MessageScreen = () => {
    const user = auth.currentUser;
    const {params} = useRoute();
    const [input, setInput] = useState("");

    const { matchDetails } = params;

    useEffect(
        () => 
        onSnapshot(query(collection(db, 'matches', matchDetails.id, 'messages'),
        orderBy('timestamp', 'desc')
        ), snapshot => setMessages(snapshot.docs.map(doc => ({
            id:doc.id,
            ...doc.data(),
        }))
        )
        ),
    [matchDetails, db]
    );

    const sendMessage = () => {
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            fullName: user.displayName,
            url: matchDetails.users[user.uid].url,
            message: input,
        });

        setInput("");
    };
    const [messages, setMessages] = useState([]);
     
    return (
        <SafeAreaView style={tw("flex-1")}>
            <Header title={getMatchedUserInfo(matchDetails?.users, user.uid).fullName}
            callEnabled />
            
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw("flex-1")}
                keyboardVerticalOffset={10}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <FlatList
                        data={messages}
                        inverted={-1}
                        style={tw("pl-4")}
                        keyExtractor={item => item.id}
                        renderItem={({ item: message }) => 
                        message.userId === user.uid ? (
                            <SenderMessage key={message.id} message={message} />
                        ) : (
                            <ReceiverMessage key={message.id} message={message} />
                        )
                    }
                        />
                    </TouchableWithoutFeedback>
                    
            <View
            style={tw(
                "flex-row justify-between bg-white items-center border-gray-200 px-5 py-2"
            )}>
                <TextInput
                style={tw("h-10 text-lg")}
                placeholder="Send Message..."
                onChangeText={setInput}
                onSubmitEditing={sendMessage}
                value={input}
                />
                <Button onPress={sendMessage} title="Send" color='#FF5864' />
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default MessageScreen;