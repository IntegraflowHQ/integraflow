import BirthdayIcon from "assets/icons/studio/birthday.png";
import BooleanIcon from "assets/icons/studio/boolean.png";
import ContactIcon from "assets/icons/studio/contact.png";
import MultipleIcon from "assets/icons/studio/multiple.png";
import NPSIcon from "assets/icons/studio/nps.png";
import RatingIcon from "assets/icons/studio/rating.png";
import SmileyIcon from "assets/icons/studio/smiley.png";
import TextIcon from "assets/icons/studio/text.png";
import ThankYouIcon from "assets/icons/studio/thankyou.png";
import WelcomeIcon from "assets/icons/studio/welcome.png";

const questionTypes = [
    {
        name: "Welcome message",
        icon: WelcomeIcon,
    },
    {
        name: "Multiple answer selection",
        icon: MultipleIcon,
    },
    {
        name: "Text answer",
        icon: TextIcon,
    },
    {
        name: "Smiley scale",
        icon: SmileyIcon,
    },
    {
        name: "Rating scale",
        icon: RatingIcon,
    },
    {
        name: "NPS",
        icon: NPSIcon,
    },
    {
        name: "Contact",
        icon: ContactIcon,
    },
    {
        name: "Boolean",
        icon: BooleanIcon,
    },
    {
        name: "Birthday",
        icon: BirthdayIcon,
    },
    {
        name: "Thank you",
        icon: ThankYouIcon,
    },
];

export default function AddQuestion(
    props: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >,
) {
    return (
        <div {...props} className="rounded-lg bg-intg-bg-9">
            {questionTypes.map((questionType) => (
                <div
                    key={questionType.name}
                    className="flex items-center gap-4 rounded-lg p-4 hover:bg-intg-bg-10"
                >
                    <img
                        src={questionType.icon}
                        alt={questionType.name}
                        className="h-4 w-4"
                    />
                    <span className="text-base font-medium">
                        {questionType.name}
                    </span>
                </div>
            ))}
        </div>
    );
}
