const helpRequestsFixtures = {
  oneReq: {
    id: 1,
    requesterEmail: "foo@bar",
    teamId: "foofoo",
    tableOrBreakoutRoom: "foo2",
    requestTime: "2020-12-25T00:00:00",
    explanation: "ground control to major tom",
    solved: true,
  },
  threeReqs: [
    {
      id: 1,
      requesterEmail: "foo@bar",
      teamId: "foofoo",
      tableOrBreakoutRoom: "foo2",
      requestTime: "2020-12-25T00:00:00",
      explanation: "ground control to major tom",
      solved: true,
    },
    {
      id: 2,
      requesterEmail: "bar@foo.com",
      teamId: "barbar",
      tableOrBreakoutRoom: "bar3",
      requestTime: "2020-12-25T00:00:00",
      explanation: "major tom to ground control",
      solved: false,
    },
    {
      id: 3,
      requesterEmail: "foofoo@bar.com",
      teamId: "barbar",
      tableOrBreakoutRoom: "foo5",
      requestTime: "1990-05-15T05:00:00",
      explanation: "time-travel issues",
      solved: false,
    },
  ],
};
export { helpRequestsFixtures };
