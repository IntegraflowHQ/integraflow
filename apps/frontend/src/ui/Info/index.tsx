interface InfoProps {
    message: string;
}

export const Info = ({ message }: InfoProps) => {
    return (
        <div>
            <p
                className={`py-2 text-sm font-normal text-intg-text-2 opacity-0 transition-all ease-in-out ${
                    message ? "opacity-100" : ""
                }`}
            >
                {message}
            </p>
        </div>
    );
};
