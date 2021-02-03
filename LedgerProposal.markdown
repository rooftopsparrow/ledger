# Introduction

Banking institutions hold our money but give us little to no tools to
manage it. Tools to make it easy to track expenses, save/fund for the
future, and prepare for the unexpected should be provided by all banking
institutions. Unfortunately, this is not the reality.

We're forced to manually track, save, and prepare our income/finances
through spreadsheets, or hand-written notes. Managing funds and
budgeting with these methods is confusing and complicated. Ideally,
incoming and outgoing funds should be managed from a central location
that interacts directly with our accounts.

Simple.com was a bank built on this idea and removed the confusion and
complication by providing a singular interface with the tools needed to
better handle your money. Setting and managing reoccurring expenses,
savings goals, and unexpected expenditures are categorized. Using these
categories, funds are organized and easy to track.

In January 2021, Simple.com announced their parent company bank BBVA was
shutting them down. Ledger is a replacement to Simple and offers similar
tools and functionality. Building upon the idea of Simple, Ledger
removes the confusion and complication from banking while promoting
financial confidence.

**Prior art:**

<https://www.simple.com/budgeting>

<https://www.firefly-iii.org>

<https://www.youneedabudget.com/the-four-rules/>

# Goals

-   Provide an application that simplifies managing finances through
    virtual "envelope method" budgeting.

-   Provide functionality that allows users to categorize their expenses
    by name or type.

-   Automatically add or remove funds from categories on a date or time
    schedule.

-   Simplify budgeting and saving by deducting expenses from available
    > income in real time.

-   Supply a graphical representation of income flow so users can
    visually track how their money is being spent.

-   Create a user interface using web platform for viewing/managing
    budgets and transactions.

## Stretch Goals

-   Mobile applications on IOS and/or Android

-   Platform hosted on a cloud platform with public site

-   Integrated with at least one bank or financial API provider (Plaid,
    Square)

-   Initiate other various banking functions (account transfer, send
    checks, etc)

-   Multiple users for an account

-   Integrate with different financial institutions for \"auto
    enveloping\" (Brokerage, Credit Cards, Loans)

# Team

Jonathan Nicholson -- Product Owner and Individual Contributor

Zachory Anguiano - Multiple roles

Brian LeProwse - Multiple roles

Khadar Mohamed -- Multiple roles

Zakaria Husein -- Multiple roles

-Roles alternate throughout timeline

# Engineering Process and Tools

1.  Life cycle

    a.  Process will be a loose agile Scrum structure

    b.  Planning/retrospectives of sprints at a weekly cadence

    c.  Daily async standup

    d.  "In Person" standups twice a week

    e.  Fortnightly demonstrations to PO and client

2.  Project management tools

    a.  GitHub Issue Repository and Project Planning

    b.  Microsoft Teams for communication

3.  Time management tools

    a.  Toggl

4.  Testing and Q/A

    a.  Goal is high coverage testing TDD

    b.  BDD automation desired as Cucumber or other specification

# Minimum Viable Product

1.  Can view an account balance and transaction history of Income and
    > Debits

    a.  Date

    b.  Merchant

    c.  "Friendly Name"

    d.  Amount

    e.  Note/memo

    f.  Category

    g.  Location

2.  Must have a way to "categorize" transactions

    a.  Categorizations should be remembered for future transactions
        from that merchant

3.  "Single Use" Envelopes (Goals)

    a.  Name

    b.  Notes/Memo

    c.  Target Amount

    d.  Target Date

4.  "Recurring Envelope" (Expenses)

    a.  Name

    b.  Notes/Memo

    c.  Target Amount

    d.  Target Date

    e.  Repeating interval

5.  Manually fund envelopes fund and fund transfers

    a.  General fund to/from envelope

    b.  Envelope to/from envelope

6.  Envelopes can be funded based on different schedules (from the
    account fund)

    a.  Daily

    b.  Every week on a day

    c.  Every other week

    d.  Monthly on a day

    e.  First/Last day of the month

    f.  Quarterly

    g.  Etc

7.  Envelopes can be used for debit transactions automatically

    a.  Based on category

    b.  Based on Merchant

8.  Envelope target progress monitoring

    a.  Display how far along the progress of an envelope is to its
        target?

    b.  If it has a funding schedule, is it going to be on time?

9.  There must be a way to determine funds that are "Safe to Spend"
    and/or if the account is "Overspent"

    a.  This number is the remaining amount after funds have been
        divvied up to envelopes.

    b.  Overspent means there are transactions without a matched
        envelope to pull from and Safe to Spend is zero

10. Demo-able and "end to end" test-able

    a.  Product should be able to be shown off to potential clients
        without real data

    b.  Fake accounts and transactions can be generated from a seed or
        on a loop

    c.  Timeframes can be manipulated and/or played faster than real
        time

    d.  Scenarios can be scripted and stepped through

11. Privacy and Security

    a.  Multiple distinct user accounts should live in separate
        databases or be partitioned in a way that it can be deleted
        easily.

    b.  All data should be encrypted, with user managed keys if
        possible.

## Stretch Goals

1.  Reporting

    a.  Money flow analysis

2.  Export CSV/TSV Transactions

    a.  Matching category?

3.  "Protected Envelopes"

    a.  These envelopes physically take money from the general fund.

    b.  You can only manually transfer out from the envelope

4.  Split Transactions into multiple

    a.  Sometimes transactions span multiple envelopes.

5.  Automatic categorization of new merchant transactions

6.  Saving Rules

    a.  Round Up transaction to Envelope

    b.  Allocate percentage of specific income category to different
        envelopes *before* hitting the general fund

7.  Bank transfers, send checks, pay bill, other regular bank-things.

Project Deliverables and Timeline

Proposed timeline:

Proposal: 01.28.21

Final Demo and Delivery: 05.15.21

  Feature   Description   Deliverable
  --------- ------------- -------------
                          
                          
                          
                          

# Deployment Plan

Initial deployment plan is to be self-hosted using unix containers for
the various pieces of infrastructure, platform, and application. A
\"Push to Deploy" mechanism to automate all required pieces for
deployment on a self-hosted solution.

Stretch goal deployment will be to incorporate cloud provider
technologies and hosting.

# Documentation and Maintenance

Developer, Operational, and API documentation will be produced and
hosted in the repository. Product Usage documentation will be produced
and provided as part of the product delivery.

Maintenance will not be provided for self-hosted solutions, except in
already developed upgrade scripts in the repository for specified
systems. New features, bug fixes, software upgrades will not be
supported outside of the proposed deliverable timeline.

Risks and Constraints

SWOT analysis

Strengths:

1.  Limited competition.

2.  Valuable financial management education.

3.  Removes complication and confusion from finances.

Weakness:

1.  Financial institution integration.

2.  Issues/problems that led to BBVA shutting Simple down.

Opportunity:

1.  Building financial fitness.

2.  Visualizing progress towards financial goals.

    a.  Managing and eliminating debt.

    b.  Available funds after bills, savings, other.

    c.  Budgeting tools and assistance.

3.  Simplifying management of finances.

Threats:

1.  Protecting sensitive data.

2.  Limited to certain institutions.

3.  Same issues/problems Simple faced
