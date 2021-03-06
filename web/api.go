package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type userForm struct {
	fullName string `form:"fullName" json:"fullName" validate:"required"`
	email    string `form:"email" json:"email" validate:"required,email"`
	password string `form:"password" json:"password" validate:""`
	confirm  string `form:"confirm" json:"confirm"`
}

func main() {
	server := echo.New()
	// Middleware
	// server.Use(middleware.Logger())
	// Routes
	server.GET("/ping", func(c echo.Context) error {
		return c.String(http.StatusOK, "pong")
	})
	server.POST("/signup", func(c echo.Context) error {
		// return c.String(http.StatusInternalServerError, "Not Implemented")
		form := new(userForm)
		if err := c.Bind(form); err != nil {
			return err
		}
		server.Logger.Infof("got form %v", form)
		return c.JSON(http.StatusCreated, form)
	})
	server.Logger.Fatal(server.Start(":8080"))
}
