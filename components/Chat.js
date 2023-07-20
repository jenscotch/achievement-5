import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const Chat = ({ route, navigation, db }) => {

    const { name, color, userID } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        navigation.setOptions({ title: name, color: color });
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
        const unsubChat = onSnapshot(q, (docs) => {    
            let newMessages = [];
            docs.forEach((doc) => {
                newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()) });
            });
            setMessages(newMessages);
        });
        return () => {
            if (unsubChat) unsubChat();
        }
    }, []);

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
                onSend={messages => onSend(messages)}
                user={{
                    name
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