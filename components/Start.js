import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

const colorThemes = {
    one: '#090C08',
    two: '#474056',
    three: '#8A95A5',
    four: '#B9C6AE',
};


const Start = ({ navigation }) => {
    const auth = getAuth();
    const [name, setName] = useState('');
    const [color, setColor] = useState(colorThemes.four);

    const signInUser = () => {
        signInAnonymously(auth)
        .then(result => {
            navigation.navigate('Chat', {userID: result.user.uid});
            Alert.alert('Signed in successfully');
        })
        .catch((error) => {
            Alert.alert('Unable to sign in, try again later.');
        });
    };


    return (
        <View style={styles.container}>
            <ImageBackground 
                source={require('../assets/Background-Image.png')} 
                resizeMode='cover' 
                style={styles.image}>
            <Text style={styles.header}>App Title</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder='Your Name'
                />
                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#757083', alignSelf: 'center'}}>Choose Background Color: </Text>
            <View style={styles.themeSelection}>
                <TouchableOpacity 
                    style={[
                        styles.circle,
                        color === colorThemes.one && styles.selectedCircle,
                        {backgroundColor: colorThemes.one}
                    ]}
                    onPress={() => setColor(colorThemes.one)} />
                <TouchableOpacity 
                    style={[
                        styles.circle,
                        color === colorThemes.two && styles.selectedCircle,
                        {backgroundColor: colorThemes.two}
                    ]}
                    onPress={() => setColor(colorThemes.two)} />
                <TouchableOpacity 
                    style={[
                        styles.circle,
                        color === colorThemes.three && styles.selectedCircle,
                        {backgroundColor: colorThemes.three}
                    ]}
                    onPress={() => setColor(colorThemes.three)} />
                <TouchableOpacity 
                    style={[
                        styles.circle,
                        color === colorThemes.four && styles.selectedCircle,
                        {backgroundColor: colorThemes.four}
                    ]}
                    onPress={() => setColor(colorThemes.four)} />
            </View>
                <Button 
                    style={styles.button}
                    title="Start Chatting"
                    color="#757083"
                    onPress={() => navigation.navigate('Chat', {name: name, color: color, signInUser})}
                />
            </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        flex: 2,
        fontSize: 45, 
        fontWeight: 600, 
        padding: 60,
        color: '#fff',
        alignSelf: 'center',
    },
    inputContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 20,
        marginBottom: 30,
        marginLeft: 20,
        marginRight: 20,
        padding: '5%',
        flexBasis: 160,
    },
    textInput: {
        width: '92%',
        fontSize: 16,
        alignSelf: 'center',
        fontWeight: 'bold',
        textDecorationColor: '#757083',
        opacity: 50,
        padding: 15,
        borderWidth: 2,
        borderColor: '#757083',
        marginTop: 5,
        marginBottom: 28,
    },
    themeSelection: {
        flex: 1,
        justifyContent: 'space-around',
        flexDirection: 'row',

    },
    circle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    selectedCircle: {
        borderWidth: 2,
        borderColor: '#000',

    },
    button: {
        width: '88%',
        alignContent: 'center',
        fontSize: 16,
        fontWeight: 600,
        padding: 10,
    },
});

export default Start;
