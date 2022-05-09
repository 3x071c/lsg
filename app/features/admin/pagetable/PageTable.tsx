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
	Table,
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

export type PageTableType = {
	updatedAt: Date;
	createdAt: Date;
	categoryId: number;
	title: string;
	id: number;
};
export type PageTableProps = {
	columns: Column<PageTableType>[];
	data: PageTableType[];
	onOpen: () => void;
};
export function PageTable({
	columns,
	data,
	onOpen,
}: PageTableProps): JSX.Element {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state,
		preGlobalFilteredRows,
		setGlobalFilter,
	} = useTable<PageTableType>({ columns, data }, useGlobalFilter, useSortBy);

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
						Alle Seiten:
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
					<Button ml={2} leftIcon={<AddIcon />} onClick={onOpen}>
						Neu
					</Button>
				</WrapItem>
			</Wrap>
			<TableContainer>
				<Table
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
										isNumeric={column.isNumeric}>
										{column.render("Header")}
										<chakra.span pl="4">
											{column.isSorted ? (
												column.isSortedDesc ? (
													<TriangleDownIcon aria-label="sorted descending" />
												) : (
													<TriangleUpIcon aria-label="sorted ascending" />
												)
											) : (
												<UpDownIcon aria-label="Click to sort" />
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
				</Table>
			</TableContainer>
		</>
	);
}
