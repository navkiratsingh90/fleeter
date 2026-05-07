import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useAppDispatch } from '@/redux/hooks'
import { getUserData } from '@/redux/features/userSlice'


const UseGetMe = (enabled : boolean) => {
	const dispatch = useAppDispatch()
	useEffect( () => {
		if (!enabled) return
		const getMe = async () => {
		const {data} = await axios.get('/')
		dispatch(getUserData(data))
		}
		getMe()
	}, [enabled])
}

export default UseGetMe