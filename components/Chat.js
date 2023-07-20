import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, navigation, db, isConnected }) => {

    const { name, color, userID } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        navigation.setOptions({ title: name, color: color });
    }, []);

    useEffect(() => {
        let unsubChat;
        if (isConnected === true) {
            if (unsubChat) unsubChat();
            unsubChat = null;

            const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
            unsubChat = onSnapshot(q, (docs) => {    
                let newMessages = [];
                docs.forEach((doc) => {
                    newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()) })
                });
                cacheMessages(newMessages);
                setMessages(newMessages);
            });
        } else loadCachedMessages();

        return () => {
            if (unsubChat) unsubChat();
        }
    }, [isConnected]);

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error);
        }
    };

    const loadCachedMessages = async () => {
        const cachedMessages = await (AsyncStorage.getItem('messages')) || [];
            setMessages(JSON.parse(cachedMessages));
    };

    const renderInputToolbar = (props) => {
        if (isConnected) {
            return (<InputToolbar {...props} />);
        } else {
            return null;
        }
    };

    const onSend = async (newMessages) => {
        await addDoc(collection(db, 'messages'), newMessages[0])
    };

    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#000'
                },
                left: {
                    backgroundColor: '#fff'
                }
            }}
        />
    }

    return (
        <View style={[styles.container, {backgroundColor: color}]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={messages => onSend(messages)}
                user={{
                    name,
                }}
            />
            { Platform.OS === 'android' ? 
            <KeyboardAvoidingView behavior='height' /> : null }
            { Platform.OS === 'ios' ? 
            <KeyboardAvoidingView behavior='padding' /> : null }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;