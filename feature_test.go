package main

import (
	"fmt"
	"math/rand"

	"github.com/cucumber/godog"
)

type feature struct {
	user *User
}

type User struct {
	ID       int64
	Email    string
	FullName string
	Password string
}

func (f *feature) aUserDoesNotHaveAnAccountAndWantsToSignUp() error {
	user := &User{}
	f.user = user
	return nil
}

func (f *feature) theUserAsksToSignUp() error {
	f.user.ID = rand.Int63()
	return nil
}

func (f *feature) theUserIsSuccessfullySignedUp() error {
	if f.user.ID == 0 {
		return fmt.Errorf("ID was not fulfilled")
	}
	return nil
}

func (f *feature) theUserProvidesTheirEmailAddressAs(email string) error {
	f.user.Email = email
	return nil
}

func (f *feature) theUserProvidesTheirNameAs(name string) error {
	f.user.FullName = name
	return nil
}

func (f *feature) theUserProvidesTheirPasswordAs(pass string) error {
	f.user.Password = pass
	return nil
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
