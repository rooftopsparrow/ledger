Feature: Envelope

    The primary mechanism to budget is through virtual "envelopes" in which we
    can save money for a particular goal or expense.

  Scenario: A new goal envelope
    Given I want a new envelope
    When I label the envelope "Concert Tickets"
    And I set the envelope target amount to $200
    And I set the envelope target date to 10 days in the future
    And I choose the envelope to have a "Daily Contribution" funding schedule
    When I choose to confirm the new envelope
    Then I should see a that my envelope was created
    And I should see that I have $0 saved already
    Then I should my funding plan is $20 per day
