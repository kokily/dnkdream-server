export const typeDefs = ["type LoginResponse {\n  ok: Boolean!\n  error: String\n  access_token: String\n  refresh_token: String\n}\n\ntype Mutation {\n  Login(password: String!): LoginResponse!\n  Logout: LogoutResponse!\n  AddNotice(title: String!, body: String!, thumbnail: String, tags: [String]!): AddNoticeResponse!\n  RemoveNotice(id: ID!): RemoveNoticeResponse!\n  UpdateNotice(id: ID!, title: String, body: String, thumbnail: String, tags: [String]): UpdateNoticeResponse!\n}\n\ntype LogoutResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype MeResponse {\n  ok: Boolean!\n  error: String\n  me: String\n}\n\ntype Query {\n  Me: MeResponse!\n  ListNotices(title: String, tag: String, cursor: ID): ListNoticesResponse!\n  ReadNotice(id: ID!): ReadNoticeResponse!\n}\n\ntype AddNoticeResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype ListNoticesResponse {\n  ok: Boolean!\n  error: String\n  notices: [Notice]\n}\n\ntype ReadNoticeResponse {\n  ok: Boolean!\n  error: String\n  notice: Notice\n}\n\ntype RemoveNoticeResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype UpdateNoticeResponse {\n  ok: Boolean!\n  error: String\n}\n\nscalar Date\n\ntype Admin {\n  id: String!\n  password: String!\n}\n\ntype Notice {\n  id: String!\n  title: String!\n  body: String!\n  thumbnail: String\n  tags: [String]!\n  created_at: Date!\n  updated_at: Date\n}\n"];
/* tslint:disable */

export interface Query {
  Me: MeResponse;
  ListNotices: ListNoticesResponse;
  ReadNotice: ReadNoticeResponse;
}

export interface ListNoticesQueryArgs {
  title: string | null;
  tag: string | null;
  cursor: string | null;
}

export interface ReadNoticeQueryArgs {
  id: string;
}

export interface MeResponse {
  ok: boolean;
  error: string | null;
  me: string | null;
}

export interface ListNoticesResponse {
  ok: boolean;
  error: string | null;
  notices: Array<Notice> | null;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  thumbnail: string | null;
  tags: Array<string>;
  created_at: Date;
  updated_at: Date | null;
}

export type Date = any;

export interface ReadNoticeResponse {
  ok: boolean;
  error: string | null;
  notice: Notice | null;
}

export interface Mutation {
  Login: LoginResponse;
  Logout: LogoutResponse;
  AddNotice: AddNoticeResponse;
  RemoveNotice: RemoveNoticeResponse;
  UpdateNotice: UpdateNoticeResponse;
}

export interface LoginMutationArgs {
  password: string;
}

export interface AddNoticeMutationArgs {
  title: string;
  body: string;
  thumbnail: string | null;
  tags: Array<string>;
}

export interface RemoveNoticeMutationArgs {
  id: string;
}

export interface UpdateNoticeMutationArgs {
  id: string;
  title: string | null;
  body: string | null;
  thumbnail: string | null;
  tags: Array<string> | null;
}

export interface LoginResponse {
  ok: boolean;
  error: string | null;
  access_token: string | null;
  refresh_token: string | null;
}

export interface LogoutResponse {
  ok: boolean;
  error: string | null;
}

export interface AddNoticeResponse {
  ok: boolean;
  error: string | null;
}

export interface RemoveNoticeResponse {
  ok: boolean;
  error: string | null;
}

export interface UpdateNoticeResponse {
  ok: boolean;
  error: string | null;
}

export interface Admin {
  id: string;
  password: string;
}
