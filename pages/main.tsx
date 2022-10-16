import MainPage from "../components/views/Main";

export default MainPage;

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(process.env.BACKEND_URL || "");
  const { data } = await res.json();

  return { props: { data } };
}
