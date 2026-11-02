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

test(`Logs out on press on Logout icon`, async () => {
  const result = {
    status: 200,
    data: {
      accessToken: "some token",
      refreshToken: "some refresh token",
    },
  };
  const login = "Merlin";
  const password = "1234567";
  jest.useFakeTimers();
  axios.post.mockResolvedValueOnce(result);
  axios.delete.mockResolvedValueOnce({ status: 204 });

  axios.get.mockImplementationOnce(() => ({
    status: 200,
    data: [
      {
        id: 1,
        title: "Mountain Adventure",
        description: "An exhilarating trek through the Rocky Mountains",
        author: "Smith",
      },
    ],
  }));
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

  const logoutButton = screen.getByText("exit");
  await act(async () => {
    user.press(logoutButton);
    jest.advanceTimersByTime(50);
  });

  expect(axios.delete.mock.calls[0][0]).toMatch(/logout$/);
  expect(axios.delete.mock.calls[0][1]).toEqual({
    token: result.data.refreshToken,
  });
  expect(store.getState().auth.login).toBeNull();
  expect(store.getState().auth.token).toBeNull();
  expect(store.getState().auth.refreshToken).toBeNull();
  expect(screen.getByText("Login")).toBeOnTheScreen();
});
