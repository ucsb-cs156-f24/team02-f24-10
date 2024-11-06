const recommendationRequestFixtures = {
    oneRecommendationRequest: {
      id: 1,
      requesterEmail: "requesterEmail@ucsb.edu",
      professorEmail: "professorEmail@ucsb.edu",
      explanation: "some explanation",
      dateRequested: "2022-01-02T12:00:00",
      dateNeeded: "2022-01-02T12:30:00",
      done: false,
    },
    threeRecommendationRequests: [
      {
        id: 1,
        requesterEmail: "requesterEmail1@ucsb.edu",
        professorEmail: "professorEmail1@ucsb.edu",
        explanation: "some explanation",
        dateRequested: "2022-01-02T12:00:00",
        dateNeeded: "2022-01-02T12:30:00",
        done: true,
        },
      {
        id: 2,
        requesterEmail: "requesterEmail2@ucsb.edu",
        professorEmail: "professorEmail2@ucsb.edu",
        explanation: "some other explanation",
        dateRequested: "2022-01-02T12:30:00",
        dateNeeded: "2022-01-02T01:00:00",
        done: false,
        },
      {
        id: 3,
        requesterEmail: "requesterEmail3@ucsb.edu",
        professorEmail: "professorEmail3@ucsb.edu",
        explanation: "another explanation",
        dateRequested: "2022-01-02T01:00:00",
        dateNeeded: "2022-01-02T01:30:00",
        done: false,
        },
    ],
  };
  
  export { ucsbDatesFixtures };
  