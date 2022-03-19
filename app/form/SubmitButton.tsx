/* eslint-disable react/destructuring-assignment */
import type { PropsWithChildren } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";
import { useFormContext, useIsSubmitting } from "remix-validated-form";

export default function SubmitButton(props: PropsWithChildren<ButtonProps>) {
	const isSubmitting = useIsSubmitting();
	const { isValid } = useFormContext();
	const disabled = isSubmitting || !isValid;

	return (
		<Button
			type="submit"
			disabled={disabled}
			{...props}
			isLoading={isSubmitting}>
			{props.children}
		</Button>
	);
}
