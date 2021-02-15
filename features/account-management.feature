Feature: Account Management

    Accounts hold funds that the user wants to budget.
    Accounts are run

  Background: User is authenticated
    Given user "Mr. Robert Downey Jr." exists
    And the user is logged in

  Scenario: Connect To Basic Account
    When the user wants to connect to the bank "Evil Bank Corp."
    And the user provides account number as 1234567890
    And the user provides routing number as 3333333
    And the user provides account password as "letmein"
    Then the user should see "Evil Bank Corp." has a valid connection

  Scenario Outline: View Current Balance
    Given a user's bank account is connected
    And the account has a balance of <amount>
    Then the user sees the account balance is <amount>

    Examples:
        | amount |
        | $237.65 |
        | $0.00 |
        | $0.01 |
        | $10,000,000,000,000.00 |
        | -$43.52 |
