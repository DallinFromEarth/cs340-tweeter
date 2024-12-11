import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import {PostStatusMessage, UpdateFeedBatchMessage} from "../../model/messages/StatusMessages";
import { SQSEvent } from "aws-lambda";
import {AbstractDaoFactory} from "../../model/DataAccess/AbstractDaoFactory";
import {DynamoDaoFactory} from "../../model/DataAccess/DynamoDao/DynamoDaoFactory";

const sqsClient = new SQSClient({ region: "us-west-1" });
const FEED_UPDATE_QUEUE_URL = "https://sqs.us-west-1.amazonaws.com/378503310330/tweeter-update-feed";
const FOLLOWER_READ_BATCH_SIZE = 100
const daoFactory: AbstractDaoFactory = new DynamoDaoFactory()

export const handler = async (event: SQSEvent): Promise<void> => {
    for (const record of event.Records) {
        const message: PostStatusMessage = JSON.parse(record.body);

        // Track pagination through followers
        let lastItem: string | undefined = undefined;
        let hasMore = true;

        // Process followers in batches
        while (hasMore) {
            // Get a page of followers
            const [followers, more] = await daoFactory.getFollowDao().getNextFollowersPage(
                message.authorAlias,
                FOLLOWER_READ_BATCH_SIZE,
                lastItem ? lastItem : undefined)

            if (followers.length > 0) {
                // Create update feed message for this batch
                const updateFeedMessage: UpdateFeedBatchMessage = {
                    authorAlias: message.authorAlias,
                    post: message.post,
                    timestamp: message.timestamp,
                    followerAliases: followers.map(f => f.toString())
                };

                // Send to update-feed queue
                const command = new SendMessageCommand({
                    QueueUrl: FEED_UPDATE_QUEUE_URL,
                    MessageBody: JSON.stringify(updateFeedMessage)
                });

                await sqsClient.send(command);
            }

            hasMore = more;
            if (followers.length > 0) {
                lastItem = followers[followers.length - 1].toString();
            }
        }
    }
};
