import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticlesEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(
        screen.queryByTestId("ArticlesForm-title"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id: 17,
        title: "lolol title",
        url: "https://www.google.com/",
        explanation: "This is an article",
        email: "ajayliu@ucsb.edu",
        dateAdded: "2024-02-02T00:00",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: 17,
        title: "lolol2 title",
        url: "https://www.google2.com/",
        explanation: "This is an article2",
        email: "ajayliu@ucsb.edu2",
        dateAdded: "2026-02-02T00:00",
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticlesForm-title");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticlesForm-title");

      const idField = screen.getByTestId("ArticlesForm-id");
      const titleField = screen.getByTestId("ArticlesForm-title");
      const urlField = screen.getByTestId("ArticlesForm-url");
      const explanationField = screen.getByTestId("ArticlesForm-explanation");
      const emailField = screen.getByTestId("ArticlesForm-email");
      const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
      const submitButton = screen.getByTestId("ArticlesForm-submit");

      expect(idField).toHaveValue("17");
      expect(titleField).toHaveValue("lolol title");
      expect(urlField).toHaveValue("https://www.google.com/");
      expect(explanationField).toHaveValue("This is an article");
      expect(emailField).toHaveValue("ajayliu@ucsb.edu");
      expect(dateAddedField).toHaveValue("2024-02-02T00:00");
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByTestId("ArticlesForm-title");

      const idField = screen.getByTestId("ArticlesForm-id");
      const titleField = screen.getByTestId("ArticlesForm-title");
      const urlField = screen.getByTestId("ArticlesForm-url");
      const explanationField = screen.getByTestId("ArticlesForm-explanation");
      const emailField = screen.getByTestId("ArticlesForm-email");
      const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
      const submitButton = screen.getByTestId("ArticlesForm-submit");

      expect(idField).toHaveValue("17");
      expect(titleField).toHaveValue("lolol title");
      expect(urlField).toHaveValue("https://www.google.com/");
      expect(explanationField).toHaveValue("This is an article");
      expect(emailField).toHaveValue("ajayliu@ucsb.edu");
      expect(dateAddedField).toHaveValue("2024-02-02T00:00");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(titleField, { target: { value: "lolol2 title" } });
      fireEvent.change(urlField, {
        target: { value: "https://www.google2.com/" },
      });
      fireEvent.change(explanationField, {
        target: { value: "This is an article2" },
      });
      fireEvent.change(emailField, { target: { value: "ajayliu@ucsb.edu2" } });
      fireEvent.change(dateAddedField, {
        target: { value: "2026-02-02T00:00" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Article Updated - id: 17 title: lolol2 title",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          id: 17,
          title: "lolol2 title",
          url: "https://www.google2.com/",
          explanation: "This is an article2",
          email: "ajayliu@ucsb.edu2",
          dateAdded: "2026-02-02T00:00",
        }),
      ); // posted object
    });
  });
});
