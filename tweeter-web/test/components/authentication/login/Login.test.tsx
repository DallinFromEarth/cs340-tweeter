import { MemoryRouter } from "react-router-dom"
import Login from "../../../../src/components/authentication/login/Login"
import { render, screen } from "@testing-library/react"
import React from "react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter"
import { anything, instance, mock, verify } from "ts-mockito"

library.add(fab)

describe("Login Component", () => {
    it("start with sign-in button disabled", () => {
        const { signInButton } = renderLoginAndGetElement("snakes")
        expect(signInButton).toBeDisabled()
    })

    it("sign-in button is enabled when fields are filled", async () => {
        const { signInButton, user, aliasField, passwordField } = renderLoginAndGetElement("snakes")

        await user.type(aliasField, "you are a goose")
        await user.type(passwordField, 'veryverygoodpassword')
        
        expect(signInButton).toBeEnabled();
    })

    it("if either field gets cleared, the button gets disabled", async () => {
        const { signInButton, user, aliasField, passwordField } = renderLoginAndGetElement("snakes")

        await user.type(aliasField, "steveMcGee")
        await user.type(passwordField, 'badpassword')

        await user.clear(aliasField)
        expect(signInButton).toBeDisabled()

        await user.type(aliasField, "ahhhhh")
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField) 
        expect(signInButton).toBeDisabled()
    })

    it("calls presenter login when sign-in is clicked", async () => {
        const mockPresenter = mock<LoginPresenter>()
        const mockPresenterInstance = instance(mockPresenter)

        const originalUrl = "hippos"
        const alias = "GreatBobSteven"
        const password = "decentpassword"

        const { signInButton, user, aliasField, passwordField } = renderLoginAndGetElement(originalUrl, mockPresenterInstance)

        await user.type(aliasField, alias)
        await user.type(passwordField, password)

        await user.click(signInButton)

        verify(mockPresenter.doLogin(alias,password,originalUrl, anything())).once()
    })
})

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
    return render(
    <MemoryRouter>
        {!!presenter ? 
        (
        <Login originalUrl={originalUrl} presenter={presenter} />
        ) : (
        <Login originalUrl={originalUrl} />) 
        }
    </MemoryRouter>
    );
}

const renderLoginAndGetElement = (originalUrl: string, presenter?: LoginPresenter) => {
    const user = userEvent.setup();
    renderLogin(originalUrl, presenter)

    const signInButton = screen.getByRole("button", { name: /Sign in/i })
    const aliasField = screen.getByLabelText("alias")
    const passwordField = screen.getByLabelText("password")

    return {
        signInButton,
        aliasField,
        passwordField,
        user
    }
}