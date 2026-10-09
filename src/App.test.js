import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("socket.io-client", () => () => ({
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
}));

beforeAll(() => {
  // jsdom doesn't implement media playback.
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
});

test("renders the login screen", () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter room id/i)).toBeInTheDocument();
});
