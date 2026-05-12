"use client"
import React, { useRef } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const page = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const handleClick = async () => {
		if (!containerRef){
			return null
		}
		try {
			const appID = Number(process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID);
			const serverSecret = String(process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET);
			const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
				appID,
				serverSecret,
				"ghp",       // room ID
				"333",       // user ID
				"Navkirat"   // user name
			  );
			const zp = ZegoUIKitPrebuilt.create(kitToken);
			// start the call
			zp.joinRoom({
			  container: containerRef.current,
			  scenario: {
				mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
			  },
			});
		} catch (error) {
			console.error(error);
			
		}
	}
  return (
	<>
		<div className = 'h-screen' ref={containerRef}>
			<button className='bg-red-700 rounded p-4 ' onClick={handleClick}>Click ME</button>
		</div>
	</>
  )
}

export default page