import Banner from "./home/Banner";
import Categories from "./home/Categories";
import LatestBooks from "./home/LatestBooks";
import TopLibrarians from "./home/TopLibrarians";


export default function Home() {
  return (
    <>
      <Banner />
      <Categories />
      <LatestBooks />
      <TopLibrarians />
    </>
  );
}