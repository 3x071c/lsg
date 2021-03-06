import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import type { RemixNavLinkProps } from "@remix-run/react/components";
import { Link as ChakraLink, forwardRef } from "@chakra-ui/react";
import { NavLink as RemixNavLink } from "remix";

export const NavLink = forwardRef<
	Overwrite<
		ChakraLinkProps & Omit<RemixNavLinkProps, "to">,
		{ href: string }
	>,
	"a"
>(function InnerNavLink({ children, href, ...props }, ref): JSX.Element {
	return (
		<ChakraLink {...props} as={RemixNavLink} to={href} ref={ref}>
			{children}
		</ChakraLink>
	);
});
