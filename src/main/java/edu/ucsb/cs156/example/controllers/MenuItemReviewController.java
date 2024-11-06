package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.hibernate.engine.internal.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import java.time.LocalDateTime;
import edu.ucsb.cs156.example.entities.MenuItemReview;

/**
 * This is a REST controller for MenuItemReview
 */

@Tag(name = "MenuItemReview")
@RequestMapping("/api/menuitemreview")
@RestController
@Slf4j
public class MenuItemReviewController extends ApiController {
    
    @Autowired
    MenuItemReviewRepository menuItemReviewRepository;

    /**
     * List all MenuItemReviews
     * 
     * @return an iterable of MenuItemReviews
     */
    @Operation(summary= "List all menu item reviews")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<MenuItemReview> allMenuItemReviews() {
        Iterable<MenuItemReview> review = menuItemReviewRepository.findAll();
        return review;
    }

    /**
     * Get a single menuitemreview by id
     * 
     * @param id the id of the menuitemreview
     * @return a menuitemreview
     */
    @Operation(summary= "Get a single menuitemreview")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public MenuItemReview getById(
            @Parameter(name="id") @RequestParam Long id) {
        MenuItemReview menuItemReview = menuItemReviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));

        return menuItemReview;
    }

    /**
     * Create a new menu item review
     * 
     * @param itemId        id of the menu item
     * @param reviewerEmail email of the reviewer
     * @param stars         the number of stars the item received
     * @param dateReviewed    the date the review was made
     * @param comments      comments of the review
     * @return the saved menu item review
     */
    @Operation(summary= "Create a new menu item review")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public MenuItemReview postMenuItemReview(
            @Parameter(name="itemId") @RequestParam long itemId,
            @Parameter(name="reviewerEmail") @RequestParam String reviewerEmail,
            @Parameter(name="stars") @RequestParam int stars,
            @Parameter(name="comments") @RequestParam String comments,
            @Parameter(name="dateReviewed", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("dateReviewed") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateReviewed)
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        log.info("dateReviewed={}", dateReviewed);

        MenuItemReview menuItemReview = new MenuItemReview();
        menuItemReview.setItemId(itemId);
        menuItemReview.setReviewerEmail(reviewerEmail);
        menuItemReview.setStars(stars);
        menuItemReview.setDateReviewed(dateReviewed);
        menuItemReview.setComments(comments);

        MenuItemReview savedMenuItemReview = menuItemReviewRepository.save(menuItemReview);

        return savedMenuItemReview;
    }

    /**
     * Delete a menuitemreview
     * 
     * @param id the id of the menuitemreview to delete
     * @return a message indicating the menuitemreview was deleted
     */
    @Operation(summary= "Delete a menuitemreview")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteMenuItemReview(
            @Parameter(name="id") @RequestParam Long id) {
                MenuItemReview menuItemReview = menuItemReviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));
        menuItemReviewRepository.delete(menuItemReview);
        return genericMessage("menuitemreview with id %s deleted".formatted(id));
    }


    /**
     * Update a menu item review
     * 
     * @param id       id of the menuitemreview to update
     * @param incoming the new menuitemreview
     * @return the updated menuitemreview object
     */
    @Operation(summary= "Update a single menuitemreview")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public MenuItemReview updateMenuItemReview(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid MenuItemReview incoming) {

        MenuItemReview menuItemReview = menuItemReviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));

                menuItemReview.setItemId(incoming.getItemId());
                menuItemReview.setReviewerEmail(incoming.getReviewerEmail());
                menuItemReview.setStars(incoming.getStars());
                menuItemReview.setDateReviewed(incoming.getDateReviewed());
                menuItemReview.setComments(incoming.getComments());

        menuItemReviewRepository.save(menuItemReview);

        return menuItemReview;
    }
}