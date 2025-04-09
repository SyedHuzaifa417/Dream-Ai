import { sampleImages } from "@/components/Main/modules/Explore/utlis/Data_tbr";
import MediaPageClient from "./MediaPageClient";

export async function generateStaticParams() {
  const imageParams = sampleImages.map((_, index) => ({
    slug: `image-${index + 1}`,
  }));

  return imageParams;
}

export default function ExplorePage({ params }: { params: { slug: string } }) {
  return <MediaPageClient slug={params.slug} type="image" />;
}
