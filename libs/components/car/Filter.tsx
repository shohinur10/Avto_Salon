import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CarCategory, CarLocation,} from '../../enums/car.enum';
import { CarsInquiry } from '../../types/car/car.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { carYear } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: CarsInquiry;
	setSearchFilter: any;
	initialInput: CarsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [carLocation, setCarLocation] = useState<CarLocation[]>(Object.values(CarLocation));
	const [carType, setCarCategory] = useState<CarCategory[]>(Object.values(CarCategory));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {

		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router.push(`/car?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, 
			`/car?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router.push(`/car?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, 
			`/car?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.doorsList?.length == 0) {
			delete searchFilter.search.doorsList;
			router.push(`/car?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, 
			`/car?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router.push(`/car?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, 
			`/car?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.seatsList?.length == 0) {
			delete searchFilter.search.seatsList;
			router.push(`/car?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, 
			`/car?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const carLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('carLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, carLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const carTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('carTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, carTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const carSeatsSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.doorsList?.includes(number)) {
						await router.push(
							`/car?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									doorsList: searchFilter?.search?.doorsList?.filter((item: Number) => item !== number),
								},
							})}`,
							`/car?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									doorsList: searchFilter?.search?.doorsList?.filter((item: Number) => item !== number),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/car?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, doorsList: [...(searchFilter?.search?.doorsList || []), number] },
							})}`,
							`/car?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, doorsList: [...(searchFilter?.search?.doorsList || []), number] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.doorsList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('carSeatsSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, carSeatsSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const carOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('carOptionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, carOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const carDoorsSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.seatsList?.includes(number)) {
						await router.push(
							`/car?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									seatsList: searchFilter?.search?.seatsList?.filter((item: Number) => item !== number),
								},
							})}`,
							`/car?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									seatsList: searchFilter?.search?.seatsList?.filter((item: Number) => item !== number),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/car?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, seatsList: [...(searchFilter?.search?.seatsList || []), number] },
							})}`,
							`/car?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, seatsList: [...(searchFilter?.search?.seatsList || []), number] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.seatsList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('carDoorsSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, carDoorsSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const carYearHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				await router.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							yearRange: { ...searchFilter.search.yearRange, start: value },
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							yearRange: { ...searchFilter.search.yearRange, start: value },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							yearRange: { ...searchFilter.search.yearRange, end: value },
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							yearRange: { ...searchFilter.search.yearRange, end: value },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const carPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/car?input=${JSON.stringify(initialInput)}`,
				`/car?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>PROPERTIES FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Home</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack
						className={`car-location`}
						style={{ height: showMore ? '253px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{carLocation.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="car-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as CarLocation)}
										onChange={carLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="car-location">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Car Type</Typography>
					{carType.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="car-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={carTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as CarCategory)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="car_type">{type}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Rooms</Typography>
					<Stack className="button-group">
						<Button
							sx={{
								borderRadius: '12px 0 0 12px',
								border: !searchFilter?.search?.doorsList ? '2px solid #181A20' : '1px solid #b9b9b9',
							}}
							onClick={() => carSeatsSelectHandler(0)}
						>
							Any
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.doorsList?.includes(1) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.doorsList?.includes(1) ? undefined : 'none',
							}}
							onClick={() => carSeatsSelectHandler(1)}
						>
							1
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.doorsList?.includes(2) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.doorsList?.includes(2) ? undefined : 'none',
							}}
							onClick={() => carSeatsSelectHandler(2)}
						>
							2
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.doorsList?.includes(3) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.doorsList?.includes(3) ? undefined : 'none',
							}}
							onClick={() => carSeatsSelectHandler(3)}
						>
							3
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.doorsList?.includes(4) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.doorsList?.includes(4) ? undefined : 'none',
								borderRight: searchFilter?.search?.doorsList?.includes(4) ? undefined : 'none',
							}}
							onClick={() => carSeatsSelectHandler(4)}
						>
							4
						</Button>
						<Button
							sx={{
								borderRadius: '0 12px 12px 0',
								border: searchFilter?.search?.doorsList?.includes(5) ? '2px solid #181A20' : '1px solid #b9b9b9',
							}}
							onClick={() => carSeatsSelectHandler(5)}
						>
							5+
						</Button>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Bedrooms</Typography>
					<Stack className="button-group">
						<Button
							sx={{
								borderRadius: '12px 0 0 12px',
								border: !searchFilter?.search?.seatsList ? '2px solid #181A20' : '1px solid #b9b9b9',
							}}
							onClick={() => carDoorsSelectHandler(0)}
						>
							Any
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.seatsList?.includes(1) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.seatsList?.includes(1) ? undefined : 'none',
							}}
							onClick={() => carDoorsSelectHandler(1)}
						>
							1
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.seatsList?.includes(2) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.seatsList?.includes(2) ? undefined : 'none',
							}}
							onClick={() => carDoorsSelectHandler(2)}
						>
							2
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.seatsList?.includes(3) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.seatsList?.includes(3) ? undefined : 'none',
							}}
							onClick={() => carDoorsSelectHandler(3)}
						>
							3
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.seatsList?.includes(4) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.seatsList?.includes(4) ? undefined : 'none',
								// borderRight: false ? undefined : 'none',
							}}
							onClick={() => carDoorsSelectHandler(4)}
						>
							4
						</Button>
						<Button
							sx={{
								borderRadius: '0 12px 12px 0',
								border: searchFilter?.search?.seatsList?.includes(5) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.seatsList?.includes(5) ? undefined : 'none',
							}}
							onClick={() => carDoorsSelectHandler(5)}
						>
							5+
						</Button>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Options</Typography>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Barter'}
							className="car-checkbox"
							color="default"
							size="small"
											value={'carBarter'}
				checked={(searchFilter?.search?.options || []).includes('carBarter')}
							onChange={carOptionSelectHandler}
						/>
						<label htmlFor={'Barter'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Barter</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Rent'}
							className="car-checkbox"
							color="default"
							size="small"
											value={'carRent'}
				checked={(searchFilter?.search?.options || []).includes('carRent')}
							onChange={carOptionSelectHandler}
						/>
						<label htmlFor={'Rent'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Rent</Typography>
						</label>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Square meter</Typography>
					<Stack className="square-year-input">
						<FormControl>
							<InputLabel id="demo-simple-select-label">Min</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.yearRange?.start ?? 0}
								label="Min"
								onChange={(e: any) => carYearHandler(e, 'start')}
								MenuProps={MenuProps}
							>
								{carYear.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.yearRange?.end || 0) < square}
										key={square}
									>
										{square}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<div className="central-divider"></div>
						<FormControl>
							<InputLabel id="demo-simple-select-label">Max</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.yearRange?.end ?? 500}
								label="Max"
								onChange={(e: any) => carYearHandler(e, 'end')}
								MenuProps={MenuProps}
							>
								{carYear.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.yearRange?.start || 0) > square}
										key={square}
									>
										{square}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									carPriceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									carPriceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
