import { DatabaseObject } from './database-object.interface';

export interface GithubUserInfo extends DatabaseObject {
    login: string;
    htmlUrl: string;
}
