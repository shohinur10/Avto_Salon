import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import useAuth from '../libs/hooks/useAuth';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';
import '../scss/pc/car/car-list-new.scss';

// Component to initialize auth inside ApolloProvider context
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
	useAuth(); // Initialize authentication state
	return <>{children}</>;
};

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AuthInitializer>
					<Component {...pageProps} />
				</AuthInitializer>
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
