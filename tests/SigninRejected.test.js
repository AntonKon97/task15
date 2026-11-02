import { render, screen, userEvent, act } from "@testing-library/react-native";
import { Provider } from "react-redux";
import store from "../store";
import axios from "axios";

import App from "../App";

jest.mock("axios");
jest.mock("../components/ui/IconButton", () => {
  const { Text, Pressable } = require("react-native");
  return ({ icon, onPress }) => (
    <Pressable onPress={onPress}>
      <Text>{icon}</Text>
    </Pressable>
  );
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
  jest.resetAllMocks();
});

test(`Stays on Singin screen and posts are not fetched when signing in is unsuccessful`, async () => {
  const result = {
    status: 404,
    data: {
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    },
  };
  const login = "Bert";
  const password = "1234567";
  jest.useFakeTimers();
  axios.post
    .mockResolvedValueOnce({ status: 200 })
    .mockResolvedValueOnce(result);

  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const input = screen.getByTestId("Login");
  await act(async () => {
    await user.type(input, login);
    jest.advanceTimersByTime(50);
  });

  const passwordInput = screen.getByTestId("Password");
  await act(async () => {
    await user.type(passwordInput, password);
    jest.advanceTimersByTime(50);
  });

  const signinButton = screen.getByText("Log In");
  await act(async () => {
    user.press(signinButton);
    jest.advanceTimersByTime(50);
  });

  expect(axios.post.mock.calls[0][0]).toMatch(/login$/);
  expect(axios.post.mock.calls[0][1]).toEqual({
    username: login,
    password: password,
  });
  await act(async () => {
    jest.advanceTimersByTime(50);
  });
  expect(store.getState().auth.login).toBeNull();
  expect(store.getState().auth.token).toBeNull();
  expect(store.getState().auth.refreshToken).toBeNull();
  await act(async () => {
    jest.advanceTimersByTime(50);
  });
  expect(axios.get).not.toHaveBeenCalled();
  expect(screen.getByText("Login")).toBeOnTheScreen();
});
