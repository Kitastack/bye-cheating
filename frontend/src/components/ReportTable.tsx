import { DetectionData } from "@/model/dataset";
import { Table } from "@mantine/core";

export function ReportTable({ data }: { data: DetectionData[] }) {
  return (
    <Table stickyHeader striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Akurasi</Table.Th>
          <Table.Th>Nama</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((val, idx) => {
          return (
            <Table.Tr key={idx}>
              <Table.Td>{val.id}</Table.Td>
              <Table.Td>{val.status}</Table.Td>
              <Table.Td>{val.detection}</Table.Td>
              <Table.Td>{val.name}</Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}
