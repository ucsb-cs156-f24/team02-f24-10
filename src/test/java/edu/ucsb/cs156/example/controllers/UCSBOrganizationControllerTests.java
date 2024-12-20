package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = UCSBOrganizationController.class)
@Import(TestConfig.class)
public class UCSBOrganizationControllerTests extends ControllerTestCase {
    @MockBean
    UCSBOrganizationRepository ucsbOrganizationRepository;

    @MockBean
    UserRepository userRepository;

    // Test All and Post
    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
        mockMvc.perform(get("/api/ucsborganizations/all"))
                .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
        mockMvc.perform(get("/api/ucsborganizations/all"))
                .andExpect(status().is(200)); // logged
    }

    @Test
    public void logged_out_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/ucsborganizations/post"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/ucsborganizations/post"))
                .andExpect(status().is(403)); // only admins can post
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_organization() throws Exception {
        // arrange

        UCSBOrganization sigmanu = UCSBOrganization.builder()
                .orgCode("SNU")
                .orgTranslationShort("SIGMA NU")
                .orgTranslation("SIGMA NU FRATERNITY")
                .inactive(true)
                .build();

        when(ucsbOrganizationRepository.save(eq(sigmanu))).thenReturn(sigmanu);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/ucsborganizations/post?orgCode=SNU&orgTranslationShort=SIGMA NU&orgTranslation=SIGMA NU FRATERNITY&inactive=true")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).save(sigmanu);
        String expectedJson = mapper.writeValueAsString(sigmanu);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_ucsborganizations() throws Exception {
        // arrange

        UCSBOrganization skydiving = UCSBOrganization.builder()
                .orgCode("SKY")
                .orgTranslationShort("SKYDIVING CLUB")
                .orgTranslation("SKYDIVING CLUB AT UCSB")
                .inactive(false)
                .build();

        UCSBOrganization sigmanu = UCSBOrganization.builder()
                .orgCode("SNU")
                .orgTranslationShort("SIGMA NU")
                .orgTranslation("SIGMA NU FRATERNITY")
                .inactive(true)
                .build();

        ArrayList<UCSBOrganization> expectedOrgs = new ArrayList<>();
        expectedOrgs.addAll(Arrays.asList(skydiving, sigmanu));

        when(ucsbOrganizationRepository.findAll()).thenReturn(expectedOrgs);

        // act
        MvcResult response = mockMvc.perform(get("/api/ucsborganizations/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(ucsbOrganizationRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedOrgs);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    // Tests get_by_id

    @Test
    public void logged_out_users_cannot_get_by_id() throws Exception {
        mockMvc.perform(get("/api/ucsborganizations?orgCode=SKY"))
                .andExpect(status().is(403)); // logged out users can't get by id
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
        // arrange
        UCSBOrganization organization = UCSBOrganization.builder()
                .orgCode("SKY")
                .orgTranslationShort("SKYDIVING CLUB")
                .orgTranslation("SKYDIVING CLUB AT UCSB")
                .inactive(false)
                .build();

        when(ucsbOrganizationRepository.findById(eq("SKY"))).thenReturn(Optional.of(organization));

        // act
        MvcResult response = mockMvc.perform(get("/api/ucsborganizations?orgCode=SKY"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(ucsbOrganizationRepository, times(1)).findById(eq("SKY"));
        String expectedJson = mapper.writeValueAsString(organization);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {
        // arrange

        when(ucsbOrganizationRepository.findById(eq("WWW"))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/ucsborganizations?orgCode=WWW"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(ucsbOrganizationRepository, times(1)).findById(eq("WWW"));
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UCSBOrganization with id WWW not found", json.get("message"));
    }

    // Tests Put
    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_commons() throws Exception {
        // arrange

        UCSBOrganization skyOrig = UCSBOrganization.builder()
                .orgCode("SKY")
                .orgTranslationShort("SKYDIVING CLUB")
                .orgTranslation("SKYDIVING CLUB AT UCSB")
                .inactive(false)
                .build();

        UCSBOrganization skyEdited = UCSBOrganization.builder()
                .orgCode("SKY")
                .orgTranslationShort("SKY DIVING CLUB")
                .orgTranslation("SKY DIVING CLUB AT UCSB")
                .inactive(true)
                .build();

        String requestBody = mapper.writeValueAsString(skyEdited);

        when(ucsbOrganizationRepository.findById(eq("SKY"))).thenReturn(Optional.of(skyOrig));

        // act
        MvcResult response = mockMvc.perform(
                put("/api/ucsborganizations?orgCode=SKY")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).findById("SKY");
        verify(ucsbOrganizationRepository, times(1)).save(skyEdited); // should be saved with updated info
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_commons_that_does_not_exist() throws Exception {
        // arrange

        UCSBOrganization cccEdited = UCSBOrganization.builder()
                .orgCode("CCC")
                .orgTranslationShort("Civilian Corps")
                .orgTranslation("Civilian Conservation Corps")
                .inactive(true)
                .build();

        String requestBody = mapper.writeValueAsString(cccEdited);

        when(ucsbOrganizationRepository.findById(eq("CCC"))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                put("/api/ucsborganizations?orgCode=CCC")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).findById("CCC");
        Map<String, Object> json = responseToJson(response);
        assertEquals("UCSBOrganization with id CCC not found", json.get("message"));
    }

    // Delete tests

    @Test
    public void logged_out_users_cannot_delete() throws Exception {
        mockMvc.perform(delete("/api/ucsborganizations/delete"))
            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_delete() throws Exception {
        mockMvc.perform(delete("/api/ucsborganizations/delete"))
            .andExpect(status().is(403)); // only admins can post
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_tries_to_delete_non_existant_orgnization_and_gets_right_error_message() throws Exception {
        // arrange

        when(ucsbOrganizationRepository.findById(eq("CCC"))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
            delete("/api/ucsborganizations?orgCode=CCC")
                            .with(csrf()))
            .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).findById("CCC");
        Map<String, Object> json = responseToJson(response);
        assertEquals("UCSBOrganization with id CCC not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_delete_an_orgnization() throws Exception {
        // arrange
        UCSBOrganization skydiving = UCSBOrganization.builder()
            .orgCode("SKY")
            .orgTranslationShort("SKYDIVING CLUB")
            .orgTranslation("SKYDIVING CLUB AT UCSB")
            .inactive(false)
            .build();

        when(ucsbOrganizationRepository.findById(eq("SKY"))).thenReturn(Optional.of(skydiving));

        // act
        MvcResult response = mockMvc.perform(
            delete("/api/ucsborganizations?orgCode=SKY")
                            .with(csrf()))
            .andExpect(status().isOk()).andReturn();
        
        // assert
        verify(ucsbOrganizationRepository, times(1)).findById("SKY");
        verify(ucsbOrganizationRepository, times(1)).delete(any());

        Map<String, Object> json = responseToJson(response);
        assertEquals("UCSBOrganization with id SKY deleted", json.get("message"));
    }

}