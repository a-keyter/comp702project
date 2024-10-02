/* eslint-disable no-undef */
/* eslint-disable no-unused-vars*/

describe("Data Privacy Tests", () => {
  const studentEmails = ["student1@test.com", "student3@test.com"];
  const studentPass = "S3cur3P4ss";
  const student1Nickname = "karpathy";

  const authTeacher = "teacher1@test.com";
  const authTeacherPass = "teacher1";

  const unauthTeacher = "teacher2@test.com";
  const unauthTeacherPass = "teacher2";

  const classTitle = "Data Security, an Introduction";
  const classCode = "dps101";

  const assessmentId1 = "bf6358df-5bf3-4102-8a96-efa9f1a94b4b";
  const assessmentTitle1 = "Data Privacy - What is a Cookie?";
  const assessmentObjectives1 =
    "Students will understand what a cookie is and why it is important.";
  
    const assessmentId2 = "391887d3-6017-45d4-8baa-848dfd06c26c";
  const assessmentTitle2 = "Authentication - What is a Password?";
  const assessmentObjectives2 =
    "Students will understand what a password is and why it is important.";

  const student1SubmissionId = "6eff30f6-8b96-43d4-8374-1dafdc1fc865";
  const student2SubmissionId = "8ae900d9-24c4-4579-a6bc-390b58c0f179";

  beforeEach(() => {
    // Initialise Cypress at Home / Landing Page
    cy.visit("/");
  });

  describe("Unauthenticated Access Checks", () => {
    it("Unauthenticated User is not allowed access to dashboard", () => {
      cy.visit("/dashboard");
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
    it("Unauthenticated User is not allowed access to class", () => {
      cy.visit(`/classes/${classCode}`);
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  describe("Teacher 1 Access", () => {
    beforeEach(() => {
      cy.clerkSignIn({
        strategy: "password",
        identifier: authTeacher,
        password: authTeacherPass,
      });
      cy.contains("Dashboard", {timeout: 10000})
    });
    // Teacher 1 can access their class
    it("Teacher 1 can access their class", () => {
      cy.visit(`/classes/${classCode}`);
      cy.url().should("include", `/classes/${classCode}`);
    });
    // Teacher 1 can access their assessment page
    it("Teacher 1 can access assessment page 1", () => {
      cy.visit(`/assessments/${assessmentId1}`);
      cy.url().should("include", `/assessments/${assessmentId1}`);
    });
    // Teacher 1 can access assessment page 2
    it("Teacher 1 can access assessment page 2", () => {
      cy.visit(`/assessments/${assessmentId2}`);
      cy.url().should("include", `/assessments/${assessmentId2}`);
    });
    // Teacher 1 can access editor for draft assessment 1
    it("Teacher 1 can access editor for draft assessment 1", () => {
      cy.visit(`/assessments/edit/${assessmentId1}`);
      cy.url().should("include", `/assessments/edit/${assessmentId1}`);
    });
    // Teacher 1 cannot access editor for published assessment 2
    it("Teacher 1 cannot access editor for published assessment 2", () => {
      cy.visit(`/assessments/edit/${assessmentId2}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Teacher 1 can access student1 results
    it("Teacher 1 can access student results", () => {
      cy.visit(`/assessments/results/${student1SubmissionId}`);
      cy.url().should("include", `/assessments/results/${student1SubmissionId}`);
    });
    // Teacher 1 can access student 1 profile page
    it("Teacher 1 can access student 1 profile page", () => {
      cy.visit(`/students/${student1Nickname}`);
      cy.url().should("include", `/students/${student1Nickname}`);
    });
  });

  describe("Teacher 2 - Blocked Access", () => {
    beforeEach(() => {
      cy.clerkSignIn({
        strategy: "password",
        identifier: unauthTeacher,
        password: unauthTeacherPass,
      });
      cy.contains("Dashboard", {timeout: 10000})
    });
    // Teacher 2 cannot access Teacher 1's class
    it("Teacher 2 cannot access Teacher 1's class", () => {
      cy.visit(`/classes/${classCode}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Teacher 2 cannot access Teacher 1's assessment page
    it("Teacher 2 cannot access Teacher 1's assessment page", () => {
      cy.visit(`/assessments/${assessmentId1}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Teacher 2 cannot access Teacher 1's student results
    it("Teacher 2 cannot access Teacher 1's student results", () => {
      cy.visit(`/assessments/results/${student1SubmissionId}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Teacher 2 cannot access editor for draft assessment 1
    it("Teacher 2 cannot access editor for draft assessment 1", () => {
      cy.visit(`/assessments/edit/${assessmentId1}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Teacher 2 cannot access editor for published assessment 2
    it("Teacher 2 cannot access editor for published assessment 2", () => {
      cy.visit(`/assessments/edit/${assessmentId2}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Teacher 2 cannot access student 1 profile page
    it("Teacher 2 cannot access student 1 profile page", () => {
      cy.visit(`/students/${student1Nickname}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
  });

  describe("Student 1 - Access Tests", () => {
    beforeEach(() => {
      cy.clerkSignIn({
        strategy: "password",
        identifier: studentEmails[0],
        password: studentPass,
      });
      cy.contains("Dashboard", {timeout: 10000})
    });
    // Student 1 can access their class
    it("Student 1 can access their class", () => {
      cy.visit(`/classes/${classCode}`);
      cy.url().should("include", `/classes/${classCode}`);
    });
    // Student 1 cannot access draft assessment page
    it("Student 1 cannot access draft assessment page", () => {
      cy.visit(`/assessments/${assessmentId1}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Student 1 can access published assessment 2 page
    it("Student 1 can access published assessment 2 page", () => {
      cy.visit(`/assessments/${assessmentId2}`);
      cy.url().should("include", `/assessments/${assessmentId2}`);
    });
    // Student 1 can access their results
    it("Student 1 can access their results", () => {
      cy.visit(`/assessments/results/${student1SubmissionId}`);
      cy.url().should("include", `/assessments/results/${student1SubmissionId}`);
    });
    // Student 1 cannot access editor for assessment 1
    it("Student 1 cannot access editor for assessment 1", () => {
      cy.visit(`/assessments/edit/${assessmentId1}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Student 1 cannot access editor for assessment 2
    it("Student 1 cannot access editor for assessment 2", () => {
      cy.visit(`/assessments/edit/${assessmentId2}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Student 1 cannot access student 2's results
    it("Student 1 cannot access student 2's results", () => {
      cy.visit(`/assessments/results/${student2SubmissionId}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
  });

  describe("Student 3 - Blocked Access Tests", () => {
    beforeEach(() => {
      cy.clerkSignIn({
        strategy: "password",
        identifier: studentEmails[1],
        password: studentPass,
      });
      cy.contains("Dashboard", {timeout: 10000})
    });
    // Student 3 cannot access Teacher 1's class
    it("Student 3 cannot access Teacher 1's class", () => {
      cy.visit(`/classes/${classCode}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Student 3 cannot access Teacher 1's assessment page
    it("Student 3 cannot access Teacher 1's assessment page", () => {
      cy.visit(`/assessments/${assessmentId1}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
        // Student 3 cannot access Teacher 1's student results
    it("Student 3 cannot access Teacher 1's student results", () => {
      cy.visit(`/assessments/results/${student1SubmissionId}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Student 3 cannot access editor for draft assessment 1
    it("Student 3 cannot access editor for draft assessment 1", () => {
      cy.visit(`/assessments/edit/${assessmentId1}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
    // Student 3 cannot access editor for published assessment 2
    it("Student 3 cannot access editor for published assessment 2", () => {
      cy.visit(`/assessments/edit/${assessmentId2}`);
      cy.contains("You do not have access to this page or the data it contains, you will be redirected.");
      cy.url({timeout: 10000}).should("eq", Cypress.config().baseUrl + "/dashboard");
    });
  });
});
