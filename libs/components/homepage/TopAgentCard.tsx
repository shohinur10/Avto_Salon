import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopAgentProps {
	agent: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	const roundCardStyle = {
		borderRadius: '50px',
		background: '#ffffff',
		boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
		border: '2px solid rgba(212, 175, 55, 0.1)',
		height: '320px',
		width: '280px',
		padding: '40px 30px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		margin: '0 auto',
		textAlign: 'center',
		cursor: 'pointer',
		transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
		position: 'relative',
		overflow: 'hidden',
		backdropFilter: 'blur(10px)'
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card mobile-round-card" style={roundCardStyle}>
				<div className="agent-image-container">
					<img src={agentImage} alt={agent?.memberNick} />
				</div>
				<div className="agent-info">
					<strong>{agent?.memberNick}</strong>
					<span>{agent?.memberType}</span>
				</div>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card desktop-round-card" style={roundCardStyle}>
				<div className="agent-image-container">
					<img src={agentImage} alt={agent?.memberNick} />
				</div>
				<div className="agent-info">
					<strong>{agent?.memberNick}</strong>
					<span>{agent?.memberType}</span>
				</div>
			</Stack>
		);
	}
};

export default TopAgentCard;
