import WebSocket from "isomorphic-ws";

export type ChannelSpecificCallback = (heartbeat: number) => void | Promise<void>;

export type GeneralCallback = (
	channel: string,
	heartbeat: number,
) => void | Promise<void>;

/**
 * An interface for describing the options which are needed by the HypeRateWebsocket
 *
 * @interface HypeRateWebsocketOptions
 */
export interface HypeRateWebsocketOptions {
	/**
	 * The API key of the developer
	 *
	 * @type {string}
	 * @memberof HypeRateWebsocketOptions
	 */
	apiKey: string;

	/**
	 * The list of channels which should be joined after the initial connection
	 *
	 * @type {string[]}
	 * @memberof HypeRateWebsocketOptions
	 */
	initialChannelsToJoin?: string[];

	/**
	 * The interval in milliseconds between each Phoenix heartbeat.
	 * Defaults to 15 seconds (15000 milliseconds).
	 *
	 * @type {number}
	 * @memberof HypeRateWebsocketOptions
	 */
	heartbeatInterval?: number;

	/**
	 * The interval in milliseconds between each attempt to join new channels from the queue.
	 * Defaults to 500 milliseconds.
	 *
	 * @type {number}
	 * @memberof HypeRateWebsocketOptions
	 */
	joinInterval?: number;
}

/**
 * A simple websocket implementation for the HypeRate API
 *
 * @class HypeRateWebsocket
 */
export class HypeRateWebsocket {
	/**
	 * The raw websocket
	 *
	 * @private
	 * @type {WebSocket}
	 * @memberof HypeRateWebsocket
	 */
	public socket!: WebSocket;

	/**
	 * The API key which should be used for authenticating the client to the HypeRate API
	 *
	 * @private
	 * @type {string}
	 * @memberof HypeRateWebsocket
	 */
	private readonly apiKey: string;

	/**
	 * Contains a list of all channels which should be joined when the connection was successfully established
	 *
	 * @private
	 * @type {string[]}
	 * @memberof HypeRateWebsocket
	 */
	private channelsToJoin: string[];

	/**
	 * The list of joined channels
	 *
	 * @private
	 * @type {string[]}
	 * @memberof HypeRateWebsocket
	 */
	private joinedChannels: string[];

	/**
	 * A "dictionary" of channel specific listeners
	 *
	 * @private
	 * @type {Record<string, ChannelSpecificCallback[]>}
	 * @memberof HypeRateWebsocket
	 */
	private channelSpecificListeners: Record<string, ChannelSpecificCallback[]>;

	/**
	 * An array of general listeners (listeners who receive the channel name + heartbeat)
	 *
	 * @private
	 * @type {GeneralCallback[]}
	 * @memberof HypeRateWebsocket
	 */
	private generalListeners: GeneralCallback[];

	/**
	 * The interval in milliseconds between each Phoenix heartbeat
	 *
	 * @private
	 * @type {number}
	 * @memberof HypeRateWebsocket
	 */
	private heartbeatInterval: number;

	/**
	 * Contains a number (from setInterval) for checking if the heartbeat "thread" was already started
	 *
	 * @private
	 * @type {number}
	 * @memberof HypeRateWebsocket
	 */
	private heartbeatThreadId?: number;

	/**
	 * The interval in milliseconds between each check if new channels should be joined
	 *
	 * @private
	 * @type {number}
	 * @memberof HypeRateWebsocket
	 */
	private joinInterval: number;

	/**
	 * Contains a number (from setInterval) for checking if the join channels "thread" was already started
	 *
	 * @private
	 * @type {number}
	 * @memberof HypeRateWebsocket
	 */
	private channelJoinThreadId?: number;

	/**
	 * A "dictionary" which contains the random generated "ref" and the corresponding channel which should be joined
	 *
	 * @private
	 * @type {Record<number, string>}
	 * @memberof HypeRateWebsocket
	 */
	private joinChannelRefs: Record<number, string>;

	/**
	 * Creates an instance of HypeRateWebsocket.
	 * @param {HypeRateWebsocketOptions} options The options for the HypeRateWebsocket
	 * @memberof HypeRateWebsocket
	 */
	constructor(options: HypeRateWebsocketOptions) {
		this.apiKey = options.apiKey;
		this.heartbeatInterval = options.heartbeatInterval ?? 15000;
		this.joinInterval = options.joinInterval ?? 500;
		this.joinChannelRefs = {};

		this.channelsToJoin = this.deduplicateChannels(
			options.initialChannelsToJoin ?? [],
		);
		this.joinedChannels = [];
		this.channelSpecificListeners = {};
		this.generalListeners = [];

		this.onOpen = this.onOpen.bind(this);
		this.onMessage = this.onMessage.bind(this);
		this.onError = this.onError.bind(this);
		this.onClose = this.onClose.bind(this);

		this.createConnection();
	}

