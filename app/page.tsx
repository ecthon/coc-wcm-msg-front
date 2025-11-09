import { api } from "@/api/api";

export default function Home() {

  function fetchData() {
    api.get("/players/289C0P8Q8").then(response => {
      console.log(response.data);
    }).catch(error => {
      console.error("Error fetching data:", error);
    });
  }
  fetchData();

  return (
    <main>
      <h1>Welcome to My Next.js App</h1>
    </main>
  );
}
