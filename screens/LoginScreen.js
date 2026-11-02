import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import AuthContent from "../components/auth/AuthContent";
import { login as loginUser } from "../utils/authDataService";
import { authActions } from "../store/authSlice";

function LoginScreen() {
  const dispatch = useDispatch();

  async function loginHandler({ login, password }) {
    try {
      const response = await loginUser(login, password);

      dispatch(
        authActions.authenticate({
          login,
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ??
        "Something went wrong. Please try again.";

      Alert.alert("Login failed", message);
    }
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
