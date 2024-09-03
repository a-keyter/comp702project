describe("E2E Functionality", () => {
  let randomClassCode: string;
  beforeEach(() => {
    cy.visit("/");
  });
  describe("Class Management", () => {
    beforeEach(() => {
      // Log in and navigate to dashboard before each test in this block
      cy.clerkSignIn({
        strategy: "password",
        identifier: "teacher1@test.com",
        password: "teacher1",
      });
      cy.visit("/dashboard");
      // Wait for server-side rendering to complete
      cy.get('[data-testid="server-render-complete"]', {
        timeout: 10000,
      }).should("exist");
    });

    it("Can create a new class", () => {
      // Click the "New" button to open the dialog
      cy.get('[data-id="create-class-btn"]').click();

      // Verify the dialog is open
      cy.contains("Create New Class").should("be.visible");

      // Generate a random class code
      randomClassCode = Math.floor(
        1000000 + Math.random() * 9000000
      ).toString();

      // Fill in the form
      cy.get('input[name="classCode"]').type(randomClassCode);
      cy.get('input[name="title"]').type("Test Class");
      cy.get('textarea[name="description"]').type(
        "This is a test class created by Cypress"
      );

      // Submit the form
      cy.contains("button", "Create Class").click();

      // Wait for the dialog to close
      cy.get("div[role='dialog']").should("not.exist");
    
      // Wait for redirection to the class
      cy.url().should("include", `/classes/${randomClassCode.toLowerCase()}`, {
        timeout: 10000,
      });

      // Additional check to ensure the page has loaded
      cy.get('[data-testid="class-page-loaded"]', { timeout: 10000 }).should(
        "exist"
      );

      // Verify the new class is displayed
      cy.contains("Test Class").should("be.visible");
      cy.contains("This is a test class created by Cypress").should(
        "be.visible"
      );

      // Navigate back to dashboard
      cy.visit("/dashboard");

      // Wait for the dashboard to load
      cy.get('[data-testid="server-render-complete"]', {
        timeout: 10000,
      }).should("exist");

      // Verify the new class appears in the class list
      cy.get('[data-id="class-table-title"]').should("contain", "Classes");
      cy.contains("Test Class").should("be.visible");
      // Store the random class code for use in the next test
      randomClassCode = randomClassCode.toLowerCase();
    });

    it("Can edit an existing class", () => {
      // Navigate to the class page
      cy.visit(`/classes/${randomClassCode}`);

      // Wait for the class page to load
      cy.get('[data-testid="class-page-loaded"]', { timeout: 10000 }).should(
        "exist"
      );

      // Click the "Edit Class" button
      cy.get('[data-id="edit-class-btn"]').click();

      // Verify the edit dialog is open using the new data attribute
      cy.get('[data-id="edit-class-dialog-title"]').should("be.visible");

      // Update the class title and description
      cy.get('input[name="title"]').clear().type("Updated Test Class");
      cy.get('textarea[name="description"]')
        .clear()
        .type("This is an updated test class description");

      // Submit the form
      cy.contains("button", "Save changes").click();

      // Wait for the update to complete and the dialog to close
      cy.get('[data-id="edit-class-dialog-title"]').should("not.exist");

      // Verify the updated information is displayed
      cy.contains("Updated Test Class").should("be.visible");
      cy.contains("This is an updated test class description").should(
        "be.visible"
      );

      // Navigate back to dashboard
      cy.visit("/dashboard");

      // Wait for the dashboard to load
      cy.get('[data-testid="server-render-complete"]', {
        timeout: 10000,
      }).should("exist");

      // Verify the updated class appears in the class list
      cy.get('[data-id="class-table-title"]').should("contain", "Classes");
      cy.contains("Updated Test Class").should("be.visible");
    });

    it("Can add students to class", () => {
      // Navigate to the class page
      cy.visit(`/classes/${randomClassCode}`);

      // Wait for the class page to load
      cy.get('[data-testid="class-page-loaded"]', { timeout: 10000 }).should(
        "exist"
      );

      // Click the "Add Students" button
      cy.get('[data-id="add-students-dialog-btn"]').click();

      // Verify the add students dialog is open
      cy.contains("Add Students to Class").should("be.visible");

      // Enter student emails
      cy.get('textarea[placeholder="Enter student email addresses"]').type(
        "student1@test.com, student2@test.com, student3@test.com,"
      );

      // Verify that the emails are added
      cy.contains("student1@test.com").should("be.visible");
      cy.contains("student2@test.com").should("be.visible");
      cy.contains("student3@test.com").should("be.visible");

      // Submit the form
      cy.get('[data-id="add-students-btn"]').click();

      // Wait for the addition process to complete
      cy.get('[data-id="add-students-btn"]').should("not.exist");

      // Verify the success toast
      cy.contains("Students have been successfully added to the class.").should(
        "be.visible"
      );

      // Verify the student count has increased
      cy.get('[data-id="student-count"]').should("contain", "3");

      // Check the students table
      cy.contains("button", "Students").click();
    });

    it("Can delete an existing class", () => {
      // Navigate to the class page
      cy.visit(`/classes/${randomClassCode}`);

      // Wait for the class page to load
      cy.get('[data-testid="class-page-loaded"]', { timeout: 10000 }).should(
        "exist"
      );

      // Click the "Delete Class" button
      cy.get('[data-id="delete-class-dialog-btn"]').click();

      // Verify the delete dialog is open using the new data attribute
      cy.get('[data-id="delete-class-dialog-title"]').should("be.visible");

      // Fill in the confirmation details
      cy.get('input[name="confirmClassId"]').type(randomClassCode);
      cy.get('input[name="confirmPhrase"]').type("delete-this-class");

      // Submit the form
      cy.get('[data-id="delete-class-btn"]').click();

      // Wait for the deletion process to complete and redirect to dashboard
      cy.url().should("include", "/dashboard", { timeout: 10000 });

      // Wait for the dashboard to load
      cy.get('[data-testid="server-render-complete"]', {
        timeout: 10000,
      }).should("exist");

      // Verify the deleted class no longer appears in the class list
      cy.get('[data-id="class-table-title"]').should("contain", "Classes");
      cy.contains("Updated Test Class").should("not.exist");
    });
  });
});
