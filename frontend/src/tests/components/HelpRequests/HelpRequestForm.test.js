import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";
import { helpRequestsFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByText(/RequesterEmail/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a HelpRequest", async () => {
    render(
      <Router>
        <HelpRequestForm initialContents={helpRequestsFixtures.oneReq} />
      </Router>,
    );
    await screen.findByTestId(/HelpRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue(
      helpRequestsFixtures.oneReq.id + "",
    );
    expect(screen.getByTestId(/HelpRequestForm-teamId/)).toHaveValue(
      helpRequestsFixtures.oneReq.teamId,
    );
    expect(
      screen.getByTestId(/HelpRequestForm-tableOrBreakoutRoom/),
    ).toHaveValue(helpRequestsFixtures.oneReq.tableOrBreakoutRoom);
    expect(screen.getByTestId(/HelpRequestForm-requestTime/)).toHaveValue(
      "2020-12-25T00:00",
    );
    expect(screen.getByTestId(/HelpRequestForm-explanation/)).toHaveValue(
      helpRequestsFixtures.oneReq.explanation,
    );
    expect(screen.getByTestId(/HelpRequestForm-solved/)).toHaveValue(
      helpRequestsFixtures.oneReq.solved + "",
    );
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-submit");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email is required./);
    expect(screen.getByText(/Team ID is required./)).toBeInTheDocument();
    expect(screen.getByText(/Solve status is required./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/Request Time is required./)).toBeInTheDocument();
    expect(
      screen.getByText(/TableOrBreakoutRoom is required./),
    ).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-teamId");

    const requesterEmailField = screen.getByTestId(
      /HelpRequestForm-requesterEmail/,
    );
    const teamIdField = screen.getByTestId(/HelpRequestForm-teamId/);
    const tableOrBreakoutRoomField = screen.getByTestId(
      /HelpRequestForm-tableOrBreakoutRoom/,
    );
    const requestTimeField = screen.getByTestId(/HelpRequestForm-requestTime/);
    const explanationField = screen.getByTestId(/HelpRequestForm-explanation/);
    const solvedField = screen.getByTestId(/HelpRequestForm-solved/);
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, {
      target: { value: "barfoo@foobar.net" },
    });
    fireEvent.change(teamIdField, { target: { value: "barfoo" } });
    fireEvent.change(tableOrBreakoutRoomField, { target: { value: "t3" } });
    fireEvent.change(requestTimeField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(explanationField, {
      target: { value: "javascript is melting my brain" },
    });
    fireEvent.change(solvedField, { target: { value: false } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Explanation is required./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-cancel");
    const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
