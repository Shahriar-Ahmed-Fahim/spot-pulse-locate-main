import { Car, DollarSign, MapPin, Navigation, X } from "lucide-react";
import { useEffect, useState } from "react";

const calculateDistance = (top: number, left: number): number => {
  return 13 * Math.floor(Math.sqrt(
    Math.pow(top - 40, 2) + Math.pow(left - 50, 2)
  ));
};


const generateMockParkingData = (): ParkingLot[] => {
  const baseLots  = [
    {
      id: "1",
      name: "Downtown Plaza",
      latitude: 37.7849,
      longitude: -122.4094,
      totalSpaces: 120,
      availableSpaces: 45,
      status: ParkingStatus.AVAILABLE,
      pricePerHour: 3.5,
      top: 23,
      left: 15,
    },
    {
      id: "2",
      name: "City Center",
      latitude: 37.7749,
      longitude: -122.4194,
      totalSpaces: 80,
      availableSpaces: 12,
      status: ParkingStatus.LIMITED,
      pricePerHour: 4.0,
      top: 10,
      left: 54,
    },
    {
      id: "3",
      name: "Main Street",
      latitude: 37.7649,
      longitude: -122.4294,
      totalSpaces: 150,
      availableSpaces: 0,
      status: ParkingStatus.FULL,
      pricePerHour: 2.75,
      top: 39,
      left: 29,
    },
    {
      id: "4",
      name: "Metro Hub",
      latitude: 37.7549,
      longitude: -122.4394,
      totalSpaces: 200,
      availableSpaces: 78,
      status: ParkingStatus.AVAILABLE,
      pricePerHour: 3.25,
      top: 59,
      left: 78,
    },
    {
      id: "5",
      name: "Business District",
      latitude: 37.7949,
      longitude: -122.3994,
      totalSpaces: 95,
      availableSpaces: 23,
      status: ParkingStatus.LIMITED,
      pricePerHour: 5.0,
      top: 61,
      left: 43,
    },
    {
      id: "6",
      name: "Shopping Center",
      latitude: 37.7449,
      longitude: -122.4494,
      totalSpaces: 300,
      availableSpaces: 156,
      status: ParkingStatus.AVAILABLE,
      pricePerHour: 2.0,
      top: 40,
      left: 70,
    },
  ];

  const lots: ParkingLot[] = baseLots.map((lot) => ({
    ...lot,
    distance: calculateDistance(lot.top, lot.left),
  }));

  return lots;
};

