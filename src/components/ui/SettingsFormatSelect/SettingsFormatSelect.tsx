import React from 'react';
import { SettingsKey } from '../../../types/settings';
import './SettingsFormatSelect.scss';

interface SettingsFormatSelectProps {
	settingsKey: SettingsKey;
	value: string[];
	customFormats: string[];
	onChange: (key: SettingsKey, value: string[]) => void;
	disabled?: boolean;
}

const SettingsFormatSelect: React.FC<SettingsFormatSelectProps> = ({
	settingsKey,
	value,
	customFormats,
	onChange,
	disabled
}) => {
	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
		onChange(settingsKey, selectedOptions);
	};

	return (
		<div className="settings-format-select">
			<select
				value={value}
				onChange={handleChange}
				disabled={disabled}
			>
				{customFormats.map((format) => (
					<option key={format} value={format}>
						{format}
					</option>
				))}
			</select>
		</div>
	);
};

export { SettingsFormatSelect };