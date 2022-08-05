import { useEffect, useState } from 'react';

export default function useGetDevices(): MediaDeviceInfo[] {
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

	useEffect(() => {
		const getDevices = async () => {
			try {
				await navigator.mediaDevices.getUserMedia({ audio: true });
				const devices = await navigator.mediaDevices.enumerateDevices();

				setDevices(devices);
			} catch (err) {
				console.error(err);
			}
		};
		getDevices();
	}, [setDevices]);

	return devices;
}
