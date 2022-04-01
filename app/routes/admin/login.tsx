import { LockIcon } from "@chakra-ui/icons";
import {
	Center,
	Heading,
	chakra,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	useColorModeValue,
	Input,
	Button,
	FormLabel,
	useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
	ActionFunction,
	Form,
	useTransition,
	redirect,
	LoaderFunction,
	json,
} from "remix";
import { useLogin, login as authenticate, authorize } from "~app/auth";
import { url as adminURL } from "~routes/admin";

const ChakraForm = chakra(Form);

const getLoaderData = async (request: Request) => {
	if (await authorize(request, { required: false })) throw redirect(adminURL);
	return {};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const didToken = form.get("_authorization");

	return authenticate(request, didToken);
};

export default function Login(): JSX.Element {
	const background = useColorModeValue("gray.50", "gray.700");
	const transition = useTransition();
	const toast = useToast();

	const { loading, logout, data: token, login } = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<{ email: string }>();
	const onSubmit = handleSubmit(({ email }) => {
		login(email).catch((e) =>
			toast({
				description: `Wir wissen auch nicht weiter >:( (${String(e)})`,
				duration: 9000,
				isClosable: true,
				status: "error",
				title: "Anmeldung fehlgeschlagen",
			}),
		);
	});

	if (token) {
		return (
			<>
				<Button
					size="lg"
					pos="fixed"
					top="20px"
					right="20px"
					zIndex={9}
					variant="outline"
					rightIcon={<LockIcon />}
					isLoading={loading || transition.state === "submitting"}
					onClick={() => {
						logout().catch((e) =>
							toast({
								description: `Wir wissen auch nicht weiter >:( (${String(
									e,
								)})`,
								duration: 9000,
								isClosable: true,
								status: "error",
								title: "Abmeldung fehlgeschlagen",
							}),
						);
					}}>
					Abmelden
				</Button>
				<Center minW="100vw" minH="100vh">
					<chakra.main p={8} rounded="md" bg={background}>
						<Heading textAlign="center">Fast fertig!</Heading>
						<ChakraForm method="post" p={4}>
							<input
								type="hidden"
								name="_authorization"
								value={token}
							/>
							<Button
								w="full"
								type="submit"
								isLoading={
									loading || transition.state === "submitting"
								}>
								Anmeldung abschließen
							</Button>
						</ChakraForm>
					</chakra.main>
				</Center>
			</>
		);
	}

	return (
		<Center minW="100vw" minH="100vh">
			<chakra.main p={8} rounded="md" bg={background}>
				<Heading textAlign="center">Login</Heading>
				<form
					// eslint-disable-next-line @typescript-eslint/no-misused-promises -- Looks like the only way
					onSubmit={onSubmit}>
					<FormControl
						isRequired
						isInvalid={!!errors.email}
						mt={4}
						isDisabled={loading || isSubmitting}>
						<FormLabel htmlFor="email">
							Ihre E-Mail-Adresse
						</FormLabel>
						<Input
							id="email"
							type="email"
							placeholder="ich@lsg.muenchen.musin.de"
							variant="filled"
							{...register("email", {
								required: true,
							})}
						/>
						{errors.email ? (
							<FormErrorMessage maxW="sm">
								Ohne die korrekte Adresse von der Registration
								können wir nicht sicherstellen, dass es wirklich
								Sie sind
							</FormErrorMessage>
						) : (
							<FormHelperText maxW="sm">
								Nutzen Sie die Adresse, welche bei der
								Registration für Sie angegeben wurde
							</FormHelperText>
						)}
					</FormControl>
					<Button
						type="submit"
						w="full"
						mt={8}
						isLoading={loading || isSubmitting}>
						Anmelden
					</Button>
				</form>
			</chakra.main>
		</Center>
	);
}

export const url = "/admin/login";