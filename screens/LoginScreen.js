import AuthContent from "../components/auth/AuthContent";

function LoginScreen() {
  async function loginHandler() {
  }

  return <AuthContent isLogin={true} onAuthenticate={loginHandler} />;
}

export default LoginScreen;
