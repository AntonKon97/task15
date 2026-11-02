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

test(`Refresh token is used to get a new token when access token expires`, async () => {
  const result = {
    status: 200,
    data: {
      accessToken: "some token",
      refreshToken: "some refresh token",
    },
  };
  const newResult = {
    status: 200,
    data: {
      accessToken: "new token",
      refreshToken: "some refresh token",
    },
  };
  const login = "Bert";
  const password = "1234567";
  jest.useFakeTimers();
  axios.post.mockResolvedValueOnce(result).mockResolvedValueOnce(newResult);

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
  axios.get
    .mockResolvedValueOnce(postsResponse)
    .mockRejectedValueOnce({ response: { status: 403 } })
    .mockResolvedValueOnce(postsResponse);
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

  await act(async () => {
    jest.advanceTimersByTime(200);
  });

  const postsFlatList = screen.getByTestId("Posts");
  expect(postsFlatList).toBeOnTheScreen();
  expect(axios.post.mock.calls).toHaveLength(1);
  await act(async () => {
    postsFlatList.props.onRefresh();
    jest.advanceTimersByTime(200);
  });

  expect(axios.post.mock.calls).toHaveLength(2);
  expect(axios.get.mock.calls).toHaveLength(3);
  expect(axios.get.mock.calls[2][0]).toMatch(/posts$/);
  expect(axios.get.mock.calls[2][1]).toEqual({
    headers: {
      Authorization: `Bearer ${newResult.data.accessToken}`,
    },
  });
  await act(async () => {
    jest.advanceTimersByTime(200);
  });
  expect(screen.getByText(postsResponse.data[0].title)).toBeOnTheScreen();
  expect(store.getState().auth.token).toEqual(newResult.data.accessToken);
});
