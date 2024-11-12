import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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

describe("RecommendationRequestEditPage tests", () => {
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
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Recommendation Request");
      expect(
        screen.queryByTestId("RecommendationRequestForm-explanation"),
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
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requesterEmail: "requester17email@ucsb.edu",
          professorEmail: "professor17email@ucsb.edu",
          explanation: "explanation17",
          dateRequested: "2022-03-14T17:00",
          dateNeeded: "2022-03-14T17:30",
          done: "false",
        });
      axiosMock.onPut("/api/recommendationrequests").reply(200, {
        id: 17,
        requesterEmail: "newrequester17email@ucsb.edu",
        professorEmail: "newprofessor17email@ucsb.edu",
        explanation: "newexplanation17",
        dateRequested: "2022-03-14T17:30",
        dateNeeded: "2022-03-14T18:00",
        done: "true",
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "RecommendationRequestForm-requesterEmail",
      );
      const professorEmailField = screen.getByTestId(
        "RecommendationRequestForm-professorEmail",
      );
      const explanationField = screen.getByTestId(
        "RecommendationRequestForm-explanation",
      );
      const dateRequestedField = screen.getByTestId(
        "RecommendationRequestForm-dateRequested",
      );
      const dateNeededField = screen.getByTestId(
        "RecommendationRequestForm-dateNeeded",
      );
      const doneField = screen.getByTestId("RecommendationRequestForm-done");

      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("requester17email@ucsb.edu");

      expect(professorEmailField).toBeInTheDocument();
      expect(professorEmailField).toHaveValue("professor17email@ucsb.edu");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("explanation17");

      expect(dateRequestedField).toBeInTheDocument();
      expect(dateRequestedField).toHaveValue("2022-03-14T17:00");

      expect(dateNeededField).toBeInTheDocument();
      expect(dateNeededField).toHaveValue("2022-03-14T17:30");

      expect(doneField).toBeInTheDocument();
      expect(doneField).toHaveValue("false");

      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Update");
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "RecommendationRequestForm-requesterEmail",
      );
      const professorEmailField = screen.getByTestId(
        "RecommendationRequestForm-professorEmail",
      );
      const explanationField = screen.getByTestId(
        "RecommendationRequestForm-explanation",
      );
      const dateRequestedField = screen.getByTestId(
        "RecommendationRequestForm-dateRequested",
      );
      const dateNeededField = screen.getByTestId(
        "RecommendationRequestForm-dateNeeded",
      );
      const doneField = screen.getByTestId("RecommendationRequestForm-done");

      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("requester17email@ucsb.edu");

      expect(professorEmailField).toBeInTheDocument();
      expect(professorEmailField).toHaveValue("professor17email@ucsb.edu");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("explanation17");

      expect(dateRequestedField).toBeInTheDocument();
      expect(dateRequestedField).toHaveValue("2022-03-14T17:00");

      expect(dateNeededField).toBeInTheDocument();
      expect(dateNeededField).toHaveValue("2022-03-14T17:30");

      expect(doneField).toBeInTheDocument();
      expect(doneField).toHaveValue("false");

      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "newrequesteremail@ucsb.edu" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "newprofemail@ucsb.edu" },
      });
      fireEvent.change(explanationField, {
        target: { value: "new explanation" },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2022-12-25T08:00" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2022-12-25T08:30" },
      });
      fireEvent.change(doneField, { target: { value: "true" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Recommendation Request Updated - id: 17 Requester email: newrequester17email@ucsb.edu Professor email: newprofessor17email@ucsb.edu",
      );
      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequest",
      });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "newrequesteremail@ucsb.edu",
          professorEmail: "newprofemail@ucsb.edu",
          explanation: "new explanation",
          dateRequested: "2022-12-25T08:00",
          dateNeeded: "2022-12-25T08:30",
          done: "true",
        }),
      ); // posted object
    });
  });
});
