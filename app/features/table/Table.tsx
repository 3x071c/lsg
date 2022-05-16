/* eslint-disable no-nested-ternary */
import type { Column } from "react-table";
import {
	AddIcon,
	TriangleDownIcon,
	TriangleUpIcon,
	UpDownIcon,
} from "@chakra-ui/icons";
import {
	chakra,
	Table as ChakraTable,
	TableContainer,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Wrap,
	WrapItem,
	Button,
	Heading,
	Input,
} from "@chakra-ui/react";
import { useState } from "react";
import {
	useTable,
	useSortBy,
	useGlobalFilter,
	useAsyncDebounce,
} from "react-table";

export type TableProps<T extends object> = {
	columns: Column<T>[];
	data: T[];
	heading: string;
	trigger: () => void;
};
export function Table<T extends object>({
	columns,
	data,
	trigger,
	heading,
}: TableProps<T>): JSX.Element {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state,
		preGlobalFilteredRows,
		setGlobalFilter,
	} = useTable<T>({ columns, data }, useGlobalFilter, useSortBy);

	const count = preGlobalFilteredRows.length;
	const [value, setValue] = useState<unknown>(state.globalFilter);
	const onChange = useAsyncDebounce((v) => {
		setGlobalFilter(v || undefined);
	}, 200);

	return (
		<>
			<Wrap spacing={2} align="center" justify="space-between">
				<WrapItem>
					<Heading as="h2" size="lg" my={4}>
						{heading}
					</Heading>
				</WrapItem>
				<WrapItem>
					<Input
						value={value ? String(value) : ""}
						placeholder={`🔍 Filtern (${count})`}
						onChange={(e) => {
							setValue(e.target.value);
							onChange(e.target.value);
						}}
					/>
					<Button ml={2} leftIcon={<AddIcon />} onClick={trigger}>
						Neu
					</Button>
				</WrapItem>
			</Wrap>
			<TableContainer>
				<ChakraTable
					{...getTableProps()}
					variant="striped"
					colorScheme="gray">
					<Thead>
						{headerGroups.map((headerGroup) => (
							<Tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<Th
										{...column.getHeaderProps(
											column.getSortByToggleProps(),
										)}
										d={column.hidden ? "none" : ""}
										isNumeric={column.isNumeric}
										title="Sortieren">
										{column.render("Header")}
										<chakra.span pl="4">
											{column.isSorted ? (
												column.isSortedDesc ? (
													<TriangleDownIcon aria-label="Absteigend sortiert" />
												) : (
													<TriangleUpIcon aria-label="Aufsteigend sortiert" />
												)
											) : (
												<UpDownIcon aria-label="Klicken zum Sortieren" />
											)}
										</chakra.span>
									</Th>
								))}
							</Tr>
						))}
					</Thead>
					<Tbody {...getTableBodyProps()}>
						{rows.map((row) => {
							prepareRow(row);
							return (
								<Tr {...row.getRowProps()}>
									{row.cells.map((cell) => (
										<Td
											{...cell.getCellProps()}
											isNumeric={cell.column.isNumeric}>
											{cell.render("Cell")}
										</Td>
									))}
								</Tr>
							);
						})}
					</Tbody>
				</ChakraTable>
			</TableContainer>
		</>
	);
}