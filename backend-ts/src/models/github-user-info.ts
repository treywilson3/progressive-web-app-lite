import { Schema, Model, model} from 'mongoose';

export const GithubUserInfoSchema: Schema = new Schema({
  login: String,
  htmlUrl: String
});

export const GithubUserInfo: Model<any> = model<any>('GithubUserInfo', GithubUserInfoSchema);
