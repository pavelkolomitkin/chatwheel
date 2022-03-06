import { Module } from '@nestjs/common';
import {ProfileController} from './controllers/profile.controller';
import {UserInterestController} from './controllers/user-interest.controller';
import {ProfileService} from './services/profile.service';
import {UserInterestService} from './services/user-interest.service';
import {ConversationMessageController} from './controllers/conversation-message.controller';
import {UserConversationController} from './controllers/user-conversation.controller';
import {ConversationService} from './services/conversation.service';
import {ConversationMessageListService} from './services/conversation-message-list.service';
import {UserConversationService} from './services/user-conversation.service';
import {ConversationMessageService} from './services/conversation-message.service';
import {UserProfileController} from './controllers/user-profile.controller';
import {UserProfileService} from './services/user-profile.service';
import {AbuseReportService} from './services/abuse-report.service';
import {AbuseReportController} from './controllers/abuse-report.controller';
import {MessagesGateway} from './gateways/messages.gateway';
import {ConversationMessageLogService} from "./services/conversation-message-log.service";
import {UserActivityGateway} from "./gateways/user-activity.gateway";
import {CallController} from "./controllers/call.controller";
import {CallsGateway} from "./gateways/calls.gateway";
import {CallService} from "./services/call.service";
import {CallMemberService} from "./services/call-member.service";
import {CallMemberLinkService} from "./services/call-member-link.service";
import {GeoSearchController} from "./controllers/search/geo-search.controller";
import {SearchService} from "./services/search/search.service";

@Module({
    controllers: [
        ProfileController,
        UserProfileController,
        UserInterestController,
        ConversationMessageController,
        UserConversationController,
        AbuseReportController,
        CallController,
        GeoSearchController
    ],
    providers: [
        ProfileService,
        ConversationService,
        ConversationMessageListService,
        UserConversationService,
        ConversationMessageService,
        UserInterestService,
        UserProfileService,
        AbuseReportService,
        ConversationMessageLogService,
        CallService,
        CallMemberService,
        CallMemberLinkService,
        SearchService,

        MessagesGateway,
        UserActivityGateway,
        CallsGateway
    ]
})
export class ClientModule {}
