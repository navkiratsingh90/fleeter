"use client"
import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

const page = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const userData = useAppSelector((state : RootState) => state.User.userData)
	console.log(userData);
	
	const [joined,setJoined] = useState(false)
	const [isCameraOn , setIsCameraOn] = useState(false)
	const [isMicOn , setisMicOn] = useState(false)
	const previewRef = useRef<HTMLVideoElement>(null)
	const [stream,setStream] = useState<MediaStream | null>(null) 
	const toggleCamera = () => {
		if (!stream) return
		stream.getVideoTracks().forEach((track) => track.enabled = !isCameraOn)
		setIsCameraOn(!isCameraOn)
	}
	const toggleMic = () => {
		if (!stream) return
		stream.getAudioTracks().forEach((track) => track.enabled = !isCameraOn)
		setisMicOn(!isMicOn)
	}
	useEffect(() => {
		if (joined) return
		let localStream : MediaStream
		const init = async () => {
			try {
				localStream = await navigator.mediaDevices.getUserMedia({
					video : true,
					audio : true
				})
				setStream(localStream)
				if (previewRef.current){
					previewRef.current.srcObject = localStream
				}
			} catch (error) {
				
			}
		}
		init()
	})
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
	<div className="min-h-screen bg-black text-white flex flex-col">
  <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    {/* Header Content */}
  </div>

  <div className="flex-1 relative">
    {!joined && (
      <div className="h-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            <video
              ref={previewRef}
              autoPlay
              muted
			  playsInline
              className="w-full h-[300px] sm:h-[400px] object-cover"
            />
          </div>
			{
				!isCameraOn && (
					<div className='absolute inset-0 bg-black items-center justify-center'><VideoOff size={40}/></div>
				)
			}
        </div>
		<div className='space-y-8 text-center lg:text-left'>
			<h1 className='text-3xl sm: text-4xl font-bold'> Secure Video kyc</h1>
			<div className='flex justify-center lg:justify-start gap-6'>
				<button 
				onClick={() => toggleCamera()}
				className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isCameraOn ? "bg-white text-black" : "bg-white/10 border border-white/20"}`}>{isCameraOn? <Video/> : <VideoOff/>}</button>
				<button 
				onClick={() => toggleMic()}
				className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isMicOn ? "bg-white text-black" : "bg-white/10 border border-white/20"}`}>{isMicOn? <Mic/> : <MicOff/>}</button>
			</div>
			<button 
			onClick={handleClick}
			className='w-full bg-white text-black py-4 rounded-xl font-semibold'>
				join call 
			</button>
		</div>
      </div>
    )}
  </div>
</div>
	</>
  )
}

export default page