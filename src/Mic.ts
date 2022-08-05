const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
export default class Microphone {
	initialized: boolean = false;
	audioContext: AudioContext;
	analyser: AnalyserNode;
	source: AudioNode;
	bufferLength: number;
	dataArray: Uint8Array;

	constructor() {
		this.initialized = false;
		this.audioContext = audioContext;
	}
	async init(deviceId?: string) {
		let audioOptions = deviceId ? { deviceId } : true;
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: audioOptions,
		});

		if (this.audioContext.state === 'suspended') {
			try {
				await this.audioContext.resume();
			} catch (e) {
				console.error(e);
			}
			console.log('resumed');
		}

		this.analyser = analyser;
		console.log(stream.getAudioTracks());

		this.source = this.audioContext.createMediaStreamSource(stream);

		this.source.connect(this.analyser);
		this.analyser.fftSize = 512;
		this.bufferLength = this.analyser.frequencyBinCount;
		this.dataArray = new Uint8Array(this.bufferLength);
		this.initialized = true;
		return Promise.resolve(this.initialized);
	}

	getSamples() {
		if (this.initialized) {
			this.analyser.getByteTimeDomainData(this.dataArray);
		}
		return [...this.dataArray].map((e) => e / 128 - 1);
	}
	getVolume() {
		if (this.initialized) {
			this.analyser.getByteTimeDomainData(this.dataArray);
		}
		const normalisedDataArr = [...this.dataArray].map((e) => e / 128 - 1);
		const sum = normalisedDataArr.reduce((s, c) => s + c * c, 0);
		return Math.sqrt(sum / normalisedDataArr.length);
	}
}