	/**
	 * Returns true when the given channel is already joined. Otherwise false is returned.
	 *
	 * @param {string} channel The name of the channel to check
	 * @return {boolean} True when the channel is already joined. Otherwise false.
	 * @memberof HypeRateWebsocket
	 */
	public hasJoinedChannel(channel: string): boolean {
		return this.joinedChannels.includes(channel);
	}

	/**
	 * Returns true when the given channel is managed (either because we joined it or we need to join it). Otherwise false is returned.
	 *
	 * @param {string} channel The name of the channel to check
	 * @return {boolean} True when the channel is managed. Otherwise false.
	 * @memberof HypeRateWebsocket
	 */
	public isChannelManaged(channel: string): boolean {
		if (this.hasJoinedChannel(channel)) {
			return true;
		}

		return this.channelsToJoin.includes(channel);
	}

	/**
	 * Adds the given channel to the list of channels which should be joined
	 *
	 * @param {string} channel The name of the channel which should be added to the list of channels to join
	 * @memberof HypeRateWebsocket
	 */
	public joinChannel(channel: string) {
		if (this.isChannelManaged(channel)) {
			return;
		}

		this.channelsToJoin.push(channel);
	}

	/**
	 * Leaves a specific channel so you dont get any more updates for it
	 *
	 * @param {string} channel The name of the channel to leave
	 * @memberof HypeRateWebsocket
	 */
	public leaveChannel(channel: string) {
		this.socket.send(
			JSON.stringify({
				topic: `hr:${channel}`,
				event: 'phx_leave',
				payload: {},
				ref: 0,
			}),
		);
	}

	/**
	 * Leaves all joined channels
	 *
	 * @memberof HypeRateWebsocket
	 */
	public leaveAllChannels() {
		for (const joinedChannel of this.joinedChannels) {
			this.leaveChannel(joinedChannel);
		}
	}

	/**
	 * Starts the internal "thread" for sending the phoenix heartbeat every 15 seconds
	 *
	 * @memberof HypeRateWebsocket
	 */
	public startHeartbeatTimer() {
		if (this.heartbeatThreadId !== undefined) {
			return;
		}

		this.heartbeatThreadId = setInterval(() => {
			if (this.socket.readyState !== WebSocket.OPEN) {
				return;
			}

			this.socket.send(
				JSON.stringify({
					topic: 'phoenix',
					event: 'heartbeat',
					payload: {},
					ref: 0,
				}),
			);
		}, this.heartbeatInterval);
	}

	public startJoinTimer() {
		if (this.channelJoinThreadId !== undefined) {
			return;
		}

		this.channelJoinThreadId = setInterval(() => {
			if (this.channelsToJoin.length === 0) {
				return;
			}

			if (this.socket.readyState !== WebSocket.OPEN) {
				return;
			}

			const channelName = this.channelsToJoin.shift();
			let ref = this.generateRandomRef();

			while (this.joinChannelRefs[ref] !== undefined) {
				ref = this.generateRandomRef();
			}

			this.socket.send(
				JSON.stringify({
					topic: `hr:${channelName}`,
					event: 'phx_join',
					payload: {},
					ref,
				}),
			);

			this.joinChannelRefs[ref] = channelName!;
		}, this.joinInterval);
	}

	/**
	 * Used for adding a new general listener (a callback which receives the channel name + the heartbeat)
	 *
	 * @param {GeneralCallback} callback The callback to add
	 * @memberof HypeRateWebsocket
	 */
	public addGeneralListener(callback: GeneralCallback) {
		this.generalListeners.push(callback);
	}

	/**
	 * Used for removing a general listener
	 *
	 * @param {GeneralCallback} callback The callback to remove
	 * @memberof HypeRateWebsocket
	 */
	public removeGeneralListener(callback: GeneralCallback) {
		this.generalListeners = this.generalListeners.filter(
			(listener) => listener !== callback,
		);
	}

	/**
	 * Used for adding a channel specific listener (a callback which receives the heartbeat)
	 *
	 * @param {string} channel The name of the channel to add the callback to
	 * @param {ChannelSpecificCallback} callback The callback to add
	 * @memberof HypeRateWebsocket
	 */
	public addChannelSpecificListener(
		channel: string,
		callback: ChannelSpecificCallback,
	) {
		if (this.channelSpecificListeners[channel] === undefined) {
			this.channelSpecificListeners[channel] = [];
		}

		this.channelSpecificListeners[channel].push(callback);
	}

