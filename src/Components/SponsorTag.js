// src/components/SponsorTag.js
export default function SponsorTag() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-white/60 text-[10px] font-normal leading-[120%]">
        Sponsored by
      </div>
      <div
        className="
            bg-[url('/Images/sponsors.png')] 
            bg-contain
            w-[120px]
            h-[56px]
            bg-no-repeat
            bg-center
          "
      />
    </div>
  );
}
