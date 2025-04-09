import { sampleVideos } from "@/components/Main/modules/VideoGeneration/utlis/Data_tbr";
import MediaPageClient from "./MediaPageClient";

export async function generateStaticParams() {
  const videoParams = sampleVideos.map((_, index) => ({
    slug: `video-${index + 1}`,
  }));

  return videoParams;
}

export default function VideoPage({ params }: { params: { slug: string } }) {
  return <MediaPageClient slug={params.slug} type="video" />;
}
