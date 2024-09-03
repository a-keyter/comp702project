describe("E2E Functionality", () => {
  let randomClassCode: string;
  beforeEach(() => {
    cy.visit("/");
  });


  // describe("Authentication", () => {
  //   it("Can log in and out as teacher", () => {
  //     // Verify the sign-in button is visible
  //     cy.get('[data-id="sign-in-button"]')
  //       .should("be.visible")
  //       .and("contain", "Sign in");

  //     // Perform login using Clerk
  //     cy.clerkSignIn({
  //       strategy: "password",
  //       identifier: "teacher1@test.com",
  //       password: "teacher1",
  //     });

  //     // Wait for the dashboard button to be visible after login
  //     cy.get('[data-id="dashboard-button"]', { timeout: 10000 }).should(
  //       "be.visible"
  //     );

  //     // Click the dashboard button
  //     cy.get('[data-id="dashboard-button"]').click();

  //     // Verify redirection to the dashboard
  //     cy.url().should("include", "/dashboard");

  //     // Check for teacher-specific content
  //     cy.contains(/ambi-learn - teacher/i).should("be.visible");

  //     // Wait for server-side rendering to complete
  //     cy.get('[data-testid="server-render-complete"]', {
  //       timeout: 10000,
  //     }).should("exist");

  //     // Verify presence of Classes table
  //     cy.get('[data-id="class-table-title"]')
  //       .should("be.visible")
  //       .and("contain", "Classes");

  //     // Verify presence of Assessments table
  //     cy.get('[data-id="assessment-table-title"]')
  //       .should("be.visible")
  //       .and("contain", "Assessments");

  //     // Open profile dropdown
  //     cy.get('[data-id="profile-drop-btn"]').click();

  //     // Click sign out
  //     cy.get('[data-id="sign-out-btn"]').click();

  //     // Assert redirect to home page
  //     cy.url().should("eq", Cypress.config().baseUrl + "/");

  //     // Verify user is logged out (e.g., sign-in button is visible)
  //     cy.get('[data-id="sign-in-button"]').should("be.visible");
  //   });
  // });

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

      // Wait for the class creation process and redirection
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

    // it("Can edit an existing class", () => {
    //   // Navigate to the class page
    //   cy.visit(`/classes/${randomClassCode}`);

    //   // Wait for the class page to load
    //   cy.get('[data-testid="class-page-loaded"]', { timeout: 10000 }).should(
    //     "exist"
    //   );

    //   // Click the "Edit Class" button
    //   cy.get('[data-id="edit-class-btn"]').click();

    //   // Verify the edit dialog is open using the new data attribute
    //   cy.get('[data-id="edit-class-dialog-title"]').should("be.visible");

    //   // Update the class title and description
    //   cy.get('input[name="title"]').clear().type("Updated Test Class");
    //   cy.get('textarea[name="description"]')
    //     .clear()
    //     .type("This is an updated test class description");

    //   // Submit the form
    //   cy.contains("button", "Save changes").click();

    //   // Wait for the update to complete and the dialog to close
    //   cy.get('[data-id="edit-class-dialog-title"]').should("not.exist");

    //   // Verify the updated information is displayed
    //   cy.contains("Updated Test Class").should("be.visible");
    //   cy.contains("This is an updated test class description").should(
    //     "be.visible"
    //   );

    //   // Navigate back to dashboard
    //   cy.visit("/dashboard");

    //   // Wait for the dashboard to load
    //   cy.get('[data-testid="server-render-complete"]', {
    //     timeout: 10000,
    //   }).should("exist");

    //   // Verify the updated class appears in the class list
    //   cy.get('[data-id="class-table-title"]').should("contain", "Classes");
    //   cy.contains("Updated Test Class").should("be.visible");
    // });

    // it("Can add students to class", () => {
    //   // Navigate to the class page
    //   cy.visit(`/classes/${randomClassCode}`);

    //   // Wait for the class page to load
    //   cy.get('[data-testid="class-page-loaded"]', { timeout: 10000 }).should(
    //     "exist"
    //   );

    //   // Click the "Add Students" button
    //   cy.get('[data-id="add-students-dialog-btn"]').click();

    //   // Verify the add students dialog is open
    //   cy.contains("Add Students to Class").should("be.visible");

    //   // Enter student emails
    //   cy.get('textarea[placeholder="Enter student email addresses"]').type(
    //     "student1@test.com, student2@test.com, student3@test.com,"
    //   );

    //   // Verify that the emails are added
    //   cy.contains("student1@test.com").should("be.visible");
    //   cy.contains("student2@test.com").should("be.visible");
    //   cy.contains("student3@test.com").should("be.visible");

    //   // Submit the form
    //   cy.get('[data-id="add-students-btn"]').click();

    //   // Wait for the addition process to complete
    //   cy.get('[data-id="add-students-btn"]').should("not.exist");

    //   // Verify the success toast
    //   cy.contains("Students have been successfully added to the class.").should(
    //     "be.visible"
    //   );

    //   // Verify the student count has increased
    //   cy.get('[data-id="student-count"]').should("contain", "3");

    //   // Check the students table
    //   cy.contains("button", "Students").click();
    // });
  });

  describe("Assessment Management", () => {
    const newAssessmentTitle = "Plant Life - Parts of a Flower";
    const newAssessmentObjectives =
      "Students will understand the parts of a flower and how they enable the plant to grow.";

    beforeEach(() => {
      // Log in before each test in this block
      cy.clerkSignIn({
        strategy: "password",
        identifier: "teacher1@test.com",
        password: "teacher1",
      });
      // Head to our demo / example class page
      cy.visit(`/classes/${randomClassCode}`);

      // Wait for the class page to load
      cy.get('[data-testid="class-page-loaded"]', { timeout: 10000 }).should(
        "exist"
      );
    });

    it("Can create new assessment", () => {
      cy.get('[data-id="new-assessment-dialog"]', { timeout: 10000 }).should(
        "be.visible"
      );
      cy.get('[data-id="new-assessment-dialog"]').click();

      // Check if the dialog is open
      cy.get('div[role="dialog"]').should("be.visible");
      // Fill in the assessment title
      cy.get('input[name="title"]').type(newAssessmentTitle);

      // Fill in the objectives
      cy.get('textarea[name="objectives"]').type(newAssessmentObjectives);

      // Submit the form
      cy.get('button[type="submit"]').contains("Create Assessment").click();

      // Check if we're redirected to the edit page of the new assessment
      cy.url().should("include", "/assessments/edit/", { timeout: 30000 });

      // Check if the new assessment editor dialog is open
      cy.get('div[role="dialog"]').should("be.visible");

      // Check for the presence of the AI generate MCQs button and click it
      cy.get('[data-id="ai-generate-mcqs"]').should("be.visible").click();

      // Loop through items 1 to 5 and check for their visibility
      for (let i = 1; i <= 5; i++) {
        cy.contains(`Item ${i}`).should("be.visible", { timeout: 10000 });
      }

      // Check that the last mcq answers have been generated.
      cy.get("textarea")
        .last()
        .should("not.have.value", "", { timeout: 10000 });

      // Click the publish assessment button
      cy.get('[data-id="publish-assessment"]').should("be.visible").click();

      // Check that the page has been redirected to a URL that contains /assessments/
      cy.url().should("include", "/assessments/", { timeout: 10000 });

      // Check that the assessment title is present on the page
      cy.contains(newAssessmentTitle).should("be.visible");

      // Check that the assessment objectives are present on the page
      cy.contains(newAssessmentObjectives).should("be.visible");
    });
  });

  // describe("Student Testing", () => {

  // })

  // describe("Student Response Generation", () => {
  //   const studentEmails = ["student1@test.com", "student2@test.com", "student3@test.com"]
  //   const studentPass = "S3cur3P4ssw0rd"
  // })

  // describe("Security Testing - Teacher", () => {

  // })

  // describe("Security Testing - Student", () => {

  // })

  describe("Class Deletion", () => {
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
