import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import moment from 'moment';
import { connect, useSelector } from 'react-redux';

import Markdown from '../markdown';
import { CustomIcon } from '../../lib/Icons';
import sharedStyles from '../../views/Styles';
import { themes } from '../../constants/colors';
import { formatAttachmentUrl } from '../../lib/utils';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		paddingTop: 10
	},
	messageContainer: {
		flex: 1,
		marginLeft: 10,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderBottomLeftRadius: 4,
		borderTopLeftRadius: 4
	},
	thumbnail: {
		flex: 0.25,
		width: 55,
		marginRight: 10,
		borderBottomRightRadius: 4,
		borderTopRightRadius: 4
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	username: {
		fontSize: 16,
		...sharedStyles.textMedium
	},
	time: {
		fontSize: 12,
		lineHeight: 16,
		marginLeft: 6,
		...sharedStyles.textRegular,
		fontWeight: '300'
	},
	close: {
		marginRight: 10
	}
});

interface IMessageBoxReplyPreview {
	replying: boolean;
	message: {
		ts: Date;
		msg: string;
		attachments: [
			{
				title_link?: string;
				description: string;
				image_url?: string;
				video_url?: string;
			}
		];
		u: any;
	};
	Message_TimeFormat: string;
	close(): void;
	baseUrl: string;
	username: string;
	getCustomEmoji: Function;
	theme: string;
	useRealName: boolean;
}

interface IState {
	login: {
		user: {
			id: string;
			token: string;
		};
	};
}

const ReplyPreview = React.memo(
	({
		message,
		Message_TimeFormat,
		baseUrl,
		username,
		replying,
		getCustomEmoji,
		close,
		theme,
		useRealName
	}: IMessageBoxReplyPreview) => {
		if (!replying) {
			return null;
		}

		let description;
		if (message.msg === '') {
			if (!message.attachments[0]?.description && message.attachments[0].image_url) {
				description = 'Image';
			} else if (!message.attachments[0]?.description && message.attachments[0].video_url) {
				description = 'Video';
			} else {
				description = message.attachments[0].description;
			}
		} else {
			description = message.msg;
		}
		const user = useSelector((state: IState) => state.login?.user);
		console.log({ message });
		const uri = message.attachments[0]?.image_url
			? formatAttachmentUrl(message.attachments[0]?.image_url, user.id, user.token, baseUrl)
			: null;
		const time = moment(message.ts).format(Message_TimeFormat);
		console.log({ message });
		return (
			<View style={[styles.container, { backgroundColor: themes[theme].messageboxBackground }]}>
				<View style={[styles.messageContainer, { backgroundColor: themes[theme].chatComponentBackground }]}>
					<View style={styles.header}>
						<Text style={[styles.username, { color: themes[theme].tintColor }]}>
							{useRealName ? message.u?.name : message.u?.username}
						</Text>
						<Text style={[styles.time, { color: themes[theme].auxiliaryText }]}>{time}</Text>
					</View>
					{/* @ts-ignore*/}
					<Markdown
						msg={description}
						baseUrl={baseUrl}
						username={username}
						getCustomEmoji={getCustomEmoji}
						numberOfLines={1}
						preview
						theme={theme}
					/>
				</View>
				{uri ? <Image style={styles.thumbnail} source={{ uri }} /> : null}
				<CustomIcon name='close' color={themes[theme].auxiliaryText} size={20} style={styles.close} onPress={close} />
			</View>
		);
	},
	(prevProps: any, nextProps: any) =>
		prevProps.replying === nextProps.replying &&
		prevProps.theme === nextProps.theme &&
		prevProps.message.id === nextProps.message.id
);

const mapStateToProps = (state: any) => ({
	Message_TimeFormat: state.settings.Message_TimeFormat,
	baseUrl: state.server.server,
	useRealName: state.settings.UI_Use_Real_Name
});

export default connect(mapStateToProps)(ReplyPreview);
