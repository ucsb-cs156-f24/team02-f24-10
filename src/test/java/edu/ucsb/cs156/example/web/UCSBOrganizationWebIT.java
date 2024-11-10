package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_restaurant() throws Exception {
        setupUser(true);

        // Create - Act
        page.getByText("UCSB Organizations").click();

        page.getByText("Create UCSB Organization").click();
        assertThat(page.getByText("Create New UCSB Organization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-orgCode").fill("BAA");
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("Sheep Club");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("Sheep Club of UCSB");
        page.getByTestId("UCSBOrganizationForm-inactive").selectOption("True");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        // Create - Assert
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode"))
            .hasText("BAA");
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort"))
            .hasText("Sheep Club");
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslation"))
            .hasText("Sheep Club of UCSB");
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-inactive"))
            .hasText("true");

        // Edit - Act
        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Edit").click();
        assertThat(page.getByText("Edit UCSB Organization")).isVisible();
        // it would be nice to be able to test that the orgCode field is not editable
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("Sheep Club 2");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("Second Sheep Club of UCSB");
        page.getByTestId("UCSBOrganizationForm-inactive").selectOption("False");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        // Edit - Assert
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort"))
            .hasText("Sheep Club 2");
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslation"))
            .hasText("Second Sheep Club of UCSB");
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-inactive"))
            .hasText("false");

        // Delete - Act
        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Delete").click();

        // Delete - Assert
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }
}