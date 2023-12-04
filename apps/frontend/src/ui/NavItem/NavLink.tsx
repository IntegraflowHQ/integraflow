import { NavLink as Link, NavLinkProps } from "react-router-dom";
import { NavItem, NavItemProps } from "./NavItem";

interface Props extends NavItemProps, NavLinkProps {}

export const NavLink = ({ to, className, ...props }: Props) => {
    return (
        <Link to={to} className={className}>
            <NavItem {...props} />
        </Link>
    );
};
