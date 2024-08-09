import { Divider, Table } from "@mantine/core";
import { ReportTable } from "@/components/ReportTable";
import { sampleDataCCTV } from "@/model/dataset";

export default function Laporan() {
  return (
    <div className="w-full mx-auto p-4">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold">Laporan</h2>
      </div>
      <Divider my={"md"} />
      {/* Data Pengunjung */}
      <Table.ScrollContainer className="border-[1px]" h={600}>
        <ReportTable data={sampleDataCCTV}/>
      </Table.ScrollContainer>
    </div>
  );
}

// function ReportTableBackup() {
//   const [dataCctv, setDataCctv] = useState(initialDataCctv);

//   const handleEdit = (index) => {
//     Swal.fire({
//       title: "Edit Nama",
//       input: "text",
//       inputValue: dataCctv[index].nama,
//       showCancelButton: true,
//       confirmButtonText: "Simpan",
//       preConfirm: (nama) => {
//         if (!nama) {
//           Swal.showValidationMessage("Nama tidak boleh kosong");
//         }
//         return nama;
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const newDataCctv = [...dataCctv];
//         newDataCctv[index].nama = result.value;
//         setDataCctv(newDataCctv);
//         Swal.fire("Berhasil!", "Nama berhasil diubah.", "success");
//       }
//     });
//   };
//   return (
//     <div className="container mx-auto pb-10 lg:pl-3 pl-5 mt-5">
//       <div className="overflow-x-auto pr-5 lg:pr-0">
//         <table className="table-auto w-full">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 bg-slate-500 text-white rounded-tl-lg">
//                 No
//               </th>
//               <th className="px-4 py-2 bg-slate-500 text-white">ID</th>
//               <th className="px-4 py-2 bg-slate-500 text-white">Status</th>
//               <th className="px-4 py-2 bg-slate-500 text-white">Persen</th>
//               <th className="px-4 py-2 bg-slate-500 text-white">Nama</th>
//               <th className="px-4 py-2 bg-slate-500 text-white rounded-tr-lg">
//                 Edit
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {dataCctv.map((entry, index) => (
//               <tr
//                 key={index}
//                 className={index % 2 === 0 ? "bg-primary-50" : "bg-primary-100"}
//               >
//                 <td className="border border-bg-slate-500 px-4 py-2 text-center font-semibold">
//                   {index + 1}
//                 </td>
//                 <td
//                   className={`border border-bg-slate-500 px-4 py-2 text-center font-semibold ${
//                     entry.status === "Mencontek" ? "text-red-500" : ""
//                   }`}
//                 >
//                   {entry.id}
//                 </td>
//                 <td
//                   className={`border border-bg-slate-500 px-4 py-2 text-center font-semibold ${
//                     entry.status === "Mencontek" ? "text-red-500" : ""
//                   }`}
//                 >
//                   {entry.status}
//                 </td>
//                 <td
//                   className={`border border-bg-slate-500 px-4 py-2 text-center font-semibold ${
//                     entry.status === "Mencontek" ? "text-red-500" : ""
//                   }`}
//                 >
//                   {entry.persen}
//                 </td>
//                 <td className="border border-bg-slate-500 px-4 py-2 text-center font-semibold">
//                   {entry.nama}
//                 </td>
//                 <td className="border border-bg-slate-500 px-4 py-2 text-center font-semibold">
//                   <FaEdit
//                     className="cursor-pointer"
//                     onClick={() => handleEdit(index)}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


