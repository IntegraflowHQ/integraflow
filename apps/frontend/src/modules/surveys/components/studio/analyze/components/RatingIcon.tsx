import { Heart, Star, ThumbsUp } from "lucide-react";
type Props = {
    color?: string;
    shape: "star" | "thumb" | "heart" | "button" | undefined;
    fill?: string;
};

const RatingIcon = ({ color = "", shape, fill }: Props) => {
    if (shape === "heart") return <Heart color={color} fill={fill} size={20} className="inline" />;
    if (shape === "thumb") return <ThumbsUp color={color} fill={fill} size={20} className="inline" />;
    return <Star color={color} fill={fill} size={20} className="inline" />;
};

export default RatingIcon;
