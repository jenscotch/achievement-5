import Start from './components/Start.js';
import Chat from './components/Chat.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
