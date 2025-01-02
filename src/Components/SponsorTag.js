// src/components/SponsorTag.js
export default function SponsorTag() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-white/60 text-[10px] font-normal leading-[120%]">
        Sponsored by
      </div>
      <div
        className="
            w-[60px]
            h-[28px]
            bg-[url('/Images/uba_logo.png')]
            bg-cover
            bg-no-repeat
            bg-center
          "
      />
    </div>
  );
}
