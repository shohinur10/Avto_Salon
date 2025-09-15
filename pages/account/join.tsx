import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack, Typography, IconButton, InputAdornment, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [errors, setErrors] = useState({ nick: '', password: '', phone: '' });

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
		// Clear errors when switching views
		setErrors({ nick: '', password: '', phone: '' });
		// Clear inputs when switching views for better UX
		setInput({ nick: '', password: '', phone: '', type: 'USER' });
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'USER');
		}
	};

	const validateInput = (name: string, value: string) => {
		let error = '';
		
		switch (name) {
			case 'nick':
				if (value.length < 3) {
					error = 'Nickname must be at least 3 characters';
				} else if (value.length > 20) {
					error = 'Nickname must be less than 20 characters';
				}
				break;
			case 'password':
				if (value.length < 6) {
					error = 'Password must be at least 6 characters';
				}
				break;
			case 'phone':
				if (value.length < 10) {
					error = 'Please enter a valid phone number';
				}
				break;
		}
		
		setErrors(prev => ({ ...prev, [name]: error }));
		return error === '';
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
		validateInput(name, value);
	}, []);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const doLogin = useCallback(async () => {
		console.warn(input);
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		console.warn(input);
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	console.log('+input: ', input);

	if (device === 'mobile') {
		return (
			<Stack className={'join-page-mobile'}>
				<Box component="div"    className={'mobile-header'}>
					<Box component="div"    className={'logo'}>
						<img src="/img/logo/logoText.svg" alt="" />
						<span>Auto Salon</span>
					</Box>
				</Box>
				<Box component="div"    className={'mobile-content'}>
					<Box component="div"    className={'welcome-section'}>
						<h1 className={'main-title'}>
							{loginView ? 'Welcome Back' : 'Join Us'}
						</h1>
						<p className={'subtitle'}>
							{loginView 
								? 'Sign in to explore luxury vehicles' 
								: 'Create your account for exclusive access'
							}
						</p>
					</Box>
					<Box component="div"    className={'input-wrap'}>
						<div className={'input-box'}>
							<span>Nickname</span>
							<input
								type="text"
								placeholder={'Enter Nickname'}
								value={input.nick}
								onChange={(e) => handleInput('nick', e.target.value)}
								required={true}
								onKeyDown={(event) => {
									if (event.key == 'Enter' && loginView) doLogin();
									if (event.key == 'Enter' && !loginView) doSignUp();
								}}
								style={{
									borderColor: errors.nick ? '#ff4444' : input.nick.length > 0 && !errors.nick ? '#44ff44' : '#E8E8E8'
								}}
							/>
							{errors.nick && (
								<Typography variant="caption" color="error" style={{ marginTop: '5px', display: 'block' }}>
									{errors.nick}
								</Typography>
							)}
						</div>
						<div className={'input-box'}>
							<span>Password</span>
							<div style={{ position: 'relative' }}>
								<input
									type={showPassword ? "text" : "password"}
									placeholder={'Enter Password'}
									value={input.password}
									onChange={(e) => handleInput('password', e.target.value)}
									required={true}
									autoComplete="current-password"
									onKeyDown={(event) => {
										if (event.key == 'Enter' && loginView) doLogin();
										if (event.key == 'Enter' && !loginView) doSignUp();
									}}
									style={{
										paddingRight: '50px',
										borderColor: errors.password ? '#ff4444' : input.password.length > 0 && !errors.password ? '#44ff44' : '#E8E8E8'
									}}
								/>
								<IconButton
									onClick={togglePasswordVisibility}
									style={{
										position: 'absolute',
										right: '10px',
										top: '50%',
										transform: 'translateY(-50%)',
										color: '#666'
									}}
									size="small"
								>
									{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
								</IconButton>
							</div>
							{errors.password && (
								<Typography variant="caption" color="error" style={{ marginTop: '5px', display: 'block' }}>
									{errors.password}
								</Typography>
							)}
						</div>
						{!loginView && (
							<div className={'input-box'}>
								<span>Phone</span>
								<input
									type="tel"
									placeholder={'Enter Phone'}
									value={input.phone}
									onChange={(e) => handleInput('phone', e.target.value)}
									required={true}
									onKeyDown={(event) => {
										if (event.key == 'Enter') doSignUp();
									}}
									style={{
										borderColor: errors.phone ? '#ff4444' : input.phone.length > 0 && !errors.phone ? '#44ff44' : '#E8E8E8'
									}}
								/>
								{errors.phone && (
									<Typography variant="caption" color="error" style={{ marginTop: '5px', display: 'block' }}>
										{errors.phone}
									</Typography>
								)}
							</div>
						)}
					</Box>
					<Box component="div"    className={'register'}>
						{!loginView && (
							<div className={'type-option'}>
								<span className={'text'}>Register as:</span>
								<div>
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox
													size="small"
													name={'USER'}
													onChange={checkUserTypeHandler}
													checked={input?.type == 'USER'}
												/>
											}
											label="User"
										/>
									</FormGroup>
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox
													size="small"
													name={'AGENT'}
													onChange={checkUserTypeHandler}
													checked={input?.type == 'AGENT'}
												/>
											}
											label="Agent"
										/>
									</FormGroup>
								</div>
							</div>
						)}
						{loginView && (
							<div className={'remember-info'}>
								<FormGroup>
									<FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Remember me" />
								</FormGroup>
							</div>
						)}
						{loginView ? (
							<Button
								variant="contained"
								endIcon={<img src="/img/icons/rightup.svg" alt="" />}
								disabled={
									input.nick == '' || 
									input.password == '' || 
									errors.nick !== '' || 
									errors.password !== ''
								}
								onClick={doLogin}
							>
								LOGIN
							</Button>
						) : (
							<Button
								variant="contained"
								disabled={
									input.nick == '' || 
									input.password == '' || 
									input.phone == '' || 
									input.type == '' ||
									errors.nick !== '' || 
									errors.password !== '' || 
									errors.phone !== ''
								}
								onClick={doSignUp}
								endIcon={<img src="/img/icons/rightup.svg" alt="" />}
							>
								SIGNUP
							</Button>
						)}
					</Box>
					<Box component="div"    className={'ask-info'}>
						{loginView ? (
							<p>
								Not registered yet?
								<b
									onClick={() => {
										viewChangeHandler(false);
									}}
								>
									SIGNUP
								</b>
							</p>
						) : (
							<p>
								Have account?
								<b onClick={() => viewChangeHandler(true)}> LOGIN</b>
							</p>
						)}
					</Box>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main'}>
						<Stack className={'left'}>
							{/* @ts-ignore */}
							<Box component="div"    className={'logo'}>
								<img src="/img/logo/logoText.svg" alt="" />
								<span>Auto Salon</span>
							</Box>
							<Box component="div"    className={'welcome-section'}>
								<h1 className={'main-title'}>
									{loginView ? 'Welcome Back' : 'Join Our Community'}
								</h1>
								<p className={'subtitle'}>
									{loginView 
										? 'Sign in to explore premium luxury vehicles' 
										: 'Create your account to discover exclusive automotive experiences'
									}
								</p>
							</Box>
							<Box component="div"    className={'input-wrap'}>
								<div className={'input-box'}>
									<span>Nickname</span>
									<input
										type="text"
										placeholder={'Enter Nickname'}
										value={input.nick}
										onChange={(e) => handleInput('nick', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
										style={{
											borderColor: errors.nick ? '#ff4444' : input.nick.length > 0 && !errors.nick ? '#44ff44' : '#E8E8E8'
										}}
									/>
									{errors.nick && (
										<Typography variant="caption" color="error" style={{ marginTop: '5px', display: 'block' }}>
											{errors.nick}
										</Typography>
									)}
								</div>
								<div className={'input-box'}>
									<span>Password</span>
									<div style={{ position: 'relative' }}>
										<input
											type={showPassword ? "text" : "password"}
											placeholder={'Enter Password'}
											value={input.password}
											onChange={(e) => handleInput('password', e.target.value)}
											required={true}
											autoComplete="current-password"
											onKeyDown={(event) => {
												if (event.key == 'Enter' && loginView) doLogin();
												if (event.key == 'Enter' && !loginView) doSignUp();
											}}
											style={{
												paddingRight: '50px',
												borderColor: errors.password ? '#ff4444' : input.password.length > 0 && !errors.password ? '#44ff44' : '#E8E8E8'
											}}
										/>
										<IconButton
											onClick={togglePasswordVisibility}
											style={{
												position: 'absolute',
												right: '10px',
												top: '50%',
												transform: 'translateY(-50%)',
												color: '#666'
											}}
											size="small"
										>
											{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
										</IconButton>
									</div>
									{errors.password && (
										<Typography variant="caption" color="error" style={{ marginTop: '5px', display: 'block' }}>
											{errors.password}
										</Typography>
									)}
								</div>
								{!loginView && (
									<div className={'input-box'}>
										<span>Phone</span>
										<input
											type="tel"
											placeholder={'Enter Phone'}
											value={input.phone}
											onChange={(e) => handleInput('phone', e.target.value)}
											required={true}
											onKeyDown={(event) => {
												if (event.key == 'Enter') doSignUp();
											}}
											style={{
												borderColor: errors.phone ? '#ff4444' : input.phone.length > 0 && !errors.phone ? '#44ff44' : '#E8E8E8'
											}}
										/>
										{errors.phone && (
											<Typography variant="caption" color="error" style={{ marginTop: '5px', display: 'block' }}>
												{errors.phone}
											</Typography>
										)}
									</div>
								)}
							</Box>
							<Box component="div"    className={'register'}>
								{!loginView && (
									<div className={'type-option'}>
										<span className={'text'}>Register as:</span>
										<div>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name={'USER'}
															onChange={checkUserTypeHandler}
															checked={input?.type == 'USER'}
														/>
													}
													label="User"
												/>
											</FormGroup>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name={'AGENT'}
															onChange={checkUserTypeHandler}
															checked={input?.type == 'AGENT'}
														/>
													}
													label="Agent"
												/>
											</FormGroup>
										</div>
									</div>
								)}

								{loginView && (
									<div className={'remember-info'}>
										<FormGroup>
											<FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Remember me" />
										</FormGroup>
										<a>Lost your password?</a>
									</div>
								)}

								{loginView ? (
									<Button
										variant="contained"
										endIcon={<img src="/img/icons/rightup.svg" alt="" />}
										disabled={
											input.nick == '' || 
											input.password == '' || 
											errors.nick !== '' || 
											errors.password !== ''
										}
										onClick={doLogin}
									>
										LOGIN
									</Button>
								) : (
									<Button
										variant="contained"
										disabled={
											input.nick == '' || 
											input.password == '' || 
											input.phone == '' || 
											input.type == '' ||
											errors.nick !== '' || 
											errors.password !== '' || 
											errors.phone !== ''
										}
										onClick={doSignUp}
										endIcon={<img src="/img/icons/rightup.svg" alt="" />}
									>
										SIGNUP
									</Button>
								)}
							</Box>
							<Box component="div"    className={'ask-info'}>
								{loginView ? (
									<p>
										Not registered yet?
										<b
											onClick={() => {
												viewChangeHandler(false);
											}}
										>
											SIGNUP
										</b>
									</p>
								) : (
									<p>
										Have account?
										<b onClick={() => viewChangeHandler(true)}> LOGIN</b>
									</p>
								)}
							</Box>
						</Stack>
						<Stack className={'right'}>
							<Box component="div"    className={'car-showcase'}>
								<Box component="div"    className={'car-overlay'}>
									<h2 className={'feature-title'}>Experience Luxury</h2>
									<p className={'feature-description'}>
										Discover the finest collection of premium vehicles from world-renowned brands
									</p>
									<Box component="div"    className={'car-brands'}>
										<img src="/img/brands/MERCEDES.svg" alt="Mercedes" />
										<img src="/img/brands/BMW.svg" alt="BMW" />
										<img src="/img/brands/AUDI.svg" alt="Audi" />
										<img src="/img/brands/PORSCHE.svg" alt="Porsche" />
									</Box>
								</Box>
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
