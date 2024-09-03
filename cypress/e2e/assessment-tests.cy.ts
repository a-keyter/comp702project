describe("Assessment Tests", () => {
  let randomClassCode: string;

  const newAssessmentTitle = "Plant Life - Parts of a Flower";
  const newAssessmentObjectives =
    "Students will understand the parts of a flower and how they enable the plant to grow.";

  const studentEmails = ["student1@test.com", "student2@test.com", "student3@test.com"]

  beforeEach(() => {
    // Initialise Cypress at Home / Landing Page
    cy.visit("/");
  });

  describe("Assessment Creation", () => {
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

    it("Initialise example class", () => {
      // Click the "Create Class" button to open the dialog
      cy.get('[data-id="create-class-btn"]').click();

      // Verify the dialog is open
      cy.contains("Create New Class").should("be.visible");

      // Generate a random class code
      randomClassCode = Math.floor(
        1000000 + Math.random() * 9000000
      ).toString();

      // Fill in the form
      cy.get('input[name="classCode"]').type(randomClassCode);
      cy.get('input[name="title"]').type("Example Class");
      cy.get('textarea[name="description"]').type(
        "This is an example class created by Cypress"
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
      cy.contains("Example Class").should("be.visible");
      cy.contains("This is an example class created by Cypress").should(
        "be.visible"
      );

      // Click the "Add Students" button
      cy.get('[data-id="add-students-dialog-btn"]').click();

      // Verify the add students dialog is open
      cy.contains("Add Students to Class").should("be.visible");

      // Enter student emails
      cy.get('textarea[placeholder="Enter student email addresses"]').type(
        "student1@test.com, student2@test.com, student3@test.com,"
      );

      studentEmails.forEach((studentEmail) => {
        cy.contains(studentEmail).should("be.visible");
      })

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
    });

    it("Can create new assessment", () => {
      // Head to our demo / example class page
      cy.visit(`/classes/${randomClassCode}`);

      // Wait for the class page to load
      cy.get('[data-testid="class-page-loaded"]', { timeout: 10000 }).should(
        "exist"
      );

      // Check that we can access the new assessment dialog
      cy.get('[data-id="new-assessment-dialog"]', { timeout: 10000 })
        .should("be.visible")
        .click();

      // Check if the dialog is open
      cy.get('div[role="dialog"]').should("be.visible");
      // Fill in the assessment title
      cy.get('input[name="title"]').type(newAssessmentTitle);

      // Fill in the objectives
      cy.get('textarea[name="objectives"]').type(newAssessmentObjectives);

      // Submit the form
      cy.get('button[type="submit"]').contains("Create Assessment").click();

      // Check that the dialog has closed
      cy.get('div[role="dialog"]').should("not.exist");

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

      // Await assessment page load
      cy.get('[data-id="assessment-page-loaded"]', { timeout: 10000 }).should(
        "exist"
      )

      // Check that the assessment title is present on the page
      cy.contains(newAssessmentTitle).should("be.visible");

      // Check that the assessment objectives are present on the page
      cy.contains(newAssessmentObjectives).should("be.visible");

      // Navigate to the class page
      cy.contains(randomClassCode).click();

      // Verify class page has loaded
      cy.get('[data-testid="class-page-loaded"]', { timeout: 10000 }).should(
        "exist"
      );

      // Check that the assessment is displayed in the assessments table on the class page
      cy.contains(newAssessmentTitle.slice(0, 25), { timeout: 10000 });

      // Navigate to the dashboard
      cy.contains("Ambi-Learn - Teacher").click();

      // Wait for the Dashboard page to load
      cy.get('[data-testid="server-render-complete"]', {
        timeout: 10000,
      }).should("exist");

      // Verify that the new assessment is displayed in the assessments table on the dashboard
      cy.contains(newAssessmentTitle.slice(0, 25), { timeout: 10000 });
    });
  });

//   describe("Assessment Submission", () => {
//     // Write a for each loop
//     // Login as a student
//     // Check Notifications - notified of new class & assessment
//   });

  describe("Cleanup / Class Deletion", () => {
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
  })

});
