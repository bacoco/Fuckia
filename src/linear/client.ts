export interface LinearTeam {
  id: string;
  key: string;
  name: string;
}

export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  url: string;
}

export interface LinearClient {
  listTeams(): Promise<LinearTeam[]>;
  createIssue(input: { teamId: string; title: string; description: string }): Promise<LinearIssue>;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message?: string }>;
}

export class LinearGraphQLClient implements LinearClient {
  constructor(private readonly apiKey: string, private readonly endpoint = "https://api.linear.app/graphql") {}

  async listTeams(): Promise<LinearTeam[]> {
    const data = await this.request<{ teams: { nodes: LinearTeam[] } }>(
      "query FuckiaTeams { teams { nodes { id key name } } }",
      {}
    );
    return data.teams.nodes;
  }

  async createIssue(input: { teamId: string; title: string; description: string }): Promise<LinearIssue> {
    const data = await this.request<{
      issueCreate: {
        success: boolean;
        issue: LinearIssue | null;
      };
    }>(
      [
        "mutation FuckiaIssueCreate($input: IssueCreateInput!) {",
        "  issueCreate(input: $input) {",
        "    success",
        "    issue { id identifier title url }",
        "  }",
        "}"
      ].join("\n"),
      { input }
    );

    if (!data.issueCreate.success || !data.issueCreate.issue) {
      throw new Error("Linear issueCreate returned success false.");
    }

    return data.issueCreate.issue;
  }

  private async request<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.apiKey
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      throw new Error(`Linear GraphQL HTTP ${response.status}.`);
    }

    const payload = (await response.json()) as GraphQLResponse<T>;
    if (payload.errors && payload.errors.length > 0) {
      throw new Error(payload.errors.map((error) => error.message ?? "Unknown GraphQL error").join("; "));
    }

    if (!payload.data) {
      throw new Error("Linear GraphQL response data is missing.");
    }

    return payload.data;
  }
}

