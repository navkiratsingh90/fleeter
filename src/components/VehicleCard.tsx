import { ArrowRight, Car, CarFront, Clock3, Star } from "lucide-react";

interface IVehicle {
  owner?: string;
  _id?: string;

  type: "bike" | "car" | "auto" | "truck" | "van";

  vehicleModel: string;
  number: string;
  imageUrl: string;

  baseFare: number;
  pricePerKm: number;
  waitingCharge: number;

  status: "pending" | "approved" | "rejected";

  rejectionReason?: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

interface VehicleCardProps {
  vehicle: IVehicle;
  distance: number;
  onBook: () => void;
}

export default function VehicleCard({
  vehicle,
  distance,
  onBook,
}: VehicleCardProps) {
  const {
    imageUrl,
    vehicleModel,
    number,
    type = "car",
    pricePerKm,
	baseFare,
    waitingCharge,
  } = vehicle;

  const estimatedFare = Math.round(baseFare + pricePerKm * distance);
  return (
    <div className="w-full max-w-[380px] overflow-hidden rounded-3xl border border-[#bbf7d0] bg-white shadow-lg hover:shadow-xl transition-all duration-300">

      {/* IMAGE */}
      <div className="relative">

        <div className="h-[200px] overflow-hidden bg-[#f0fdf4]">
          <img
            src={
              imageUrl ||
              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
            }
            alt={vehicleModel || "Vehicle"}
            className="h-full w-full object-cover"
          />
        </div>

        {/* RATING */}
        <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-md border border-[#bbf7d0]">
          <Star className="h-4 w-4 fill-[#22c55e] text-[#22c55e]" />
          4.8
        </div>

        {/* TYPE BADGE */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#22c55e] px-4 py-1 text-xs font-bold text-white shadow-md">
          <Car className="h-3.5 w-3.5" />
          {type.toUpperCase()}
        </div>

      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* NAME + NUMBER */}
        <div className="flex items-start justify-between">

          <div>
            <h3 className="text-[22px] font-extrabold text-gray-900 leading-tight">
              {vehicleModel || "Vehicle Model"}
            </h3>

            <div className="mt-2 inline-flex rounded-2xl bg-[#f0fdf4] px-4 py-2 text-sm font-mono font-semibold text-[#16a34a] border border-[#bbf7d0]">
              {number || "UP00XX0000"}
            </div>
          </div>

          <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dcfce7] text-[#16a34a]">
            <CarFront className="h-7 w-7" />
          </div>

        </div>

        {/* PRICING */}
        <div className="mt-6 grid grid-cols-2 gap-3">

          <div className="rounded-2xl bg-[#f0fdf4] border border-[#dcfce7] p-4">

            <div className="flex items-center gap-2 text-xs font-semibold text-[#16a34a]">
              <CarFront size={15} />
              PER KM
            </div>

            <div className="mt-2 text-3xl font-extrabold text-gray-900">
              ₹{pricePerKm}
            </div>

          </div>

          <div className="rounded-2xl bg-[#f0fdf4] border border-[#dcfce7] p-4">

            <div className="flex items-center gap-2 text-xs font-semibold text-[#16a34a]">
              <Clock3 size={15} />
              WAITING
            </div>

            <div className="mt-2 text-3xl font-extrabold text-gray-900">
              ₹{waitingCharge}/min
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-6 flex items-end justify-between border-t border-[#dcfce7] pt-5">

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#16a34a]">
              Estimated Fare
            </p>

            <div className="text-4xl font-extrabold text-gray-900">
              ₹{estimatedFare}
            </div>

          </div>

          <button
            onClick={onBook}
            className="flex items-center gap-2 rounded-2xl bg-[#22c55e] px-6 py-3 font-bold text-white shadow-md hover:bg-[#16a34a] transition active:scale-95"
          >
            Book
            <ArrowRight size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}