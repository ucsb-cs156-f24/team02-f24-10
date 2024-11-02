import React from "react";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable",
  component: UCSBDiningCommonsMenuItemTable,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  dates: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  items: ucsbDiningCommonsMenuItemFixtures.threeItems,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  items: ucsbDiningCommonsMenuItemFixtures.threeItems,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsbdiningcommonsmenuitems", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