	/**
	 * Used for removing a channel specific listener
	 *
	 * @param {string} channel The name of the channel to remove the callback from
	 * @param {((channel: string, heartbeat: number) => void | Promise<void>)} callback The callback to remove
	 * @memberof HypeRateWebsocket
	 */
	public removeChannelSpecificListener(
		channel: string,
		callback: ChannelSpecificCallback,
	) {
		if (this.channelSpecificListeners[channel] === undefined) {
			return;
		}

		this.channelSpecificListeners[channel] = this.channelSpecificListeners[
			channel
		].filter((entry) => entry !== callback);
	}

	/**
	 * A helper method for deduplicating a list of channel names
	 *
	 * @private
	 * @param {string[]} channels The names of the channels to deduplicate
	 * @return {string[]} The deduplicated list of channel names
	 * @memberof HypeRateWebsocket
	 */
	private deduplicateChannels(channels: string[]): string[] {
		return channels.filter(
			(channelName, index) => channels.indexOf(channelName) === index,
		);
	}

	/**
	 * Resets the internal socket and tries to establish a connection with the HypeRate websocket API
	 *
	 * @private
	 * @memberof HypeRateWebsocket
	 */
	private createConnection() {
		this.socket = new WebSocket(
			`wss://app.hyperate.io/socket/websocket?token=${this.apiKey}`,
		);

		this.socket.onopen = this.onOpen;
		// @ts-ignore
		this.socket.onmessage = this.onMessage;
		this.socket.onerror = this.onError;
		this.socket.onclose = this.onClose;
	}

	/**
	 * Lifecycle callback for the internal socket
	 *
	 * @private
	 * @memberof HypeRateWebsocket
	 */
	private onOpen() {
		for (const joinedChannel of this.joinedChannels) {
			this.channelsToJoin.push(joinedChannel);
		}

		this.joinedChannels = [];

		for (const channelName of this.deduplicateChannels(
			this.channelsToJoin,
		)) {
			this.socket.send(
				JSON.stringify({
					topic: `hr:${channelName}`,
					event: 'phx_join',
					payload: {},
					ref: 0,
				}),
			);
		}
	}

	/**
	 * Lifecycle callback for the internal socket
	 *
	 * @private
	 * @param {MessageEvent} event The raw message event from the socket
	 * @memberof HypeRateWebsocket
	 */
	private async onMessage(event: MessageEvent) {
		const parsedPayload = JSON.parse(event.data);

		switch (parsedPayload.event) {
			case 'hr_update':
				const channel = parsedPayload.topic.slice(3);
				const { hr: heartbeat } = parsedPayload.payload;

				for (const generalListener of this.generalListeners) {
					await generalListener(channel, heartbeat);
				}

				if (
					Array.isArray(this.channelSpecificListeners[channel]) ===
					false
				) {
					return;
				}

				for (const listener of this.channelSpecificListeners[channel]) {
					await listener(heartbeat);
				}
				break;

			case 'phx_reply':
				const {
					ref,
					payload: { status },
				} = parsedPayload;

				if (this.joinChannelRefs[ref] === undefined) {
					return;
				}

				if (status !== 'ok') {
					return;
				}

				const channelName = this.joinChannelRefs[ref];
				delete this.joinChannelRefs[ref];

				this.channelsToJoin = this.channelsToJoin.filter(
					(channel) => channel !== channelName,
				);
				this.joinedChannels.push(channelName);

				console.log('Successfully joined channel', channelName);

				break;

			case 'phx_close':
				const { topic } = parsedPayload;
				const leftChannel = topic.slice(3);

				this.joinedChannels = this.joinedChannels.filter(
					(channel) => channel !== leftChannel,
				);

				break;

			default:
				console.log(
					`Unknown event ${parsedPayload.event}:`,
					parsedPayload,
				);

				break;
		}
	}

	/**
	 * Lifecycle callback for the internal socket.
	 *
	 * Called when an error occured on the socket
	 *
	 * @private
	 * @memberof HypeRateWebsocket
	 */
	private onError() {
		this.createConnection();
	}

	/**
	 * Lifecycle callback for the internal socket.
	 *
	 * Called when the socket looses the connection to the server.
	 *
	 * @private
	 * @memberof HypeRateWebsocket
	 */
	private onClose() {
		this.createConnection();
	}

	/**
	 * Generates a random "ref"
	 *
	 * @private
	 * @return {number} The random generated "ref"
	 * @memberof HypeRateWebsocket
	 */
	private generateRandomRef() {
		return Math.round(Math.random() * 10000);
	}
}