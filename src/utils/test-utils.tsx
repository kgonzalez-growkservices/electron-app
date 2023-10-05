import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  });
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
