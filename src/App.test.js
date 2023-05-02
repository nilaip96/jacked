import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders black jack", () => {
  render(<App />);
  const linkElement = screen.getByText(/black jack/i);
  expect(linkElement).toBeInTheDocument();
});
