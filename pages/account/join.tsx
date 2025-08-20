import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
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

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
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

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

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
				<Box className={'mobile-header'}>
					<Box className={'logo'}>
						<img src="/img/logo/logoText.svg" alt="" />
						<span>Auto Salon</span>
					</Box>
				</Box>
				<Box className={'mobile-content'}>
					<Box className={'welcome-section'}>
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
					<Box className={'input-wrap'}>
						<div className={'input-box'}>
							<span>Nickname</span>
							<input
								type="text"
								placeholder={'Enter Nickname'}
								onChange={(e) => handleInput('nick', e.target.value)}
								required={true}
								onKeyDown={(event) => {
									if (event.key == 'Enter' && loginView) doLogin();
									if (event.key == 'Enter' && !loginView) doSignUp();
								}}
							/>
						</div>
						<div className={'input-box'}>
							<span>Password</span>
							<input
								type="password"
								placeholder={'Enter Password'}
								onChange={(e) => handleInput('password', e.target.value)}
								required={true}
								onKeyDown={(event) => {
									if (event.key == 'Enter' && loginView) doLogin();
									if (event.key == 'Enter' && !loginView) doSignUp();
								}}
							/>
						</div>
						{!loginView && (
							<div className={'input-box'}>
								<span>Phone</span>
								<input
									type="text"
									placeholder={'Enter Phone'}
									onChange={(e) => handleInput('phone', e.target.value)}
									required={true}
									onKeyDown={(event) => {
										if (event.key == 'Enter') doSignUp();
									}}
								/>
							</div>
						)}
					</Box>
					<Box className={'register'}>
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
								disabled={input.nick == '' || input.password == ''}
								onClick={doLogin}
							>
								LOGIN
							</Button>
						) : (
							<Button
								variant="contained"
								disabled={input.nick == '' || input.password == '' || input.phone == '' || input.type == ''}
								onClick={doSignUp}
								endIcon={<img src="/img/icons/rightup.svg" alt="" />}
							>
								SIGNUP
							</Button>
						)}
					</Box>
					<Box className={'ask-info'}>
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
							<Box className={'logo'}>
								<img src="/img/logo/logoText.svg" alt="" />
								<span>Auto Salon</span>
							</Box>
							<Box className={'welcome-section'}>
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
							<Box className={'input-wrap'}>
								<div className={'input-box'}>
									<span>Nickname</span>
									<input
										type="text"
										placeholder={'Enter Nickname'}
										onChange={(e) => handleInput('nick', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>
								<div className={'input-box'}>
									<span>Password</span>
									<input
										type="password"
										placeholder={'Enter Password'}
										onChange={(e) => handleInput('password', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>
								{!loginView && (
									<div className={'input-box'}>
										<span>Phone</span>
										<input
											type="text"
											placeholder={'Enter Phone'}
											onChange={(e) => handleInput('phone', e.target.value)}
											required={true}
											onKeyDown={(event) => {
												if (event.key == 'Enter') doSignUp();
											}}
										/>
									</div>
								)}
							</Box>
							<Box className={'register'}>
								{!loginView && (
									<div className={'type-option'}>
										<span className={'text'}>I want to be registered as:</span>
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
										disabled={input.nick == '' || input.password == ''}
										onClick={doLogin}
									>
										LOGIN
									</Button>
								) : (
									<Button
										variant="contained"
										disabled={input.nick == '' || input.password == '' || input.phone == '' || input.type == ''}
										onClick={doSignUp}
										endIcon={<img src="/img/icons/rightup.svg" alt="" />}
									>
										SIGNUP
									</Button>
								)}
							</Box>
							<Box className={'ask-info'}>
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
							<Box className={'car-showcase'}>
								<Box className={'car-overlay'}>
									<h2 className={'feature-title'}>Experience Luxury</h2>
									<p className={'feature-description'}>
										Discover the finest collection of premium vehicles from world-renowned brands
									</p>
									<Box className={'car-brands'}>
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
