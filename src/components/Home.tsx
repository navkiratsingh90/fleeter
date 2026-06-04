import React, { useEffect } from 'react'
import HeroSection from './HeroSection'
import VehicleSlider from './VehicleSlider'
import { getSocket } from '@/lib/socket'
import { useAppSelector } from '@/redux/hooks'
import { RootState } from '@/redux/store'

const Home = () => {
	const userData = useAppSelector((state : RootState) => state.User.userData)
	
	return (
		<>
			<HeroSection/>
			<VehicleSlider/>
		</>
	)	
}

export default Home