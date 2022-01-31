describe("Login", () => {
	it("cypress user logs in successfully", () => {
		cy.visit("/login/");
		cy.get("input[name=username]").type(Cypress.env("username"));
		cy.get("input[name=password]").type(Cypress.env("password") + "{enter}");
		cy.url().should("include", "/dashboard/sites");
	});
});
