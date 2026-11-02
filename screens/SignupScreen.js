import AuthContent from "../components/auth/AuthContent";

function SignupScreen() {
  async function signupHandler() {
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
