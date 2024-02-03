type Props = {
    color?: "default" | "active";
};

export const CommentIcon = ({ color = 'default' }: Props) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 3C5.69 3 2 6.033 2 10C2 12.024 2.978 13.825 4.499 15.085C4.48505 15.7065 4.3048 16.3128 3.977 16.841C3.90904 16.9507 3.87054 17.0761 3.86524 17.2051C3.85994 17.3341 3.888 17.4622 3.94673 17.5772C4.00546 17.6921 4.09285 17.7899 4.20046 17.8612C4.30807 17.9325 4.43226 17.9748 4.561 17.984C5.96247 18.089 7.3561 17.6967 8.497 16.876C8.984 16.958 9.487 17 10 17C14.31 17 18 13.967 18 10C18 6.033 14.31 3 10 3ZM10 11C10.2652 11 10.5196 10.8946 10.7071 10.7071C10.8946 10.5196 11 10.2652 11 10C11 9.73478 10.8946 9.48043 10.7071 9.29289C10.5196 9.10536 10.2652 9 10 9C9.73478 9 9.48043 9.10536 9.29289 9.29289C9.10536 9.48043 9 9.73478 9 10C9 10.2652 9.10536 10.5196 9.29289 10.7071C9.48043 10.8946 9.73478 11 10 11ZM8 10C8 10.2652 7.89464 10.5196 7.70711 10.7071C7.51957 10.8946 7.26522 11 7 11C6.73478 11 6.48043 10.8946 6.29289 10.7071C6.10536 10.5196 6 10.2652 6 10C6 9.73478 6.10536 9.48043 6.29289 9.29289C6.48043 9.10536 6.73478 9 7 9C7.26522 9 7.51957 9.10536 7.70711 9.29289C7.89464 9.48043 8 9.73478 8 10ZM13 11C13.2652 11 13.5196 10.8946 13.7071 10.7071C13.8946 10.5196 14 10.2652 14 10C14 9.73478 13.8946 9.48043 13.7071 9.29289C13.5196 9.10536 13.2652 9 13 9C12.7348 9 12.4804 9.10536 12.2929 9.29289C12.1054 9.48043 12 9.73478 12 10C12 10.2652 12.1054 10.5196 12.2929 10.7071C12.4804 10.8946 12.7348 11 13 11Z"
                fill={color === "default" ? "#AFAAC7" : "#F2F"}
            />
        </svg>
    );
};