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

test(`Opens Welcome screen with posts through Sign Up form`, async () => {
  const result = {
    status: 200,
    data: {
      accessToken: "some token",
      refreshToken: "some refresh token",
    },
  };
  const login = "Bert";
  const password = "1234567";
  jest.useFakeTimers();
  axios.post
    .mockResolvedValueOnce({ status: 200 })
    .mockResolvedValueOnce(result);

  const postsResponse = {
    status: 200,
    data: [
      {
        id: 1,
        title: "Mountain Adventure",
        description: "An exhilarating trek through the Rocky Mountains",
        author: "Smith",
      },
    ],
  };
  axios.get.mockResolvedValueOnce(postsResponse);
  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const createNewUserButton = screen.getByText("Create a new user");
  await act(async () => {
    user.press(createNewUserButton);
    jest.advanceTimersByTime(50);
  });

  const input = screen.getByTestId("Login");
  await act(async () => {
    await user.type(input, login);
    jest.advanceTimersByTime(50);
  });

  const passwordInput = screen.getByTestId("Password");
  await act(async () => {
    await user.type(passwordInput, "1234567");
    jest.advanceTimersByTime(50);
  });

  const confirmPasswordInput = screen.getByTestId("Confirm Password");
  await act(async () => {
    await user.type(confirmPasswordInput, password);
    jest.advanceTimersByTime(50);
  });

  const signUpButton = screen.getByText("Sign Up");
  await act(async () => {
    user.press(signUpButton);
    jest.advanceTimersByTime(50);
  });

  expect(axios.post.mock.calls[0][0]).toMatch(/signup$/);
  expect(axios.post.mock.calls[0][1]).toEqual({
    username: login,
    password: password,
  });
  await act(async () => {
    jest.advanceTimersByTime(200);
  });
  expect(axios.post.mock.calls).toHaveLength(2);
  expect(axios.post.mock.calls[1][0]).toMatch(/login$/);
  expect(axios.post.mock.calls[1][1]).toEqual({
    username: login,
    password: password,
  });
  expect(store.getState().auth.login).toEqual(login);
  expect(store.getState().auth.token).toEqual(result.data.accessToken);
  expect(store.getState().auth.refreshToken).toEqual(result.data.refreshToken);
  await act(async () => {
    jest.advanceTimersByTime(50);
  });
  expect(axios.get.mock.calls).toHaveLength(1);
  expect(axios.get.mock.calls[0][0]).toMatch(/posts$/);
  expect(axios.get.mock.calls[0][1]).toEqual({
    headers: {
      Authorization: `Bearer ${result.data.accessToken}`,
    },
  });
  expect(screen.getByText(postsResponse.data[0].title)).toBeOnTheScreen();
});
