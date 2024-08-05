import { Heart, Star, ThumbsUp } from "lucide-preact";
import { VNode, h } from "preact";
import { Shape } from "../../types";

export default function RatingIcon({ color = "#050505", shape }: { color?: string; shape?: Shape }): VNode {
    if (shape === "heart") return <Heart color={color} fill={color} size={40} />;

    if (shape == "thumb") return <ThumbsUp color={color} fill={color} size={40} />;

    return <Star color={color} fill={color} size={40} />;
}
