export default function Home() {
  return (
    <main
      className="
        relative
        w-screen h-screen
        overflow-hidden
        flex items-center justify-center
        bg-[url('/Images/background.jpg')] bg-no-repeat bg-center bg-fixed bg-cover
      "
    >
      <div className="text-center text-white">
        <img src="/Images/logo.png" alt="Event Logo" className="max-w-[200px] mb-8" />

        <a
          href="https://exultant-elephant-4d8.notion.site/14daf21a78918042b5d7f82f2658c660?pvs=105"
          className="
            inline-block
            bg-primary
            text-secondary
            px-8 py-4
            rounded-lg
            text-2xl font-bold
            no-underline
            transition-colors duration-300
            hover:bg-secondary
            hover:text-primary
            " 
        >
          Join
        </a>
      </div>
    </main>
  );
}
