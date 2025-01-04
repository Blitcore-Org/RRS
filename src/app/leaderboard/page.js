import SponsorTag from "@/Components/SponsorTag";
import Link from "next/link";

export default function Leaderboard() {
  // Sample data with 8 synthetic entries
  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Chen",
      distance: "142KM",
      avgPace: "4:45",
      best5km: "23:15",
      best10km: "48:30"
    },
    {
      rank: 2,
      name: "Mike Ross",
      distance: "135KM",
      avgPace: "4:52",
      best5km: "24:05",
      best10km: "49:45"
    },
    {
      rank: 3,
      name: "Emma Wilson",
      distance: "128KM",
      avgPace: "5:05",
      best5km: "24:30",
      best10km: "50:15"
    },
    {
      rank: 4,
      name: "David Kim",
      distance: "120KM",
      avgPace: "5:15",
      best5km: "25:10",
      best10km: "51:30"
    },
    {
      rank: 5,
      name: "Lisa Patel",
      distance: "115KM",
      avgPace: "5:20",
      best5km: "25:45",
      best10km: "52:20"
    },
    {
      rank: 6,
      name: "James Lee",
      distance: "108KM",
      avgPace: "5:25",
      best5km: "26:00",
      best10km: "53:45"
    },
    {
      rank: 7,
      name: "Ana Silva",
      distance: "95KM",
      avgPace: "5:35",
      best5km: "26:30",
      best10km: "54:15"
    },
    {
      rank: 8,
      name: "Tom Wright",
      distance: "87KM",
      avgPace: "5:45",
      best5km: "27:00",
      best10km: "55:30"
    }
  ];

  return (
    <main
      className="
        w-full
        min-h-screen
        bg-[url('/Images/background.png')]
        bg-no-repeat
        bg-center
        bg-cover
        flex
        items-center
        justify-center
      "
    >
      {/* Contents container */}
      <div
        className="
          flex
          w-full
          h-full
          max-w-[402px]
          min-h-[600px]
          flex-col
          items-center
          rounded-[44px]
        "
      >
        {/* NavBar with back button */}
        <div
          className="
            flex
            flex-col
            items-center
            w-full
            rounded-tl-[44px]
            rounded-tr-[44px]
            relative
          "
        >
          {/* Back Button */}
          <Link href="/runner-overview" className="absolute left-6 top-6">
            <span className="text-primary text-2xl">←</span>
          </Link>

          {/* NavContents with smaller logo */}
          <div
            className="
              flex
              py-[12px]
              flex-col
              items-center
              w-full
            "
          >
            <img
              src="/Images/logo.png"
              alt="RRS Logo"
              className="w-[50px] h-[45px]"
            />
          </div>
        </div>

        {/* Main content container */}
        <div
          className="
            flex
            flex-col
            flex-1
            w-full
            justify-between
            items-center
            gap-[20px]
            px-[20px]
          "
        >
          {/* Leaderboard Container */}
          <div
            className="
              flex
              flex-col
              w-full
              gap-[16px]
              mt-[20px]
            "
          >
            {/* Title */}
            <h2 className="text-primary text-2xl font-bold text-center">
              Overall Leaderboard
            </h2>

            {/* Table Header */}
            <div className="w-full p-4 bg-[rgba(73,81,89,0.35)] backdrop-blur-sm rounded-t-[16px] text-white">
              <div className="grid grid-cols-6 gap-2 text-sm font-medium">
                <div className="col-span-1">#</div>
                <div className="col-span-1">Name</div>
                <div className="col-span-1">Dist.</div>
                <div className="col-span-1">Pace</div>
                <div className="col-span-1">5KM</div>
                <div className="col-span-1">10KM</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="w-full bg-[rgba(73,81,89,0.35)] backdrop-blur-sm rounded-b-[16px] overflow-hidden">
              {leaderboardData.map((entry, index) => (
                <div 
                  key={index}
                  className="grid grid-cols-6 gap-2 p-4 text-sm border-t border-white/10 text-white"
                >
                  <div className="col-span-1">{entry.rank}</div>
                  <div className="col-span-1">{entry.name}</div>
                  <div className="col-span-1">{entry.distance}</div>
                  <div className="col-span-1">{entry.avgPace}</div>
                  <div className="col-span-1">{entry.best5km}</div>
                  <div className="col-span-1">{entry.best10km}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsor Tag */}
          <SponsorTag />
        </div>
      </div>
    </main>
  );
} 