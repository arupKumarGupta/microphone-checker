import { useEffect, useRef, useState } from 'react';

import Microphone from '../Mic';

function checkAudio(micRef, frameIdRef, volumeRef) {
	volumeRef.current = micRef.current.getVolume();
	frameIdRef.current = requestAnimationFrame(() =>
		checkAudio(micRef, frameIdRef, volumeRef)
	);
}

export default function useAudioAnalyzer(): {
	monitor: Function;
	stopMonitoring: Function;
	micState: 'good' | 'bad' | 'checking';
} {
	const [micState, setMicState] = useState<'bad' | 'good' | 'checking'>(
		'checking'
	);

	const micRef = useRef(new Microphone());

	const frameIdRef = useRef(0);
	const volumeRef = useRef<number>(0);

	const monitor = async (deviceId?: string) => {
		console.log(deviceId);
		micRef.current = new Microphone();
		setMicState('checking');
		await micRef.current.init(deviceId);
		checkAudio(micRef, frameIdRef, volumeRef);
	};
	const stopMonitoring = () => {
		cancelAnimationFrame(frameIdRef.current);
		micRef.current.audioContext.suspend();
		setMicState(volumeRef.current > 0 ? 'good' : 'bad');
	};

	return { monitor, stopMonitoring, micState };
}
