import Sidebar from "../components/sidebar";

export default function Home() {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
      </div>
    </>
  );
}
