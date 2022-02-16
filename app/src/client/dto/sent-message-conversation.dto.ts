import {Transform} from "class-transformer";
import {IsNotEmpty, MaxLength, Validate} from "class-validator";
import {IsUserConversationMemberValidator} from "../validators/is-user-conversation-member.validator";
import {IsUserBannedByAddresseeValidator} from "../validators/is-user-banned-by-addressee.validator";
import {EntityExistsValidator} from "../../core/validators/entity-exists.validator";
import {Conversation} from "../../core/schemas/conversation.schema";

export class SentMessageConversationDto
{

    @IsNotEmpty()
    @Validate(EntityExistsValidator, [Conversation.name, 'id'], { message: 'Conversation is not found!' })
    @Validate(IsUserConversationMemberValidator)
    @Validate(IsUserBannedByAddresseeValidator, [{ context: IsUserBannedByAddresseeValidator.CONVERSATION_CONTEXT }])
    conversationId: string;

    @Transform(({value}) => value.trim())
    @IsNotEmpty()
    @MaxLength(1000)
    text: string
}