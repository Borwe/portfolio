import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";
import { asyncRun, sleep } from "../utils/functions";
import { generatePullRequestLink, generatePullRequestLinkWithPage } from "./consts";
import { PullRequest, PullRequestData } from "./models";

const RATE_LIMIT_URL = "https://api.github.com/rate_limit";

type ResourceLimitsInfo = {
	limit: number,
	remaining: number,
	reset: number
}

type ResourceLimits = {
	resources: {
		core: ResourceLimitsInfo,
		search: ResourceLimitsInfo,
	}
}

type PRsListResponse = {
	total_count: number;
	items: Array<PullRequestData>
}

function nowInMicroSeconds(): number {
	let now = ((new Date()).valueOf() / 1000).toString();
	return parseInt(now.slice(now.search("\.")));
}

export class Api {
	axiosInstance: AxiosInstance;
	/* If false, means user didn't call init method, hence fail 
	 * using any method in this objects instance 
	 */
	initialized: boolean;
	searchInfo: ResourceLimitsInfo;
	coreInfo: ResourceLimitsInfo;

	constructor() {
		this.initialized = false;
		dotenv.config();
		const personal_key = process.env.GITHUB_PERSONAL_KEY!;
		this.axiosInstance = axios.create({
			headers: {
				"Accept": "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
				"Authorization": `Bearer ${personal_key}`
			}
		});
		this.searchInfo = {} as ResourceLimitsInfo;
		this.coreInfo = {} as ResourceLimitsInfo;
	}

	async init() {
		const [d, err] = await asyncRun(
			this.axiosInstance.get<ResourceLimits>(RATE_LIMIT_URL));
		if (err) {
			throw err;
		}
		this.searchInfo.limit = d!.data.resources.search.limit;
		this.searchInfo.reset = d!.data.resources.search.reset;
		this.searchInfo.remaining = d!.data.resources.search.remaining;
		this.coreInfo.limit = d!.data.resources.core.limit;
		this.coreInfo.reset = d!.data.resources.search.reset;
		this.coreInfo.remaining = d!.data.resources.search.remaining;


		this.initialized = true;
	}

	private async doHubSearch<T>(url: string) {
		await this.init();
		if (this.searchInfo.limit <= 0) {
			let waitTime = Math.abs(this.searchInfo.reset - nowInMicroSeconds());
			await sleep(waitTime);
		}
		let [result, err] = await asyncRun(this.axiosInstance.get<T>(url));
		while (err != undefined) {
			await this.init();
			if (this.searchInfo.limit <= 0) {
				let waitTime = Math
					.abs(this.searchInfo.reset - nowInMicroSeconds());
				await sleep(waitTime);
			}
			[result, err] = await asyncRun(this.axiosInstance.get<T>(url));
		}
		return result!;
	}


	private async doHubCore<T>(url: string) {
		await this.init();
		if (this.coreInfo.limit <= 0) {
			let waitTime = Math.abs(this.searchInfo.reset - nowInMicroSeconds());
			await sleep(waitTime);
		}
		return await asyncRun(this.axiosInstance.get<T>(url));
	}

	/**
	 * @user here is the github user account name.
	 * @all means, to get all pull requests on all pages
	 * Throws if didn't call init() atleast once on object'
	*/
	async getPullRequests(user: string, all: boolean): Promise<Array<PullRequest>> {
		if (this.initialized == false) {
			await this.init();
			this.initialized = true;
		}
		const url = generatePullRequestLink(user);
		const d = await this.doHubSearch<PRsListResponse>(url);

		let pullRequests = new Array<PullRequest>();
		d.data.items.forEach(p => pullRequests.push(new PullRequest(p)));

		if (all) {
			//get all pages
			const total_items = d.data.total_count;
			let current_page = 1;
			let next_page = current_page;
			//hold all the REST requests here
			let promises = new Array<Promise<typeof d>>();
			do {
				next_page = this.getNextPageNumberInSearch(
					current_page, total_items);
				if (next_page != current_page) {
					current_page = next_page;
					const url = generatePullRequestLinkWithPage(user, next_page);
					promises.push(this.doHubSearch<PRsListResponse>(url));
				}
			} while (next_page != current_page);

			(await Promise.all(promises)).
				forEach(x => x?.data.items.forEach(p => {
					pullRequests.push(new PullRequest(p));
				}));
		}

		return await this.setupOrgImages(pullRequests);
	}

	private async getOrgUrlInfo(pullRequest: PullRequest):
		Promise<[boolean, undefined | any]> {
		type RepoInfo = {
			owner: {
				avatar_url: string
			}
		};
		let [d, err] = await this.doHubCore<RepoInfo>(
			pullRequest.data.repository_url);
		if (err) {
			return [false, err];
		}

		pullRequest.data.org_icon = d!.data.owner.avatar_url;
		return [true, undefined];
	}

	private async setupOrgImages(pullRequests: Array<PullRequest>)
		: Promise<Array<PullRequest>> {
		let promises = new Array<Promise<[boolean, undefined | any]>>();
		for (let i = 0; i < pullRequests.length; ++i) {
			promises.push(this.getOrgUrlInfo(pullRequests[i]));
		}
		(await Promise.all(promises)).forEach(([b, er]) => {
			if (b == false) {
				throw er
			}
		});
		return pullRequests;
	}

	getNextPageNumberInSearch(current_page: number,
		total_items: number): number {
		const items_parsed = current_page * 100;
		if (total_items > items_parsed) {
			return current_page + 1;
		}
		return current_page;
	}
}
