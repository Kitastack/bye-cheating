import Sidebar from "../components/sidebar";

export default function Label() {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div>
          <h1 className="text-2xl font-semibold">Label</h1>
        </div>
      </div>
    </>
  );
}
