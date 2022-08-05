import React, { useEffect, useMemo, useState } from 'react';
import useAudioAnalyzer from '../hooks/useAudioAnalyzer';
import useGetDevices from '../hooks/useGetDevices';
import DeviceList from './DeviceList';

interface Props {}
const MeetingChecker: React.FC<Props> = () => {
	const { monitor, stopMonitoring, micState } = useAudioAnalyzer();
	const [selectedDevice, setSelectedDevice] = useState<string>();
	const devices = useGetDevices();
	const audioDevices = useMemo(
		() =>
			devices.filter((device) => device && device.kind === 'audioinput'),
		[devices]
	);

	const onDeviceSelected = (deviceId) => {
		setSelectedDevice(deviceId);
	};

	useEffect(() => {
		monitor(selectedDevice);
		setTimeout(() => {
			stopMonitoring();
		}, 2000);
	}, [selectedDevice]);
	return (
		audioDevices.length && (
			<div>
				<DeviceList
					deviceList={audioDevices}
					onDeviceSelected={onDeviceSelected}
					selectedDevice={selectedDevice}
				/>
				{micState}
			</div>
		)
	);
};

export default MeetingChecker;
