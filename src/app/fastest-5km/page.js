import SponsorTag from "@/Components/SponsorTag";
import Link from "next/link";

export default function Fastest5KM() {
  // Sample data for 5KM leaderboard
  const leaderboardData = [
    {
      rank: 1,
      image: "/Images/profile-placeholder.png",
      name: "Sarah Chen",
      avgPace: "4:45",
      time: "23:15"
    },
    {
      rank: 2,
      image: "/Images/profile-placeholder.png",
      name: "Mike Ross",
      avgPace: "4:52",
      time: "24:05"
    },
    {
      rank: 3,
      image: "/Images/profile-placeholder.png",
      name: "Emma Wilson",
      avgPace: "5:05",
      time: "24:30"
    },
    {
      rank: 4,
      image: "/Images/profile-placeholder.png",
      name: "David Kim",
      avgPace: "5:15",
      time: "25:10"
    },
    {
      rank: 5,
      image: "/Images/profile-placeholder.png",
      name: "Lisa Patel",
      avgPace: "5:20",
      time: "25:45"
    },
    {
      rank: 6,
      image: "/Images/profile-placeholder.png",
      name: "James Lee",
      avgPace: "5:25",
      time: "26:00"
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
          {/* Title */}
          <h2 className="text-primary text-2xl font-bold">Fastest 5KM</h2>

          {/* Leaderboard Header */}
          <div className="w-full grid grid-cols-4 gap-4 text-primary text-sm mb-4">
            <div>Rank</div>
            <div>Name</div>
            <div>Avg Pace</div>
            <div>Time</div>
          </div>

          {/* Leaderboard Entries */}
          <div className="w-full flex flex-col gap-4">
            {leaderboardData.map((entry) => (
              <div
                key={entry.rank}
                className="w-full p-4 bg-[rgba(73,81,89,0.35)] backdrop-blur-sm rounded-[16px] flex items-center"
              >
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden mr-4">
                  <img
                    src={entry.image}
                    alt={`${entry.name}'s profile`}
                    className="w-full h-full object-cover bg-gray-300"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4 flex-1 text-white">
                  <div className="text-primary">^{entry.rank}</div>
                  <div>{entry.name}</div>
                  <div>{entry.avgPace}</div>
                  <div>{entry.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sponsor Tag */}
          <SponsorTag />
        </div>
      </div>
    </main>
  );
} 