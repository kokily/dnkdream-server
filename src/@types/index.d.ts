export const typeDefs = ["type MeResponse {\n  ok: Boolean!\n  error: String\n  me: String\n}\n\ntype Query {\n  Me: MeResponse!\n}\n\ntype Admin {\n  id: String!\n  password: String!\n}\n"];
/* tslint:disable */

export interface Query {
  Me: MeResponse;
}

export interface MeResponse {
  ok: boolean;
  error: string | null;
  me: string | null;
}

export interface Admin {
  id: string;
  password: string;
}
