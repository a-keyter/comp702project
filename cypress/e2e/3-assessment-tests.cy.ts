/* eslint-disable no-undef */
describe("Assessment Tests", () => {
  let randomClassCode: string;

  const newAssessmentTitle = "Plant Life - Parts of a Flower";
  const newAssessmentObjectives =
    "Students will understand the parts of a flower and how they enable the plant to grow.";

  const studentEmails = [
    "student1@test.com",
    "student2@test.com",
    "student3@test.com",
  ];

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
      cy.get('[data-id="server-render-complete"]', {
        timeout: 50000,
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
      cy.url({timeout: 10000}).should("include", `/classes/${randomClassCode.toLowerCase()}`, {
        timeout: 50000,
      });

      // Check to ensure the page has loaded
      cy.get('[data-id="class-page-loaded"]', { timeout: 50000 }).should(
        "exist"
      );

      // Verify the new class is displayed
      cy.contains("Example Class").should("be.visible");
      cy.contains("This is an example class created by Cypress").should(
        "be.visible"
      );

      // Click the "Add Students" button
      cy.get('[data-id="add-students-dialog-btn"]', { timeout: 50000 }).click();

      // Verify the add students dialog is open
      cy.contains("Add Students to Class").should("be.visible");

      // Enter student emails
      cy.get('textarea[placeholder="Enter student email addresses"]').type(
        "student1@test.com, student2@test.com, student3@test.com,"
      );

      studentEmails.forEach((studentEmail) => {
        cy.contains(studentEmail).should("be.visible");
      });

      // Submit the form
      cy.get('[data-id="add-students-btn"]').click();

      // Wait for the addition process to complete
      cy.get('[data-id="add-students-btn"]', { timeout: 30000 }).should("not.exist");

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
      cy.get('[data-id="class-page-loaded"]', { timeout: 50000 }).should(
        "exist"
      );

      // Check that we can access the new assessment dialog
      cy.get('[data-id="new-assessment-dialog"]', { timeout: 50000 })
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
      cy.url({timeout: 10000}).should("match", /\/assessments\/edit\/[a-zA-Z0-9-]+/, {
        timeout: 100000,
      });

      // Check if the new assessment editor dialog is open
      cy.get('div[role="dialog"]').should("be.visible");

      // Check for the presence of the AI generate MCQs button and click it
      cy.get('[data-id="ai-generate-mcqs"]').should("be.visible").click();

      // Loop through items 1 to 5 and check for their visibility
      for (let i = 1; i <= 5; i++) {
        cy.contains(`Item ${i}`).should("be.visible", { timeout: 50000 });
      }

      // Check that the last mcq answers have been generated.
      cy.get("textarea")
        .last()
        .should("not.have.value", "", { timeout: 50000 });

      // Click the publish assessment button
      cy.get('[data-id="publish-assessment"]').should("be.visible").click();

      // Intercept the POST request for saving assessment items
      cy.intercept("POST", "/assessments/edit/*").as("saveAssessment");

      // Wait for the save request to complete
      cy.wait("@saveAssessment", { timeout: 50000 }).then((interception) => {
        // Check if the save was successful
        expect(interception.response!.statusCode).to.equal(200);
      });

      // Get the current URL before the redirect
      let originalUrl;
      cy.url().then((url) => {
        originalUrl = url;

        // Wait for the URL to change
        cy.url({timeout: 100000}).should("not.eq", originalUrl, { timeout: 50000 });
      });

      // Check that the assessment title is present on the page
      cy.contains(newAssessmentTitle).should("be.visible", { timeout: 50000 });

      // Check that the assessment objectives are present on the page
      cy.contains(newAssessmentObjectives).should("be.visible");

      // Navigate to the class page
      cy.contains(randomClassCode).click();

      // Verify class page has loaded
      cy.get('[data-id="class-page-loaded"]', { timeout: 50000 }).should(
        "exist"
      );

      // Check that the assessment is displayed in the assessments table on the class page
      cy.contains(newAssessmentTitle.slice(0, 25), { timeout: 50000 });

      // Navigate to the dashboard
      cy.contains("Ambi-Learn - Teacher").click();

      // Wait for the Dashboard page to load
      cy.get('[data-id="server-render-complete"]', {
        timeout: 50000,
      }).should("exist");

      // Verify that the new assessment is displayed in the assessments table on the dashboard
      cy.contains(newAssessmentTitle.slice(0, 25), { timeout: 50000 });
    });
  });

  describe("Assessment Submission", () => {
    for (let i = 1; i <= 3; i++) {
      it(`Student ${i} can submit assessment`, () => {
        // Login as student
        cy.clerkSignIn({
          strategy: "password",
          identifier: studentEmails[i - 1],
          password: "S3cur3P4ss",
        });

        cy.visit("/dashboard");
        // Wait for server-side rendering to complete
        cy.get('[data-id="server-render-complete"]', {
          timeout: 50000,
        }).should("exist");

        // Redirect to the class page
        cy.visit(`/classes/${randomClassCode}`);

        // Check to ensure the page has loaded
        cy.get('[data-id="class-page-loaded"]', { timeout: 50000 }).should(
          "exist"
        );

        // Allow the data table to load
        cy.contains("All Assessments", { timeout: 50000 });

        // Click on the example assessment
        cy.contains(newAssessmentTitle.slice(0, 25)).click();

        // Get the current URL before the redirect
        let originalUrl;
        cy.url().then((url) => {
          originalUrl = url;
          // Wait for the URL to change
          cy.url({timeout: 10000}).should("not.eq", originalUrl, { timeout: 100000 });
        });

        // Check if we're redirected to the assessment page
        cy.url({timeout: 10000}).should("include", "/assessments/", { timeout: 100000 });

        // Wait for the assessment page to load
        cy.get('[data-id="assess-page-loaded"]', {
          timeout: 50000,
        }).should("exist");

        cy.contains("button", "New Attempt").click();

        // Wait for the assement attempt page to load
        cy.get('[data-id="attempt-render-complete"]', {
          timeout: 50000,
        }).should("exist");

        // Find all question containers
        cy.get('[data-id^="question-"]').each(($question) => {
          // Find all checkbox buttons within this question
          cy.wrap($question)
            .find('button[role="checkbox"]')
            .then(($options) => {
              // Randomly select one option
              const randomIndex = Math.floor(Math.random() * $options.length);
              cy.wrap($options[randomIndex]).click();

              // Verify that the button state has changed to checked
              cy.wrap($options[randomIndex]).should(
                "have.attr",
                "aria-checked",
                "true"
              );
            });
        });

        // Submit the responses
        cy.get('[data-id="submit-assessment"]').click();

        // Intercept the GET request for assessment results
        cy.intercept("GET", "/assessments/results/*").as(
          "getAssessmentResults"
        );

        // Wait for the GET request to complete
        cy.wait("@getAssessmentResults", { timeout: 50000 }).then(
          (interception) => {
            // Check if the request was successful
            expect(interception.response!.statusCode).to.equal(200);
          }
        );

        // Wait for the loading state to finish
        cy.get('[data-id="submit-assessment"]').contains("Submit Assessment", {
          timeout: 50000,
        });

        // Confirm redirect
        cy.url({timeout: 10000}).should("include", "/assessments/results/", { timeout: 50000 });

        // Wait for the assement results page to load
        cy.get('[data-id="results-render-complete"]', {
          timeout: 50000,
        }).should("exist");
      });

      if (i === 3) {
        // Check that the student can see their results
        it(`Student ${i} can review feedback and analysis`, () => {
          // Login as student
          cy.clerkSignIn({
            strategy: "password",
            identifier: studentEmails[i - 1],
            password: "S3cur3P4ss",
          });

          cy.visit("/dashboard");
          // Wait for server-side rendering to complete
          cy.get('[data-id="server-render-complete"]', {
            timeout: 50000,
          }).should("exist");

          // Redirect to the class page
          cy.visit(`/classes/${randomClassCode}`);

          // Check to ensure the page has loaded
          cy.get('[data-id="class-page-loaded"]', { timeout: 50000 }).should(
            "exist"
          );

          // Allow the data table to load
          cy.contains("All Assessments", { timeout: 50000 });

          // Check that submission is logged
          cy.get("tr").contains(newAssessmentTitle);

          // Open the Performance Graph
          cy.contains("button", "Performance").click();

          // Check that the performance graph loads
          cy.contains("Assessment Scores Over Time", { timeout: 50000 });

          // Go back to the asssessments table
          cy.contains("button", "Assessments").click();

          // Allow the data table to load
          cy.contains("All Assessments", { timeout: 50000 });

          // Click the link for the assessment
          cy.contains(newAssessmentTitle).click();

          // Check if we're redirected to the edit page of the new assessment
          cy.url({timeout: 10000}).should("include", "/assessments/", { timeout: 50000 });

          // Check if the AI generated assessment feedback is present
          cy.contains("AI Generated Feedback may not be 100% accurate.", {
            timeout: 50000,
          });
        });
      }
    }
  });

  describe("Feedback Issue Submission", () => {
    it(`Student 1 can report feedback`, () => {
      // Login as student
      cy.clerkSignIn({
        strategy: "password",
        identifier: studentEmails[0],
        password: "S3cur3P4ss",
      });

      cy.visit("/dashboard");
      // Wait for server-side rendering to complete
      cy.get('[data-id="server-render-complete"]', {
        timeout: 50000,
      }).should("exist");

      // Redirect to the class page
      cy.visit(`/classes/${randomClassCode}`);

      // Check to ensure the page has loaded
      cy.get('[data-id="class-page-loaded"]', { timeout: 50000 }).should(
        "exist"
      );

      // Click the link for the assessment
      cy.contains(newAssessmentTitle, { timeout: 50000 }).click();

      // Check if we're redirected to the edit page of the new assessment
      cy.url({timeout: 10000}).should("include", "/assessments/", { timeout: 10000 });

      // Check if the AI generated assessment feedback is present
      cy.contains("AI Generated Feedback may not be 100% accurate.", {
        timeout: 50000,
      });

      // Click the report feedback button
      cy.get('[data-id="report-feedback-btn"]').click();

      // Check if the report feedback dialog is open
      cy.get('div[role="dialog"]').should("be.visible");

      // Fill in the report details
      cy.get('textarea[name="issueDescription"]').type(
        "This feedback seems inaccurate."
      );

      // Submit the form
      cy.contains("button", "Submit Issue").click();

      // Check for success toast
      cy.contains("Success", { timeout: 50000 }).should("be.visible");

      // Click the 'Issues' button in the nav bar
      cy.contains("button", "Issues").click();

      // Wait for redirect to /issues
      cy.url({timeout: 50000}).should("include", "/issues", { timeout: 50000 });

      // Wait for the table to load
      cy.contains("Open Question and Feedback Issues", {
        timeout: 50000,
      }).should("be.visible");

      // Click on the word Feedback in the row containing randomClassCode
      cy.contains("tr", randomClassCode).contains("Feedback").click();

      // Wait for redirect to /issues/[someissueId]
      cy.url({timeout: 10000}).should("match", /\/issues\/[a-zA-Z0-9-]+/, { timeout: 5000 });

      // Check that the page contains the text 'unread'
      cy.contains(/unread/i).should("be.visible");
    });

    it("Teacher can see new notification (for raised issue)", () => {
      // Log in as teacher
      cy.clerkSignIn({
        strategy: "password",
        identifier: "teacher1@test.com",
        password: "teacher1",
      });

      // Navigate to dashboard
      cy.visit("/dashboard");

      // Wait for server-side rendering to complete
      cy.get('[data-id="server-render-complete"]', {
        timeout: 50000,
      }).should("exist");

      cy.get('[data-id="notifications-btn"]').contains("1");
    });

    it("Teacher can respond to student issue", () => {
      // Log in as teacher
      cy.clerkSignIn({
        strategy: "password",
        identifier: "teacher1@test.com",
        password: "teacher1",
      });

      // Navigate to dashboard
      cy.visit("/dashboard");

      // Wait for server-side rendering to complete
      cy.get('[data-id="server-render-complete"]', {
        timeout: 50000,
      }).should("exist");

      // Click on the notifications button
      cy.get('[data-id="notifications-btn"]').click();

      // Wait for the notifications page redirect
      cy.url({timeout: 10000}).should("include", "/notifications", { timeout: 10000 });

      // Wait for the notifications page to load
      cy.get('[data-id="notifications-page-loaded"]', { timeout: 10000 }).should("exist");

      // Click on the first notification
      cy.contains(
        `New feedback issue raised for the assessment ${newAssessmentTitle}`
      ).click();

      // Wait for the issue page to load
      cy.url({timeout: 10000})
        .should("include", "/issues/", { timeout: 10000 })
        .and(
          "match",
          /\/issues\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
        );

      // Check that the issue details are displayed
      cy.contains("Feedback Issue").should("be.visible");

      // Check that the chat component is visible
      // Wait for the loading state to finish
      cy.get('[data-id="issue-chat"]', { timeout: 10000 }).should("be.visible");


      // Type a response message
      cy.get('input[placeholder="Enter your message here..."]').type(
        "This is a test response from the teacher"
      );

      // Click the send button
      cy.get('button[type="submit"]').contains("Send").click();

      // Verify that the message appears in the chat
      cy.contains("This is a test response from the teacher", { timeout: 50000 }).should(
        "be.visible"
      );

      // Verify that the message is shown as sent by "You"
      cy.contains("You").should("be.visible");

      // Verify that the teacher's role is displayed
      cy.contains("Teacher", { matchCase: false }).should("be.visible");

      // Verify that the send button is disabled after sending a message
      cy.get('button[type="submit"]').should("be.disabled");
    });

    it("Student receives response notification", () => {
      // Login as student
      cy.clerkSignIn({
        strategy: "password",
        identifier: studentEmails[0],
        password: "S3cur3P4ss",
      });

      // Navigate to dashboard
      cy.visit("/dashboard");

      // Wait for server-side rendering to complete
      cy.get('[data-id="server-render-complete"]', {
        timeout: 50000,
      }).should("exist");

      // Wait for the notifications count to be updated
      cy.get('[data-id="notifications-btn"]', { timeout: 30000 }).should(($btn) => {
        const text = $btn.text();
        expect(text).to.match(/\d+/);
        expect(parseInt(text)).to.be.greaterThan(1);
      });

      // Check for unread notifications
      cy.get('[data-id="notifications-btn"]').contains("3");

      // Click on the notifications button
      cy.get('[data-id="notifications-btn"]').click();

      // Check for teacher response in the notifications
      cy.contains(`New message in an issue`, {timeout: 50000}).should("be.visible");

      // Click on the notification
      cy.contains(`New message in an issue`).click();

      // Check that the issue page loads
      cy.url({timeout: 10000}).should("include", "/issues/", { timeout: 10000 });

      // Check that the message is displayed in the chat
      cy.contains("This is a test response from the teacher").should(
        "be.visible"
      );
    });
  });

  describe("Teacher - Assessment Analysis", () => {
    // Verify that the teacher can see the results, statistics and AI feedback of the assessment
    beforeEach(() => {
      // Log in as teacher
      cy.clerkSignIn({
        strategy: "password",
        identifier: "teacher1@test.com",
        password: "teacher1",
      });
      // Navigate to the dashboard
      cy.visit("/dashboard");
      // Wait for server-side rendering to complete
      cy.get('[data-id="server-render-complete"]', {
        timeout: 50000,
      }).should("exist");
    });

    it("Can view results and AI feedback", () => {
      // Navigate to the class page
      cy.visit(`/classes/${randomClassCode}`);

      // Wait for the class page to load
      cy.get('[data-id="class-page-loaded"]', { timeout: 50000 }).should(
        "exist"
      );

      // Allow the data table to load
      cy.contains("All Assessments", { timeout: 50000 });

      // Click on the assessment
      cy.contains(newAssessmentTitle, { timeout: 50000 }).click();

      // Check if we're taken to the assessment overview page
      cy.url({timeout: 10000}).should("include", "/assessments/", { timeout: 10000 });

      // Click on the Statistics tab
      cy.contains("Statistics").click();

      // Check that the performance graph loads
      cy.contains("Assessment Performance").should("be.visible");

      cy.contains("Correct Responses").should("be.visible");

      cy.contains("Incorrect Responses").should("be.visible");

      // Check that the most challenging questions list loads
      cy.contains("% correct").should("be.visible");

      // Click on the 'AI Feedback' tab
      cy.contains("AI Feedback").click();

      // Intercept the POST request for AI feedback
      cy.intercept("POST", "/assessments/*").as("getAIFeedback");

      // Wait for the AI feedback request to complete
      cy.wait("@getAIFeedback", { timeout: 50000 }).then((interception) => {
        // Check if the request was successful
        expect(interception.response!.statusCode).to.equal(200);
      });

      // Wait for the AI Generated Feedback to be rendered
      cy.contains("AI Generated Feedback", { timeout: 50000 }).should("be.visible");

      // Check that the AI feedback content loads
      cy.get("div").contains("AI generated feedback may not be 100% accurate.", { timeout: 50000 }).should("be.visible");
    });
  });

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
      cy.get('[data-id="server-render-complete"]', {
        timeout: 50000,
      }).should("exist");
    });

    it("Can delete an existing class", () => {
      // Navigate to the class page
      cy.visit(`/classes/${randomClassCode}`);

      // Wait for the class page to load
      cy.get('[data-id="class-page-loaded"]', { timeout: 50000 }).should(
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
      cy.url({timeout: 10000}).should("include", "/dashboard", { timeout: 10000 });

      // Wait for the dashboard to load
      cy.get('[data-id="server-render-complete"]', {
        timeout: 50000,
      }).should("exist");

      // Verify the deleted class no longer appears in the class list
      cy.get('[data-id="class-table-title"]').should("contain", "Classes");
      cy.contains("Updated Test Class").should("not.exist");
    });
  });
});
