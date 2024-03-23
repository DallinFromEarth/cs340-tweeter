import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter"
import { anything, capture, instance, mock, spy, verify, when } from "ts-mockito";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let presenter: PostStatusPresenter;
    let mockStatusService: StatusService;
    const authToken = new AuthToken("cheeseMcGeeToken", Date.now());
    const user = new User("Steve", "McGee","@stevemcgee", "http://images.google.com")
    const post = "Oh no! I fell off my bicycle!"
    const now = Date.now()
    const status = new Status(post, user, now)

    beforeEach( async () => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView)

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance))
        presenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService)

        when(postStatusPresenterSpy.service).thenReturn(mockStatusServiceInstance)
    })

    it("tell the view to display a posting status message", async () => {
        await presenter.submitPost(post, authToken, user, now)
        verify(mockPostStatusView.displayInfoMessage("Posting status...",0)).once();
    })

    it("call postStatus on the post status service with the correct status string and auth token", async () => {
        await presenter.submitPost(post, authToken, user, now)
        let sentPost = capture(mockStatusService.postStatus).last()[1].post
        verify(mockStatusService.postStatus(authToken,anything())).once()
        expect(sentPost).toEqual(post)
    })

    it("tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
        await presenter.submitPost(post, authToken, user, now)
        verify(mockPostStatusView.clearLastInfoMessage()).once()
        verify(mockPostStatusView.displayInfoMessage(anything(),anything())).twice()
        verify(mockPostStatusView.setPost("")).once()
        verify(mockPostStatusView.displayErrorMessage(anything())).never()
    })

    it("when post isn't successful, show error message, and don't do anything else", async () => {
        const error = new Error("gosh diggity darn, there was an error")
        when(mockStatusService.postStatus(anything(),anything())).thenThrow(error)

        await presenter.submitPost(post, authToken, user, now)
        
        verify(mockPostStatusView.displayErrorMessage(anything())).once()
        verify(mockPostStatusView.clearLastInfoMessage()).never()
        verify(mockPostStatusView.displayInfoMessage(anything(),anything())).once()
        verify(mockPostStatusView.setPost("")).never()
    })

})