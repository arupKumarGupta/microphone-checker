import React, { useMemo, useState } from 'react';

const DeviceList: React.FC<any> = ({
	deviceList,
	onDeviceSelected,
	selectedDevice,
}) => {
	return (
		<select
			value={selectedDevice}
			onChange={(e) => {
				onDeviceSelected(e.target.value);
			}}
		>
			{deviceList.map((device) => (
				<option value={device.deviceId} key={device.deviceId}>
					{device.label}
				</option>
			))}
		</select>
	);
};

export default DeviceList;
