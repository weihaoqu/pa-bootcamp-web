import { notFound } from "next/navigation";
import { MODULES, SLIDE_DECKS } from "@/lib/modules";
import { getLectureSlides, getGuideSlides } from "@/lib/slides";
import SlideViewer from "@/components/slides/SlideViewer";

export function generateStaticParams() {
  return MODULES.map((m) => ({ moduleSlug: m.slug }));
}

interface Props {
  params: Promise<{ moduleSlug: string }>;
}

export default async function SlidesPage({ params }: Props) {
  const { moduleSlug } = await params;
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  if (!mod) notFound();

  const lectureSlides = getLectureSlides(moduleSlug);
  const guideSlides = getGuideSlides(moduleSlug);
  const htmlFile = SLIDE_DECKS[moduleSlug];
  const htmlDeckUrl = htmlFile ? `/slides/${htmlFile}` : undefined;

  return (
    <div className="-m-6">
      <SlideViewer
        lectureSlides={lectureSlides}
        guideSlides={guideSlides}
        htmlDeckUrl={htmlDeckUrl}
        moduleName={`Module ${mod.index}: ${mod.name}`}
      />
    </div>
  );
}
