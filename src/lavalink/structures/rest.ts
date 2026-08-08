import { Node } from "./node";
import { playOptions } from "@interfaces/rest";

export class Rest {
	private node: Node;
	private sessionId: string;
	private readonly password: string;
	private readonly url: string;

	constructor(node: Node) {
		this.node = node;
		this.url = `http${node.options.secure ? "s" : ""}://${node.options.host}:${node.options.port}`;
		this.sessionId = node.sessionId as string;
		this.password = node.options.password as string;
	}

	public setSessionId(sessionId: string): string {
		this.sessionId = sessionId;
		return this.sessionId;
	}

	public async getPlayer(guildId: string): Promise<unknown> {
		return await this.get(`/v4/sessions/${this.sessionId}/players/${guildId}`);
	}

	public async getAllPlayers(): Promise<unknown> {
		return await this.get(`/v4/sessions/${this.sessionId}/players`);
	}

	public async updatePlayer(options: playOptions): Promise<unknown> {
		return await this.patch(`/v4/sessions/${this.sessionId}/players/${options.guildId}?noReplace=false`, options.data);
	}

	public async destroyPlayer(guildId: string): Promise<unknown> {
		return await this.delete(`/v4/sessions/${this.sessionId}/players/${guildId}`);
	}

	public async updateSession(resuming: boolean, timeout: number): Promise<unknown> {
		return await this.patch(`/v4/sessions/${this.sessionId}`, { resuming, timeout });
	}

	private async request(method: string, endpoint: string, body?: unknown): Promise<unknown> {
		const url = this.url + endpoint;
		try {
			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: this.password,
				},
				body: body ? JSON.stringify(body) : undefined,
			});

			if (!response.ok) {
				const errorData: any = await response.json().catch(() => ({}));
				if (errorData?.message === "Guild not found") return [];
				if (response.status === 404) {
					this.node.destroy();
					this.node.manager.createNode(this.node.options).connect();
				}
				return false;
			}

			return await response.json().catch(() => null);
		} catch {
			return false;
		}
	}

	public async get(endpoint: string): Promise<unknown> {
		return await this.request("GET", endpoint);
	}

	public async patch(endpoint: string, body: unknown): Promise<unknown> {
		return await this.request("PATCH", endpoint, body);
	}

	public async post(endpoint: string, body: unknown): Promise<unknown> {
		return await this.request("POST", endpoint, body);
	}

	public async put(endpoint: string, body: unknown): Promise<unknown> {
		return await this.request("PUT", endpoint, body);
	}

	public async delete(endpoint: string): Promise<unknown> {
		return await this.request("DELETE", endpoint);
	}
}