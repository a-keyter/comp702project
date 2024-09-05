/* eslint-disable no-undef */

describe("Profile Tests", () => {
  beforeEach(() => {
    cy.visit("/");

    // Check for Sign In Button
    cy.get('[data-id="sign-in-button"]')
        .should("be.visible")
        .and("contain", "Sign in");

      // Perform login using Clerk
      cy.clerkSignIn({
        strategy: "password",
        identifier: "teacher@e2e.com",
        password: "teachere2e",
      });

      // Wait for the dashboard button to be visible and navigate to dashboad after login
      cy.get('[data-id="dashboard-button"]', { timeout: 30000 })
        .should("be.visible")
        .click();
  });

  describe("Profile Creation and Management", () => {
    // Test Onboarding Flow
    it("Can create profile", () => {
      // Wait for redirect to new profile creation
      cy.url().should("include", "/onboard", { timeout: 30000 });

      // Check that the profile creation / onboarding form has rendered
      cy.contains("Welcome to Ambi-Learn!");

      // Fill out the form
      cy.get('input[name="name"]').type("John Doe");
      cy.get('input[name="nickname"]').type("johnd");

      // Toggle the teacher mode switch
      cy.get('button[role="switch"]').click();

      // Submit the form
      cy.contains("button", "Lets get started!").click();

      // Wait for the form submission and redirect
      cy.url().should("include", "/dashboard", { timeout: 30000 });

      cy.contains("Ambi-Learn - Teacher");
    });

    // Test Profile Update
    it("Can update profile", () => {
      // Verify redirection to the dashboard
      cy.url().should("include", "/dashboard");

      // Wait for server-side rendering to complete
      cy.get('[data-testid="server-render-complete"]', {
        timeout: 30000,
      }).should("exist");

      //  Open profile dropdown
      cy.get('[data-id="profile-drop-btn"]').click();

      // Click sign out
      cy.get('[data-id="user-profile-btn"]').click();

      // Verify redirection to the users profile
      cy.url().should("include", "/profile");

      // Wait for server-side rendering to complete
      cy.get('[data-id="server-render-complete"]', {
        timeout: 30000,
      }).should("exist");

      // Click the "Edit Profile" button
      cy.contains("Edit Profile").click();

      // Wait for the dialog to appear
      cy.get("div[role='dialog']").should("be.visible");

      // Edit the name field
      cy.get("input[name='name']").clear().type("Updated Name");

      // Edit the nickname field
      cy.get("input[name='nickname']").clear().type("updated-nickname");

      // Click the "Save changes" button
      cy.contains("Save changes").click();

      // Wait for the dialog to close
      cy.get("div[role='dialog']").should("not.exist");

      // Verify that the page has been refreshed (you might need to adjust this based on your app's behavior)
      cy.get('[data-id="server-render-complete"]', {
        timeout: 30000,
      }).should("exist");

      // Verify that the profile has been updated
      cy.contains("Updated Name").should("be.visible");
      cy.contains("updated-nickname").should("be.visible");
    });

    it("Can delete profile", () => {
      // Verify redirection to the dashboard
      cy.url().should("include", "/dashboard");

      // Wait for server-side rendering to complete
      cy.get('[data-testid="server-render-complete"]', {
        timeout: 30000,
      }).should("exist");

      //  Open profile dropdown
      cy.get('[data-id="profile-drop-btn"]').click();

      // Click profile
      cy.get('[data-id="user-profile-btn"]').click();

      // Verify redirection to the user's profile
      cy.url().should("include", "/profile");

      // Wait for server-side rendering to complete
      cy.get('[data-id="server-render-complete"]', {
        timeout: 30000,
      }).should("exist");

      // Click the "Delete Profile" button
      cy.contains("Delete Profile").click();

      // Wait for the dialog to appear
      cy.get("div[role='dialog']").should("be.visible");

      // Type the confirmation phrase
      cy.get("input[name='confirmPhrase']").type("delete-my-profile");

      // Click the "Delete Profile" button in the dialog
      cy.get('[data-id="delete-profile-btn"]').click();

      // Wait for the dialog to close
      cy.get("div[role='dialog']").should("not.exist", { timeout: 30000 });
      
      // Verify redirection to the home page after deletion
      cy.url({timeout: 30000}).should("eq", Cypress.config().baseUrl + "/", { timeout: 30000 });

      // Verify that the user is logged out
      cy.get('[data-id="sign-in-button"]').should("be.visible", {
        timeout: 30000,
      });
    });
  });
});
