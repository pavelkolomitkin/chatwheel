import {BadRequestException, Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import { AxiosResponse } from 'axios'
import {VkAuthDto} from "../dto/vk-auth.dto";
import {InjectModel} from "@nestjs/mongoose";
import {ClientUser, ClientUserDocument, SocialMediaType} from "../../core/schemas/client-user.schema";
import {Model} from "mongoose";
import {SecurityTokenService} from "./security-token.service";

@Injectable()
export class VkAuthService
{
    constructor(
        private readonly http: HttpService,
        @InjectModel(ClientUser.name) private readonly model: Model<ClientUserDocument>,
        private readonly tokenService: SecurityTokenService
    ) {
    }

    async auth(data: VkAuthDto): Promise<string | null>
    {
        // make a request to the url https://api.vk.com/method/user_ids?v=5.131&access_token=
        // @ts-ignore
        const {
            // @ts-ignore
            id,
            // @ts-ignore
            first_name,
            // @ts-ignore
            last_name,
            // @ts-ignore
            photo_50,
            // @ts-ignore
            photo_100,
            // @ts-ignore
            photo_200,
            // @ts-ignore
            photo_200_orig,
            // @ts-ignore
            photo_400_orig,
            // @ts-ignore
            about,
        } = await this.getApiUserData(data);

        // find a user with the id = data.userId and type=vk among ClientUser
        let user: ClientUserDocument = await this.getUser(id.toString());

        // if there is no one
            // create a new one with the corresponding fields received from the vk api url
            // grab the user's photo and upload it
        if (!user)
        {
            user = new this.model({
                fullName: first_name + ' ' + last_name,
                about: about,
                socialMediaType: SocialMediaType.VK,
                socialMediaUserId: id.toString(),
                socialMediaPhotos: {
                    photo_50,
                    photo_100,
                    photo_200,
                    photo_200_orig,
                    photo_400_orig,
                }
            });

            await user.save();
        }
        else
        {
            this.validateUser(user);
            user.socialMediaPhotos = {
                photo_50,
                photo_100,
                photo_200,
                photo_200_orig,
                photo_400_orig,
            };

            await user.save();
        }


        // create a new jwt token for the user
        const result: string = this.tokenService.getUserToken(user);


        // return the token
        return result;
    }

    validateUser(user: ClientUserDocument)
    {
        if (user.isBlocked)
        {
            throw new BadRequestException(`Your account has been blocked!`);
        }
    }

    getUser(vkId: string)
    {
        return this.model.findOne({
            socialMediaUserId: vkId,
            socialMediaType: SocialMediaType.VK,
        });
    }

    async getApiUserData(data: VkAuthDto): Promise<any>
    {
        const url: string = this.getAuthUrl(data);

        try {
            const data = await this.http.get(url).toPromise();
            const {
                id,
                first_name,
                last_name,
                photo_50,
                photo_100,
                photo_200,
                photo_200_orig,
                photo_400_orig,
                about
            } = data.data.response[0];
            //debugger
            return data.data.response[0];
        }
        catch (error)
        {
            throw new BadRequestException('Cannot login by VK!');
        }
    }

    getAuthUrl(data: VkAuthDto)
    {
        return 'https://api.vk.com/method/users.get?v=5.131&access_token='
            + data.accessToken
            + '&user_ids=' + data.userId
            + '&fields=' + [
                'about',
                'photo_50',
                'photo_100',
                'photo_200',
                'photo_200_orig',
                'photo_400_orig'
            ].join(',');
    }
}