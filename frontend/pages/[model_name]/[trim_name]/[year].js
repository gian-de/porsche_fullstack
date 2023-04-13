import { useRouter } from "next/router";

export default function CarPage({ car }) {
  const router = useRouter();
  console.log("data", car);
  const data = car[0];
  const description = car[0].description;
  //   const parsedDescription = JSON.parse(description);
  const parsedDescription = JSON.parse(description.replace(/“|”/g, '"'));

  console.log("p tags", description);
  console.log("p array maybe", parsedDescription);
  // remove the "<p>" tags from the data

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full bg-red-200">
      <div className="flex flex-col">
        <h1>
          {data?.make} {data?.model_name} {data?.trim_name} ({data?.year})
        </h1>
        <p>{data?.price}</p>

        {parsedDescription?.map((paragraph, idx) => (
          <div key={idx} className="flex max-w-xl bg-blue-300">
            <p className="flex py-4">{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  // const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const baseURL = "http://localhost:7777";

  const res = await fetch(`${baseURL}/api/porsche`);
  const cars = await res.json();

  // Generate the paths for all cars
  const paths = cars.map((car) => ({
    params: {
      model_name: car.model_name,
      trim_name: car.trim_name,
      year: car.year.toString(),
    },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const { model_name, trim_name, year } = params;
  // const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const baseURL = "http://localhost:7777";

  const res = await fetch(
    `${baseURL}/api/porsche?model_name=${model_name}&trim_name=${trim_name}&year=${year}`
  );
  const car = await res.json();

  return {
    props: {
      car,
    },
  };
}
