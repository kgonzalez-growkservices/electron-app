import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

function ComponentX() {
  return <div>Hello Vitest</div>;
}

describe("Set of tests for ComponentX", () => {
  test("renders the Hello Vitest div", () => {
    render(<ComponentX />);
    expect(screen.getByText(/Hello Vitest/i)).toBeInTheDocument();
  });
});
