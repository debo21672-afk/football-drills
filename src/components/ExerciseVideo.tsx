
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

interface ExerciseVideoProps {
  exerciseId: string;
  exerciseVideos: { [key: string]: string };
}

export const ExerciseVideo = ({ exerciseId, exerciseVideos }: ExerciseVideoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          Exercise Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exerciseVideos[exerciseId] ? (
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center border-2 border-primary mb-4">
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${exerciseVideos[exerciseId]}?autoplay=1&loop=1&playlist=${exerciseVideos[exerciseId]}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400">
            <div className="text-center">
              <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">YouTube Video Placeholder</p>
              <p className="text-sm text-gray-500">Video ID: {exerciseId}-tutorial</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
