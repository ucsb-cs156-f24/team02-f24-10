package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
    @Autowired
    HelpRequestRepository helpRequestRepository;

    @Test
    public void admin_user_can_edit_delete_request() throws Exception {
        

        LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

        HelpRequest helpRequest = HelpRequest.builder()
                        .id(1)
                        .requesterEmail("foo@bar.com")
                        .teamId("10-f24")
                        .tableOrBreakoutRoom("br10")
                        .requestTime(ldt)
                        .explanation("testing")
                        .solved(false)
                        .build();

        helpRequestRepository.save(helpRequest);

        setupUser(true);

        page.getByText("Help Requests").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
.hasText("foo@bar.com");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit HelpRequest")).isVisible();
        page.getByLabel("Solved").fill("true");
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-solved")).hasText("true");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_request() throws Exception {
        setupUser(false);

        page.getByText("Help Request").click();

        assertThat(page.getByText("Create HelpRequest")).not().isVisible();
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }
}
