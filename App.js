import Start from './components/Start.js';
import Chat from './components/Chat.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { getStorage } from 'firebase/storage';

const Stack = createNativeStackNavigator();

const App = () => {

  const firebaseConfig = {

    apiKey: "AIzaSyBZlY3KoJRNkfoCjD9jwUu7HEmtS_eJLhc",
    authDomain: "chat-app-45734.firebaseapp.com",
    projectId: "chat-app-45734",
    storageBucket: "chat-app-45734.appspot.com",
    messagingSenderId: "1057893626740",
    appId: "1:1057893626740:web:ca0a044aa8f107b07bf221"
  
  };

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  const storage = getStorage(app);

  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection lost');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => 
          <Chat 
          isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
