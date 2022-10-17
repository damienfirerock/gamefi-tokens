import MainPage from "../components/views/Main";

export default MainPage;

export async function getServerSideProps() {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL || "");
  const { data } = await res.json();
  return { props: { data } };
}
