"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Mic, MicOff, Video, VideoOff, Loader2, CheckCircle, XCircle, PhoneOff } from "lucide-react";
import axios from "axios";

const Page = () => {
  const params = useParams();
  const roomId = params?.roomId as string;
  const userData = useAppSelector((state: RootState) => state.User.userData);
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [rejectionReason, setRejectionReason] = useState("")
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [joined, setJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [error, setError] = useState("");
  const [isMediaLoading, setIsMediaLoading] = useState(true);

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize camera/microphone preview
  useEffect(() => {
    let mounted = true;

    const initPreview = async () => {
      try {
        setIsMediaLoading(true);
        setError("");
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!mounted) {
          localStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = localStream;
        setStream(localStream);
        setIsCameraOn(true);
        setIsMicOn(true);

        if (previewRef.current) {
          previewRef.current.srcObject = localStream;
        }
      } catch (err) {
        console.error("Media permission error:", err);
        if (mounted) {
          setError("Camera or microphone permission denied.");
          setIsCameraOn(false);
          setIsMicOn(false);
        }
      } finally {
        if (mounted) {
          setIsMediaLoading(false);
        }
      }
    };

    initPreview();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (previewRef.current) {
        previewRef.current.srcObject = null;
      }
    };
  }, []);

  const toggleCamera = useCallback(() => {
    const currentStream = streamRef.current;
    if (!currentStream) return;
    setIsCameraOn((prev) => {
      const next = !prev;
      currentStream.getVideoTracks().forEach((track) => (track.enabled = next));
      return next;
    });
  }, []);

  const toggleMic = useCallback(() => {
    const currentStream = streamRef.current;
    if (!currentStream) return;
    setIsMicOn((prev) => {
      const next = !prev;
      currentStream.getAudioTracks().forEach((track) => (track.enabled = next));
      return next;
    });
  }, []);

  const handleJoinClick = useCallback(() => {
    setError("");
    if (!roomId) {
      setError("Room ID is missing from the URL.");
      return;
    }
    setJoined(true);
  }, [roomId]);

  // Approve action (called after modal confirmation)
  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await axios.post('/api/admin/video-kyc/complete', {
        roomId,
        action: "approved"
      });
      console.log(data);
      // Optionally close the call or show success message
      setShowApproveModal(false);
	  router.push('/')
      // You can also redirect or end the call here
    } catch (err) {
      console.error("Approval error:", err);
      setError("Failed to approve. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reject action
  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await axios.post('/api/admin/video-kyc/complete', {
        roomId,
        action: "rejected",
		reason : rejectionReason
      });
      console.log(data);
      setShowRejectModal(false); 
	  router.push('/')
    } catch (err) {
      console.error("Rejection error:", err);
      setError("Failed to reject. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // End call handler (e.g., leave Zego room)
  const handleEndCall = useCallback(() => {
    // Implement leave room logic if needed
    setJoined(false);
    // Optionally reload page or redirect
  }, []);

  // Join Zego call when "joined" becomes true
  useEffect(() => {
    if (!joined) return;

    let cancelled = false;

    const startCall = async () => {
      try {
        setIsJoining(true);
        setError("");

        if (!containerRef.current) {
          throw new Error("Call container is not ready.");
        }

        const { ZegoUIKitPrebuilt } = await import(
          "@zegocloud/zego-uikit-prebuilt"
        );

        if (cancelled) return;

        const appID = Number(process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID);
        const serverSecret = String(
          process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET
        );

        if (!appID || !serverSecret) {
          throw new Error("ZegoCloud environment variables are missing.");
        }

        const userId = userData?._id ? String(userData._id) : "333";
        const userName = userData?.name || "Guest";

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          userId,
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
          container: containerRef.current,
          sharedLinks: [{ name: "Copy link", url: window.location.href }],
          scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
        });

        // Stop local preview stream after joining (Zego takes over)
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
          setStream(null);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Failed to join the call.");
          setJoined(false);
        }
      } finally {
        if (!cancelled) {
          setIsJoining(false);
        }
      }
    };

    startCall();

    return () => {
      cancelled = true;
    };
  }, [joined, roomId, userData]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Optional header content */}
      </div>

      {joined && (
        <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-3">
          {userData?.role === "admin" && (
            <>
              <button
                onClick={() => setShowApproveModal(true)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 transition"
              >
                <CheckCircle size={16} />
                Approve
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 transition"
              >
                <XCircle size={16} />
                Reject
              </button>
            </>
          )}

          <button
            onClick={handleEndCall}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm flex items-center gap-2 transition"
          >
            <PhoneOff size={16} />
            End Call
          </button>
        </div>
      )}

      <div className="flex-1 relative">
        {!joined && (
          <div className="h-full flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Video Preview Container */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <video
                  ref={previewRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-[300px] sm:h-[400px] object-cover ${
                    isCameraOn ? "opacity-100" : "opacity-0"
                  }`}
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="flex flex-col items-center gap-3 text-white/80">
                      <VideoOff size={44} />
                      <p className="text-sm">Camera is turned off</p>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}
              </div>

              {/* Right side controls */}
              <div className="space-y-8 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Secure Video KYC
                </h1>
                <p className="text-white/70 max-w-xl mx-auto lg:mx-0">
                  Check your camera and microphone before joining the call.
                </p>
                {roomId && (
                  <p className="text-sm text-white/40">Room ID: {roomId}</p>
                )}

                <div className="flex justify-center lg:justify-start gap-6">
                  <button
                    onClick={toggleCamera}
                    disabled={isMediaLoading || !streamRef.current}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                      isCameraOn
                        ? "bg-white text-black"
                        : "bg-white/10 border border-white/20"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                  <button
                    onClick={toggleMic}
                    disabled={isMediaLoading || !streamRef.current}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                      isMicOn
                        ? "bg-white text-black"
                        : "bg-white/10 border border-white/20"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                </div>

                <button
                  onClick={handleJoinClick}
                  disabled={isJoining || isMediaLoading}
                  className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Joining...
                    </>
                  ) : (
                    "Join call"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {joined && <div ref={containerRef} className="w-full h-full" />}
      </div>

      {/* Confirm Approval Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-white/10">
            <h2 className="text-xl font-semibold mb-2">Confirm Approval</h2>
            <p className="text-white/70 mb-6">
              Are you sure you want to approve this KYC verification?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Partner Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-white/10">
            <h2 className="text-xl font-semibold mb-2">Reject Partner</h2>
			<textarea
    id="rejectionReason"
    value={rejectionReason}
    onChange={(e) => setRejectionReason(e.target.value)}
    placeholder="Enter the reason for rejecting this KYC request..."
    rows={5}
    className="
      w-full
      rounded-xl
      border
      border-white/20
      bg-white/5
      px-4
      py-3
      text-white
      placeholder:text-gray-500
      outline-none
      resize-none
      transition-all
      duration-200
      focus:border-red-500
      focus:ring-2
      focus:ring-red-500/30
    "
  />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;