import {DynamoDaoFactory} from "../../model/DataAccess/DynamoDao/DynamoDaoFactory";
import {AbstractDaoFactory} from "../../model/DataAccess/AbstractDaoFactory";
import {SQSEvent} from "aws-lambda";
import {UpdateFeedBatchMessage} from "../../model/messages/StatusMessages";

export const handler = async (event: SQSEvent): Promise<void> => {
    const message: UpdateFeedBatchMessage = JSON.parse(event.Records[0].body);

    const daoFactory: AbstractDaoFactory = new DynamoDaoFactory();
    const feedDao = daoFactory.getFeedDao();

    // Create batch updates array
    const updates = message.followerAliases.map(followerAlias => ({
        followerAlias,
        followeeAlias: message.authorAlias,
        timestamp: message.timestamp,
        post: message.post
    }));

    try {
        await feedDao.batchAddToFeed(updates);
    } catch (error) {
        console.error('Failed to process batch feed updates:', error);
        throw error;
    }
};
