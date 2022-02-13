import firebaseAnalytics from '@react-native-firebase/analytics';

import { isFDroidBuild } from '../../constants/environment';
import events from './events';

const analytics = firebaseAnalytics || '';
let crashlytics: any;
let reportCrashErrors = true;
let reportAnalyticsEvents = true;

export const getReportCrashErrorsValue = (): boolean => reportCrashErrors;
export const getReportAnalyticsEventsValue = (): boolean => reportAnalyticsEvents;

if (!isFDroidBuild) {
	crashlytics = require('@react-native-firebase/crashlytics').default;
}

export { analytics };
export { events };

export const logEvent = (eventName: string, payload?: { [key: string]: any }): void => {
	try {
		if (!isFDroidBuild) {
			analytics().logEvent(eventName, payload);
		}
	} catch {
		// Do nothing
	}
};

export const setCurrentScreen = (currentScreen: string): void => {
	if (!isFDroidBuild) {
		analytics().setCurrentScreen(currentScreen);
	}
};

export const toggleCrashErrorsReport = (value: boolean): boolean => {
	crashlytics().setCrashlyticsCollectionEnabled(value);
	return (reportCrashErrors = value);
};

export const toggleAnalyticsEventsReport = (value: boolean): boolean => {
	analytics().setAnalyticsCollectionEnabled(value);
	return (reportAnalyticsEvents = value);
};
