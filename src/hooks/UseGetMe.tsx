"use client"
import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useAppDispatch } from '@/redux/hooks'
import { getUserData, handleUserData } from '@/redux/features/userSlice'


const UseGetMe = (enabled : boolean) => {
	const dispatch = useAppDispatch()
	useEffect( () => {
		if (!enabled) return
		const getMe = async () => {
		const {data} = await axios.get('/auth/me')
		dispatch(handleUserData(data))
		}
		getMe()
	}, [enabled])
}

export default UseGetMe