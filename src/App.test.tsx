import { render, screen } from "./utils/test-utils";
import App from "./App";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";

describe("Input", async () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("Greetings from Springboot"),
      })
    ) as Mock;
  });
  it("should render the input", async () => {
    render(<App />);
    screen.logTestingPlaygroundURL();
    expect(screen.getByTestId("vite-react-title")).toBeInTheDocument();
    expect(
      await screen.findByText("Greetings from Springboot")
    ).toBeInTheDocument();
  });
});

describe("a", () => {
  it("should change input value", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("A"),
      })
    ) as Mock;
    render(<App />);
    expect(screen.getByTestId("vite-react-title")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /vite \+ react/i,
      })
    ).toBeInTheDocument();
  });
});
