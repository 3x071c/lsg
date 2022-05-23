import { AddIcon } from "@chakra-ui/icons";
import {
	useDisclosure,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverCloseButton,
	ButtonGroup,
	IconButton,
} from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import { useTransition } from "remix";
import { ValidatedForm } from "remix-validated-form";
import { PageCategoryData } from "~models";
import { FormInput, SubmitButton } from "~feat/form";

export const PageCategoryValidatorData = PageCategoryData;
export const PageCategoryValidator = withZod(PageCategoryValidatorData);

export type CategoryPopoverProps = {
	setCloseable: (arg: boolean) => void;
};
export function CategoryPopover({
	setCloseable,
}: CategoryPopoverProps): JSX.Element {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const transition = useTransition();
	const [submitted, setSubmitted] = useState(false);
	const firstFieldRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (transition.state === "loading" && submitted) {
			setSubmitted(false);
			onClose();
		}
	}, [transition.state, onClose, submitted]);

	useEffect(() => {
		setCloseable(!isOpen);
	}, [isOpen, setCloseable]);

	return (
		<Popover
			isOpen={isOpen}
			onOpen={onOpen}
			onClose={onClose}
			closeOnBlur={false}
			initialFocusRef={firstFieldRef}
			placement="right"
			isLazy>
			<PopoverTrigger>
				<IconButton
					aria-label="Neue Kategorie erstellen"
					icon={<AddIcon />}
				/>
			</PopoverTrigger>
			<PopoverContent p={5}>
				<FocusLock persistentFocus={false} returnFocus>
					<PopoverArrow />
					<PopoverCloseButton />
					<ValidatedForm
						validator={PageCategoryValidator}
						method="post">
						<input
							type="hidden"
							name="_subject"
							value="pageCategory"
						/>
						<FormInput
							type="text"
							name="name"
							placeholder="🪪 Name"
							label="Kategorie"
							helper="Wie soll die neue Kategorie heißen?"
							ref={firstFieldRef}
						/>
						<ButtonGroup d="flex" justifyContent="flex-end">
							<SubmitButton
								mt={2}
								onClick={() => setSubmitted(true)}>
								Erstellen
							</SubmitButton>
						</ButtonGroup>
					</ValidatedForm>
				</FocusLock>
			</PopoverContent>
		</Popover>
	);
}
