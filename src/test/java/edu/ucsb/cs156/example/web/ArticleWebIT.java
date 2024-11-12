package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.options.WaitForSelectorState;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class ArticleWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_article() throws Exception {
    setupUser(true);

    page.getByText("Articles").click();

    page.getByText("Create Article").click();
    assertThat(page.getByText("Create New Article")).isVisible();
    page.getByTestId("ArticlesForm-title").fill("Article Title");
    page.getByTestId("ArticlesForm-explanation").fill("Article Explanation");
    page.getByTestId("ArticlesForm-url").fill("https://www.example.com");
    page.getByTestId("ArticlesForm-email").fill("ajay@gmail.com");
    // page.getByTestId("ArticlesForm-dateAdded").fill("2021-05-01");
    // page.evaluate("document.querySelector('[data-testid=\"ArticlesForm-dateAdded\"]').value
    // = '2021-05-01T00:00'");
    Locator dateInput = page.locator("[data-testid=\"ArticlesForm-dateAdded\"]");
    dateInput.waitFor(new Locator.WaitForOptions().setState(WaitForSelectorState.VISIBLE));
    dateInput.fill("2021-05-01T00:00");

    page.evaluate("document.querySelector('[data-testid=\"ArticlesForm-dateAdded\"]').value = '2021-05-01T00:00:00'");
    page.getByTestId("ArticlesForm-submit").click();

    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-explanation"))
        .hasText("Article Explanation");

    page.getByTestId("ArticlesTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit Article")).isVisible();
    page.getByTestId("ArticlesForm-explanation").fill("Changed Explanation");
    page.getByTestId("ArticlesForm-submit").click();

    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-explanation")).hasText("Changed Explanation");

    page.getByTestId("ArticlesTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
  }
}