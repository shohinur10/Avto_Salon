import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { getJwtToken, updateUserInfo } from '../auth';

/**
 * Custom hook to initialize user authentication state on app load
 * This ensures that the user session is restored from localStorage JWT token
 */
export const useAuth = () => {
	const user = useReactiveVar(userVar);

	useEffect(() => {
		// Only run on client side
		if (typeof window !== 'undefined') {
			const token = getJwtToken();
			
			// If we have a token but no user data, restore user info
			if (token && !user._id) {
				try {
					updateUserInfo(token);
				} catch (error) {
					console.warn('Failed to restore user session:', error);
					// Token might be invalid, could clear it here if needed
				}
			}
		}
	}, []); // Run only once on mount

	return user;
};

export default useAuth;
