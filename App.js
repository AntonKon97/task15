import { useState } from "react";
import { Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import { authActions } from "./store/authSlice";
import { Colors } from "./utils/styles";
import { logout as logoutUser } from "./utils/authDataService";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import IconButton from "./components/ui/IconButton";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function EnteredStack({ login, onLogout }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          title: `Welcome to posts, ${login}!`,
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={onLogout}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function InnerNavigation() {
  const dispatch = useDispatch();
  const { login, token, refreshToken } = useSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logoutHandler() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logoutUser(refreshToken);
    } catch (error) {
      Alert.alert(
        "Logout",
        "Could not complete logout on the server. Your local session will be cleared.",
      );
    } finally {
      dispatch(authActions.logout());
      setIsLoggingOut(false);
    }
  }

  const isAuthenticated = Boolean(token);

  return isAuthenticated ? (
    <EnteredStack login={login} onLogout={logoutHandler} />
  ) : (
    <AuthStack />
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <NavigationContainer>
        <InnerNavigation />
      </NavigationContainer>
    </Provider>
  );
}
