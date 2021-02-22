Feature: Account Management

    Accounts hold funds that the user wants to budget.
    Accounts are run by financial institutions

  Background: User is authenticated
    Given user "Mr. Robert Downey Jr." has signed up
    And the user is created successfully

  # Scenario: Connect To Basic Account
  #   When the user wants to link to the bank "Mega Bank Corp."
  #   And the user provides account number as 1234567890
  #   And the user provides routing number as 3333333
  #   And the user provides account password as "letmein"
  #   Then the user should see "Evil Bank Corp." has a valid connection

  Scenario Outline: View Current Balance
    Given a user's bank account is connected
    And the account has a balance of <amount> dollars
    Then the user sees the account balance is <amount> dollars

    Examples:
        | amount |
        | 237.65 |
        | 0.00 |
        | 0.01 |
        | 10000000000000.00 |
        | -43.52 |
