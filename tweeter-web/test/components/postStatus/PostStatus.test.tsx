import { MemoryRouter } from "react-router-dom"
import PostStatus from "../../../src/components/postStatus/PostStatus"
import { render, screen } from "@testing-library/react"
import React from "react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { anything, instance, mock, verify } from "ts-mockito"
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter"
import useUserInfo from "../../../src/components/userInfo/UserInfoHook"
import { AuthToken, User } from "tweeter-shared"

library.add(fab)

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
  })); 

const testUser = new User("Steve", "McGee", "@mcgeeman", "nope.html")
const authToken = new AuthToken("afls;dkghfaw;jfh", Date.now())

describe("PostStatus Component", () => {
    beforeAll( () => {
        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: testUser,
            authToken: authToken,
          }); 
    })

    it("start with buttons disabled", () => {
        const { postStatusButton, clearStatusButton } = renderPostStatusAndGetElement()
        expect(postStatusButton).toBeDisabled()
        expect(clearStatusButton).toBeDisabled()
    })

    it("both buttons are enabled when field has text", async () => {
        const { user, postStatusButton, clearStatusButton, postStatusTextArea } = renderPostStatusAndGetElement()
        
        await user.type(postStatusTextArea, "posting post posts")
        expect(postStatusTextArea.value).toEqual("posting post posts")
        expect(clearStatusButton).toBeEnabled()
        expect(postStatusButton).toBeEnabled()
    })

    it("both buttons are disabled when text field is cleared", async () => {
        const { user, postStatusButton, clearStatusButton, postStatusTextArea } = renderPostStatusAndGetElement()
        
        await user.type(postStatusTextArea, "posting post posts")
        await user.clear(postStatusTextArea)
        expect(clearStatusButton).toBeDisabled()
        expect(postStatusButton).toBeDisabled()
    })

    it("presenter postStatus is called when button pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>()
        const mockPresenterInstance = instance(mockPresenter)

        const { user, postStatusButton, clearStatusButton, postStatusTextArea } = renderPostStatusAndGetElement(mockPresenterInstance)
        
        const post = "posting post posts about posting posts makes me annoyed this code doesn't work"

        await user.type(postStatusTextArea, post)
        await user.click(postStatusButton)

        verify(mockPresenter.submitPost(post, authToken, testUser))
    })
})

const renderPostStatus = (presenter?: PostStatusPresenter) => {
    return render(
    <MemoryRouter>
        {!!presenter ? 
        (
        <PostStatus presenter={presenter} />
        ) : (
        <PostStatus/>) 
        }
    </MemoryRouter>
    );
}

const renderPostStatusAndGetElement = (presenter?: PostStatusPresenter) => {
    const user = userEvent.setup();
    renderPostStatus()

    const postStatusTextArea : HTMLTextAreaElement = screen.getByLabelText("postStatusTextBox")
    const postStatusButton = screen.getByLabelText("post")
    const clearStatusButton = screen.getByLabelText("clear")

    return {
        postStatusButton,
        postStatusTextArea,
        clearStatusButton,
        user
    }
}