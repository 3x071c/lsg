import { ChevronDownIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	chakra,
	Spacer,
	Heading,
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	HStack,
	VStack,
	useColorModeValue,
	useTheme,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { maxContentWidth } from "~feat/chakra";
import { Link, LinkButton, NavLink } from "~feat/links";

type NavbarProps = {
	groupedPages: {
		uuid: string;
		name: string;
		pages: {
			uuid: string;
			title: string;
		}[];
	}[];
	isLoggedIn: boolean;
};
export function Nav({ groupedPages, isLoggedIn }: NavbarProps): JSX.Element {
	const theme = useTheme();
	const bg = useColorModeValue(
		"whiteAlpha.800",
		transparentize("gray.700", 0.8)(theme),
	);

	return (
		<chakra.nav w="full" borderBottomWidth={1}>
			<Flex w="full" maxW={maxContentWidth} mx="auto" align="center">
				<Link href="/">
					<Box p={2} px={4}>
						<Heading as="h1" size="lg">
							LSG
						</Heading>
					</Box>
				</Link>
				<Spacer />
				<HStack spacing={2} overflowY="auto" textAlign="center">
					{groupedPages.map(({ uuid, name, pages }) => (
						<Box key={uuid}>
							<Popover trigger="hover">
								<PopoverTrigger>
									<Button
										variant="ghost"
										rightIcon={<ChevronDownIcon />}>
										{name}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									w="" // fixes oversized popover
									shadow="md"
									sx={{
										"@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none))":
											{
												backdropFilter: "auto",
												// eslint-disable-next-line sort-keys -- Blur has to come after `auto` filter for this to work!
												backdropBlur: "md",
												bg,
											},
									}}>
									<PopoverBody>
										<VStack spacing={4}>
											{pages.map(
												({ uuid: pageId, title }) => (
													<LinkButton
														key={pageId}
														href={`/page/${pageId}`}
														w="full"
														variant="ghost">
														{title}
													</LinkButton>
												),
											)}
										</VStack>
									</PopoverBody>
								</PopoverContent>
							</Popover>
						</Box>
					))}
				</HStack>
				<Spacer />
				<NavLink
					href="/events"
					mr={isLoggedIn ? 2 : 4}
					sx={{ "&.active": { display: "none" } }}>
					<Button variant="outline">Termine</Button>
				</NavLink>
				{isLoggedIn && (
					<NavLink
						href="/admin"
						mr={4}
						d={{ base: "none", sm: "block" }}
						sx={{ "&.active": { display: "none" } }}>
						<Button>Administration</Button>
					</NavLink>
				)}
			</Flex>
		</chakra.nav>
	);
}
