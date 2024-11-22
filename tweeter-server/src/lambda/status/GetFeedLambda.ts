import { PagedItemRequest, PagedItemResponse, StatusDTO } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PagedItemRequest<StatusDTO>): Promise<PagedItemResponse<StatusDTO>> => {
    const statusService = new StatusService();
    const [items, hasMore] =  await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem) 

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore,
    }
}