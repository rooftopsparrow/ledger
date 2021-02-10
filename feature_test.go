package main

import "github.com/cucumber/godog"

type feature struct {
	user NewUser
}

type NewUser struct {
	Email    string
	FullName string
	Password string
}

func (f *feature) aUserDoesNotHaveAnAccountAndWantsToSignUp() error {
	user := NewUser{}
	f.user = user
	return
}

func (f *feature) theUserAsksToSignUp() error {
	return godog.ErrPending
}

func (f *feature) theUserIsSuccessfullySignedUp() error {
	return godog.ErrPending
}

func (f *feature) theUserProvidesTheirEmailAddressAs(arg1 string) error {
	return godog.ErrPending
}

func (f *feature) theUserProvidesTheirNameAs(arg1 string) error {
	return godog.ErrPending
}

func (f *feature) theUserProvidesTheirPasswordAs(arg1 string) error {
	return godog.ErrPending
}

func InitializeScenario(ctx *godog.ScenarioContext) {
	f := &feature{}
	ctx.Step(`^a user does not have an account and wants to sign up$`, f.aUserDoesNotHaveAnAccountAndWantsToSignUp)
	ctx.Step(`^the user asks to sign up$`, f.theUserAsksToSignUp)
	ctx.Step(`^the user is successfully signed up$`, f.theUserIsSuccessfullySignedUp)
	ctx.Step(`^the user provides their email address as "([^"]*)"$`, f.theUserProvidesTheirEmailAddressAs)
	ctx.Step(`^the user provides their name as "([^"]*)"$`, f.theUserProvidesTheirNameAs)
	ctx.Step(`^the user provides their password as "([^"]*)"$`, f.theUserProvidesTheirPasswordAs)
}
