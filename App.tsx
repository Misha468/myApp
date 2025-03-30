import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator<RootStackParamList>();
import { RootStackParamList } from "./src/types/navigation";
import SplashScreen from "./src/screens/SplashScreen";
import AuthScreen from "./src/screens/AuthScreen";
import MainScreen from "./src/screens/MainScreen";
import ScheduleScreen from "./src/screens/ScheduleScreen";
import { UserProvider } from "./UserContext";
import ProfileScreen from "./src/screens/ProfileScreen";
import ChatListScreen from "./src/screens/ChatsScreen";
import ChatScreen from "./src/screens/ChatViewerScreen";
export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Home" component={MainScreen} />
          <Stack.Screen name="Schedule" component={ScheduleScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Chats" component={ChatListScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
