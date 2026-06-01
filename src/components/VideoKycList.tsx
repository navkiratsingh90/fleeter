// components/admin/VideoKYCList.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Video } from "lucide-react";
import { PendingPartnerKyc } from "./AdminDashboard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export function VideoKYCList({kycList} : {kycList : PendingPartnerKyc[]}): React.ReactElement {
  const [videoKyc , setVideoKyc] = useState<PendingPartnerKyc[]>(kycList)
  const router=  useRouter()
  console.log(videoKyc);
  
  const handleStartVideoKyc = async (id: any) => {
    try {
      const {data} = await axios.get(`api/admin/video-kyc/start/${id}`)
      window.location.reload()
    } catch (error) {
      console.error(error);
      
    }
  }
  // const handleJoinCall = async (id: any) => {
  //   try {
  //     // const {data} = await axios.get(`api/admin/video-kyc/start/${id}`)
  //     // window.location.reload()
  //   } catch (error) {
  //     console.error(error);
      
  //   }
  // }
  if (!videoKyc) return <div>Loading...</div>
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-syne font-bold text-gray-900">Video KYC Requests</h3>
        <Badge className="bg-[#161616] text-[#16a34a] border border-[#bbf7d0] rounded-full">
          {videoKyc.length} pending
        </Badge>
      </div>

     
      <div className="space-y-3">
        {videoKyc.map((p) => (
          <div
            key={p._id}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-white font-bold text-sm">
                {p.name.slice(0,2).toLocaleUpperCase()}
              </div>
              <div>
                <p className="font-syne font-semibold text-gray-900">{p.name}</p>
                <p className="font-dm text-xs text-gray-400">{p.email}</p>
              </div>
            </div>
            {
            
              p.videoKycStatus == "pending" ? <Button
              onClick={() => handleStartVideoKyc(p._id)}
              variant="ghost"
              size="sm"
              className="rounded-full text-[#22c55e] hover:text-[#16a34a] hover:bg-[#f0fdf4] gap-1"
            >
              Start Video Kyc <ChevronRight size={14} />
            </Button> : p.videoKycStatus == "in_progress" ? <Button
              onClick={() => router.push(`/video-kyc/${p.videoKycRoomId}`)}
              variant="ghost"
              size="sm"
              className="rounded-full text-[#22c55e] hover:text-[#16a34a] hover:bg-[#f0fdf4] gap-1"
            >
              join Call <ChevronRight size={14} />
            </Button> : ""
            }
          </div>
        ))}

        {videoKyc.length === 0 && (
          <div className="text-center py-8 text-gray-400 font-dm text-sm">
            No pending video kyc
          </div>
        )}
      </div>
    </div>
  );
}