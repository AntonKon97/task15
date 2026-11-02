import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import AuthContent from "../components/auth/AuthContent";
import { createUser, login as loginUser } from "../utils/authDataService";
import { authActions } from "../store/authSlice";

function SignupScreen() {
  const dispatch = useDispatch();

  async function signupHandler({ login, password }) {
    try {
      await createUser(login, password);

      const response = await loginUser(login, password);

      dispatch(
        authActions.authenticate({
          login,
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        }),
      );
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ??
        "Something went wrong. Please try again.";

      Alert.alert("Signup failed", message);
    }
  }

  return <AuthContent isLogin={false} onAuthenticate={signupHandler} />;
}

export default SignupScreen;
