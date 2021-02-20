package main

import (
	"flag"
	"os"
	"testing"

	"github.com/cucumber/godog"
	"github.com/cucumber/godog/colors"
	"github.com/go-pg/pg/v10"
	"github.com/joho/godotenv"
	db "msudenver.edu/ledger/db"
	"msudenver.edu/ledger/repos"
)

type UserForm struct {
	name     string
	email    string
	password string
	confirm  string
}

type Env struct {
	db       *pg.DB
	userForm *UserForm
	users    *repos.UserRepo
	user     *repos.User
}

var e *Env

func aUserDoesNotHaveAnAccountAndWantsToSignUp() error {
	e.userForm = new(UserForm)
	return nil
}

func theUserAsksToSignUp() error {
	u, err := e.users.CreateUser(e.userForm.name, e.userForm.email)
	if err != nil {
		return err
	}
	e.user = u
	return nil
}

func theUserProvidesTheirEmailAddressAs(email string) error {
	e.userForm.email = email
	return nil
}

func theUserProvidesTheirNameAs(name string) error {
	e.userForm.name = name
	return nil
}

func theUserProvidesTheirPasswordAs(pass string) error {
	e.userForm.password = pass
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
	return godog.ErrPending
}

func theUserHasAValidSession() error {
	return godog.ErrPending
}

func theAccountHasABalanceOf(amount int64) error {
	return godog.ErrPending
}

func theUserIsLoggedIn() error {
	return godog.ErrPending
}

func theUserProvidesAccountNumberAs(arg1 int) error {
	return godog.ErrPending
}

func theUserProvidesAccountPasswordAs(password string) error {
	return godog.ErrPending
}

func theUserProvidesRoutingNumberAs(amount int) error {
	return godog.ErrPending
}

func theUserShouldSeeHasAValidConnection(arg1 string) error {
	return godog.ErrPending
}

func theUserWantsToConnectToTheBank(arg1 string) error {
	return godog.ErrPending
}

func theAccountHasABalanceOfDollars(balance float64) error {
	return godog.ErrPending
}

func theUserSeesTheAccountBalanceIsDollars(balance float64) error {
	return godog.ErrPending
}

func userExists(arg1 string) error {
	return godog.ErrPending
}

func aUsersBankAccountIsConnected() error {
	return godog.ErrPending
}

func InitializeTestSuite(ctx *godog.TestSuiteContext) {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
}

func InitializeScenario(ctx *godog.ScenarioContext) {
	// clean the state before every scenario

	ctx.BeforeScenario(func(sc *godog.Scenario) {
		db := db.Init()
		if err := repos.CreateSchema(db); err != nil {
			panic(err)
		}
		e = new(Env)
		e.db = db
		e.users = &repos.UserRepo{DB: db}
	})

	ctx.AfterScenario(func(sc *godog.Scenario, err error) {
		e.db.Close()
	})

	ctx.Step(`^the user is new and wants to sign up$`, aUserDoesNotHaveAnAccountAndWantsToSignUp)
	ctx.Step(`^the account has a balance of (-?\d+\.\d{2}) dollars$`, theAccountHasABalanceOfDollars)
	ctx.Step(`^the user sees the account balance is (-?\d+\.\d{2}) dollars$`, theUserSeesTheAccountBalanceIsDollars)
	ctx.Step(`^the user asks to sign up$`, theUserAsksToSignUp)
	ctx.Step(`^the user provides their email address as "([^"]*)"$`, theUserProvidesTheirEmailAddressAs)
	ctx.Step(`^the user provides their name as "([^"]*)"$`, theUserProvidesTheirNameAs)
	ctx.Step(`^the user provides their password as "([^"]*)"$`, theUserProvidesTheirPasswordAs)
	ctx.Step(`^the user attempts to login$`, theUserAttemptsToLogin)
	ctx.Step(`^the user decides to logout$`, theUserDecidesToLogout)
	ctx.Step(`^the user does not have a valid session$`, theUserDoesNotHaveAValidSession)
	ctx.Step(`^the user has a valid session for "([^"]*)"$`, theUserHasAValidSessionForDuration)
	ctx.Step(`^the user has a valid session$`, theUserHasAValidSession)
	ctx.Step(`^the user is logged in$`, theUserIsLoggedIn)
	ctx.Step(`^the user provides account number as (\d+)$`, theUserProvidesAccountNumberAs)
	ctx.Step(`^the user provides account password as "([^"]*)"$`, theUserProvidesAccountPasswordAs)
	ctx.Step(`^the user provides routing number as (-?\d+)$`, theUserProvidesRoutingNumberAs)
	ctx.Step(`^the user should see "([^"]*)" has a valid connection$`, theUserShouldSeeHasAValidConnection)
	ctx.Step(`^the user wants to connect to the bank "([^"]*)"$`, theUserWantsToConnectToTheBank)
	ctx.Step(`^the user "([^"]*)" exists$`, userExists)
	ctx.Step(`^a user\'s bank account is connected$`, aUsersBankAccountIsConnected)
	ctx.Step(`^user "([^"]*)" exists$`, userExists)
}

var opts = godog.Options{
	Output: colors.Colored(os.Stdout),
	Format: "progress", // can define default values
}

func init() {
	godog.BindFlags("godog.", flag.CommandLine, &opts) // godog v0.10.0 and earlier
	godog.BindCommandLineFlags("godog.", &opts)        // godog v0.11.0 (latest)
}

func TestMain(m *testing.M) {
	flag.Parse()
	opts.Paths = flag.Args()

	status := godog.TestSuite{
		Name:                 "godogs",
		TestSuiteInitializer: InitializeTestSuite,
		ScenarioInitializer:  InitializeScenario,
		Options:              &opts,
	}.Run()

	// Optional: Run `testing` package's logic besides godog.
	if st := m.Run(); st > status {
		status = st
	}

	os.Exit(status)
}
