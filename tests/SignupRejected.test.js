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

test(`Does not open Welcome screen and does not make login request 
if registration was unsuccessfull`, async () => {
  const result = {
    status: 422,
    data: {
      errors: [
        {
          msg: "This user already exists",
        },
      ],
    },
  };
  const login = "Bert";
  const password = "1234567";
  jest.useFakeTimers();
  axios.post.mockResolvedValueOnce(result);

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
    jest.advanceTimersByTime(50);
  });
  expect(axios.post.mock.calls).toHaveLength(1);

  expect(store.getState().auth.login).toBeNull();
  expect(store.getState().auth.token).toBeNull();
  expect(store.getState().auth.refreshToken).toBeNull();
  expect(axios.get).not.toHaveBeenCalled();
  expect(screen.getByText("Confirm Password")).toBeOnTheScreen();
});
