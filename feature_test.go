package main

import (
	"math/rand"
	"time"

	"github.com/cucumber/godog"
)

var user 

type User struct {
	ID       uint64
	Email    string
	FullName string
	Password string
	Session  string
}

func aUserDoesNotHaveAnAccountAndWantsToSignUp() error {
	return nil
}

func theUserAsksToSignUp() error {
	user.ID = rand.Uint64()
	return nil
}

func theUserProvidesTheirEmailAddressAs(email string) error {
	user.Email = email
	return nil
}

func theUserProvidesTheirNameAs(name string) error {
	user.FullName = name
	return nil
}

func theUserProvidesTheirPasswordAs(pass string) error {
	user.Password = pass
	return nil
}

func theUserAttemptsToLogin() error {
	return godog.ErrPending
}

func theUserDecidesToLogout() error {
	return godog.ErrPending
}

func theUserDoesNotHaveAValidSession() error {
	return godog.ErrPending
}

func theUserHasAValidSessionForDuration(d string) error {
	duration, err := time.ParseDuration(d)
	if err != nil {
		return err
	}
	return godog.ErrPending
}

func theUserHasAValidSession() error {
	return godog.ErrPending
}

func InitializeTestSuite(ctx *godog.TestSuiteContext) {
	ctx.BeforeSuite(func() {
		user = User{}
	})
}

func InitializeScenario(ctx *godog.ScenarioContext) {
	// clean the state before every scenario
	ctx.BeforeScenario(func(*godog.Scenario) {
		user = User{}
	})
	ctx.Step(`^a user does not have an account and wants to sign up$`, aUserDoesNotHaveAnAccountAndWantsToSignUp)
	ctx.Step(`^the user asks to sign up$`, theUserAsksToSignUp)
	ctx.Step(`^the user provides their email address as "([^"]*)"$`, theUserProvidesTheirEmailAddressAs)
	ctx.Step(`^the user provides their name as "([^"]*)"$`, theUserProvidesTheirNameAs)
	ctx.Step(`^the user provides their password as "([^"]*)"$`, theUserProvidesTheirPasswordAs)
	ctx.Step(`^the user attempts to login$`, theUserAttemptsToLogin)
	ctx.Step(`^the user decides to logout$`, theUserDecidesToLogout)
	ctx.Step(`^the user does not have a valid session$`, theUserDoesNotHaveAValidSession)
	ctx.Step(`^the user has a valid session for "([^"]*)"$`, theUserHasAValidSessionForDuration)
	ctx.Step(`^the user has a valid session$`, theUserHasAValidSession)
}