const useParkingData = () => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchParkingData = async () => {
      setIsLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data = generateMockParkingData();
      setParkingLots(data);
      setIsLoading(false);
    };

    fetchParkingData();

    // Set up real-time updates
    const interval = setInterval(() => {
      setParkingLots((current) =>
        current.map((lot) => {
          // Randomly update available spaces
          const change = Math.floor(Math.random() * 5) - 2;
          const newAvailable = Math.max(
            0,
            Math.min(lot.totalSpaces, lot.availableSpaces + change)
          );

          let newStatus = ParkingStatus.AVAILABLE;
          if (newAvailable === 0) {
            newStatus = ParkingStatus.FULL;
          } else if (newAvailable / lot.totalSpaces < 0.3) {
            newStatus = ParkingStatus.LIMITED;
          }

          return {
            ...lot,
            availableSpaces: newAvailable,
            status: newStatus,
          };
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { parkingLots, isLoading };
};

enum ParkingStatus {
  AVAILABLE = "available",
  LIMITED = "limited",
  FULL = "full",
  UNKNOWN = "unknown",
}

interface ParkingLot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  totalSpaces: number;
  availableSpaces: number;
  status: ParkingStatus;
  pricePerHour: number;
  distance: number;
  top: number;
  left: number;
}

// interface ParkingData {
//   timestamp: Date;
//   lots: ParkingLot[];
// }

const Index = () => {
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const { parkingLots, isLoading } = useParkingData();

  const handleMarkerClick = (lot: ParkingLot) => {
    setSelectedLot(lot);
  };

  const getStatusColor = (status: ParkingStatus) => {
    switch (status) {
      case ParkingStatus.AVAILABLE:
        return "bg-green-500";
      case ParkingStatus.LIMITED:
        return "bg-yellow-500";
      case ParkingStatus.FULL:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCapacityPercentage = (lot: ParkingLot) => {
    return ((lot.totalSpaces - lot.availableSpaces) / lot.totalSpaces) * 100;
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const nearestLots = parkingLots
    .filter((lot) => lot.status !== ParkingStatus.FULL)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  const getStatusText = (status: ParkingStatus) => {
    switch (status) {
      case ParkingStatus.AVAILABLE:
        return "Available";
      case ParkingStatus.LIMITED:
        return "Limited";
      case ParkingStatus.FULL:
        return "Full";
      default:
        return "Unknown";
    }
  };

  const occupancyRate = (lot: ParkingLot) => {
    return ((lot.totalSpaces - lot.availableSpaces) / lot.totalSpaces) * 100;
  };

  const getColorClass = (rate: number) => {
    if (rate < 50) return "from-green-400 to-green-600";
    if (rate < 80) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 rounded-lg p-2">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">ParkFinder</h1>
                <p className="text-xs text-gray-600">
                  Real-time parking availability
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-900">2 min ago</p>
            </div>
          </div>
        </div>
      </header>
      <main className="relative h-screen">
        <div className="relative w-full h-full bg-gradient-to-br from-blue-100 via-white to-green-50">
          {/* Map Container */}
          <div className="absolute inset-0 pt-20">
            <div className="relative w-full h-full bg-gradient-to-br from-blue-200/30 to-green-200/30 rounded-t-3xl overflow-hidden">
              {/* User Location Indicator */}
              <div
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: "50%",
                  top: "40%",
                }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-blue-600/30 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Parking Lot Markers */}
              {parkingLots.map((lot, index) => (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                  style={{
                    left: `${lot.left}%`,
                    top: `${lot.top}%`,
                  }}
                  onClick={() => handleMarkerClick(lot)}
                >
                  {/* Pulse Animation Ring */}
                  <div
                    className={`absolute inset-0 rounded-full ${getStatusColor(
                      lot.status
                    )} opacity-30 animate-ping`}
                  ></div>

                  {/* Main Marker */}
                  <div
                    className={`relative w-12 h-12 rounded-full ${getStatusColor(
                      lot.status
                    )} border-3 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95`}
                  >
                    <div className="text-white text-xs font-bold">
                      {lot.availableSpaces}
                    </div>
                  </div>

                  {/* Capacity Ring */}
                  <div className="absolute inset-0 w-12 h-12">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 32 32"
                    >
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="2"
                        strokeDasharray={`${
                          getCapacityPercentage(lot) * 0.88
                        } 88`}
                        className="transition-all duration-500"
                      />
                    </svg>
                  </div>

                  {/* Label */}
                  <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white rounded px-2 py-1 shadow-md whitespace-nowrap">
                    <span className="text-xs font-medium text-gray-900">
                      {lot.name}
                    </span>
                  </div>
                </div>
              ))}


              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-40">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-gray-700">
                        Loading parking data...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 md:bottom-24 left-4 z-30 bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Availability
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Limited</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Full</span>
              </div>
            </div>
          </div>

          {/* Nearest Spots FAB */}
          <div className="fixed bottom-6 right-6 z-40">
            {/* Expanded List */}
            {isExpanded && (
              <div className="mb-4 space-y-2 animate-fade-in">
                {nearestLots.map((lot) => (
                  <div
                    key={lot.id}
                    className="bg-white rounded-lg shadow-lg p-3 min-w-[200px] hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(
                            lot.status
                          )}`}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {lot.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {lot.distance}m
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {lot.availableSpaces} spots
                      </span>
                      <span className="text-xs text-gray-600">
                        ${lot.pricePerHour}/hr
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FAB Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-200 hover:shadow-xl active:scale-95 relative overflow-hidden"
            >
              {/* Pulse Animation */}
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>

              {/* Icon */}
              <div className="relative">
                {isExpanded ? (
                  <Car className="h-6 w-6 text-white" />
                ) : (
                  <Navigation className="h-6 w-6 text-white" />
                )}
              </div>

              {/* Badge */}
              {nearestLots.length > 0 && !isExpanded && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {nearestLots.length}
                </div>
              )}
            </button>
          </div>

          {/* Parking Modal */}
          {selectedLot && (
            <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setSelectedLot(null)}
              />

              {/* Modal */}
              <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedLot.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedLot(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedLot.status
                      )}`}
                    >
                      {getStatusText(selectedLot.status)}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        {selectedLot.availableSpaces}
                      </span>
                      <span className="text-gray-500 ml-1">
                        / {selectedLot.totalSpaces} spots
                      </span>
                    </div>
                  </div>

                  {/* Capacity Chart */}
                  {/* <CapacityChart occupancyRate={occupancyRate(selectedLot)} /> */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Occupancy
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {Math.round(occupancyRate(selectedLot))}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getColorClass(
                          occupancyRate(selectedLot)
                        )} transition-all duration-1000 ease-out rounded-full`}
                        style={{ width: `${occupancyRate(selectedLot)}%` }}
                      />
                    </div>

                    {/* Visual Capacity Grid */}
                    <div className="grid grid-cols-10 gap-1 p-4 bg-gray-50 rounded-lg">
                      {Array.from({ length: 20 }, (_, index) => {
                        const isOccupied =
                          index < (occupancyRate(selectedLot) / 100) * 20;
                        return (
                          <div
                            key={index}
                            className={`w-4 h-6 rounded-sm transition-colors duration-300 ${
                              isOccupied
                                ? "bg-gray-800"
                                : "bg-green-400 shadow-sm"
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded"></div>
                        <span>Available</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-800 rounded"></div>
                        <span>Occupied</span>
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Distance</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedLot.distance}m away
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-sm font-medium text-gray-900">
                          ${selectedLot.pricePerHour}/hour
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
