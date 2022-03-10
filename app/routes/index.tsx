import { Heading, Center, Text, VStack } from "@chakra-ui/react";
import { Hero } from "~app/hero";
import { Container, useBreakpoints } from "~app/layout";

export default function Index(): JSX.Element {
	const spacing = useBreakpoints((k, _v, i) => [k, `${(i + 1) ** 2}px`]);

	return (
		<>
			<Hero />
			<Container>
				<Center>
					<VStack spacing={spacing}>
						<Heading as="h1" size="xl">
							Epic Heading 😎
						</Heading>
						<Text fontSize="md">Epic Text 🔫</Text>
					</VStack>
				</Center>
			</Container>
		</>
	);
}
