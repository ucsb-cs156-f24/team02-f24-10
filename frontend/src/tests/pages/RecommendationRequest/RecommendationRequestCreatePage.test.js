import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("RecommendationRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /recommendationrequests", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {
      id: 14,
      requesterEmail: "requesterEmail14@ucsb.edu",
      professorEmail: "professorEmail14@ucsb.edu",
      explanation: "some explanation-14",
      dateRequested: "2022-01-02T12:14:00",
      dateNeeded: "2022-01-02T12:44:00",
      done: true,
    };

    axiosMock
      .onPost("/api/recommendationrequests/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    const requesterEmailInput = screen.getByLabelText("Requester Email");
    expect(requesterEmailInput).toBeInTheDocument();

    const professorEmailInput = screen.getByLabelText("Professor Email");
    expect(professorEmailInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const dateRequestedInput = screen.getByLabelText("Date Requested (in UTC)");
    expect(dateRequestedInput).toBeInTheDocument();

    const dateNeededInput = screen.getByLabelText("Date Needed (in UTC)");
    expect(dateNeededInput).toBeInTheDocument();

    const doneInput = screen.getByLabelText("Done");
    expect(doneInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(requesterEmailInput, {
      target: { value: "requesterEmail14@ucsb.edu" },
    });
    fireEvent.change(professorEmailInput, {
      target: { value: "professorEmail14@ucsb.edu" },
    });
    fireEvent.change(explanationInput, {
      target: { value: "some explanation-14" },
    });
    fireEvent.change(dateRequestedInput, {
      target: { value: "2022-01-02T12:14:00" },
    });
    fireEvent.change(dateNeededInput, {
      target: { value: "2022-01-02T12:44:00" },
    });
    fireEvent.change(doneInput, { target: { value: true } });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "requesterEmail14@ucsb.edu",
      professorEmail: "professorEmail14@ucsb.edu",
      explanation: "some explanation-14",
      dateRequested: "2022-01-02T12:14",
      dateNeeded: "2022-01-02T12:44",
      done: "true",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New Recommendation Request Created - id: 14 requesterEmail: requesterEmail14@ucsb.edu professorEmail: professorEmail14@ucsb.edu",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
  });
});
