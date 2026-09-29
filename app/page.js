import Banner from "./home/Banner";
import Categories from "./home/Categories";
import LatestBooks from "./home/LatestBooks";
import TopLibrarians from "./home/TopLibrarians";
import Review from "./home/Review";
import Cta from "./home/Cta";


export default function Home() {
  return (
    <>
      <Banner />
      <Categories />
      <LatestBooks />
      <TopLibrarians />
      <Review />
      <Cta />
    </>
  );
}