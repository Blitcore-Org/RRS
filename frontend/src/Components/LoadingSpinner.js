export default function LoadingSpinner() {
  return (
    <main
      className="
        w-full
        min-h-screen
        bg-background
        bg-no-repeat
        bg-center
        bg-cover
        flex
        items-center
        justify-center
      "
    >
      <div className="flex items-center justify-center w-full h-full">
        <div
          className="
            animate-spin 
            rounded-full 
            h-16 w-16 
            border-t-4 border-b-4 
            border-primary
            shadow-lg
          "
        ></div>
      </div>
    </main>
  );
}