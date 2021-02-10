Feature: Create New User

    Users who want the product need to sign up!
    Users expect us to protect their data.

  Scenario: New User
    Given a user does not have an account and wants to sign up
    When the user provides their email address as "ledger.user@example.com"
    And the user provides their name as "Ledger User"
    And the user provides their password as "supersecret"
    When the user asks to sign up
    Then the user is successfully signed up

