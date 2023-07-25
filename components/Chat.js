import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {

    const { name, color, userID } = route.params;
    const [messages, setMessages] = useState([]);

    const onSend = async (newMessages) => {
        await addDoc(collection(db, 'messages'), newMessages[0]);
    };

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

    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} userID={userID} {...props} />
    };

    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#000',
                },
                left: {
                    backgroundColor: '#000'
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
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                onSend={messages => onSend(messages)}
                user={{
                    name: name,
                    _id: userID
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