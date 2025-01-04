import SponsorTag from "@/Components/SponsorTag";
import Button from "@/Components/button";
import Link from "next/link";

export default function Home() {
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
        {/* NavBar */}
        <div
          className="
            flex
            flex-col
            items-center
            w-full
            rounded-tl-[44px]
            rounded-tr-[44px]
          "
        >

        {/* StatusBar */}
        <div
            className="
              flex
              h-[54px]
              pt-[21px]
              flex-col
              items-start
              w-full
            "
          >
            {/* StatusBar content here */}
          </div>

          {/* NavContents */}
          <div
            className="
              flex
              py-[20px]
              flex-col
              items-center
              w-full
              gap-[20px]
            "
          >
            {/* Profile container */}
            <div
              className="
                flex
                w-full
                px-[20px]
                justify-center
                items-center
                mx-auto
              "
            >
              <img
                src="/Images/logo.png"
                alt="Event Logo"
                className="w-[81px] h-[73px] flex-shrink-0"
              />
            </div>
          </div>
        </div>

            {/* Container with two buttons and sponsor info */}
            <div
              className="
                flex
                flex-col
                flex-1
                w-full
                justify-between
                items-center
                gap-[20px]
              "
            >
              {/* Buttons container */}
              <div className="
                flex
                flex-col
                h-full
                justify-center
                items-center
                gap-[20px]
              ">
                {/* Button 1 (Join Us) */}
                <Button variant="secondary">Join us</Button>

                {/* Button 2 (Log in) */}
                <div className="w-full">
                  <Link href="/login" passHref legacyBehavior>
                    <Button variant="primary">Log in</Button>
                  </Link>
                </div>
              </div>
              {/* Sponsor container */}
              <SponsorTag />
            </div>
        </div>
    </main>
  );
}
