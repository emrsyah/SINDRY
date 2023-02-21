import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { generateRandomRGBAArrays } from "@/helpers/colorGenerator";
import { ProductDashboard } from "../pages/app/admin/Beranda";

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ dataP }: { dataP: ProductDashboard[] }) {
  const [opaqueColors, translucentColors] = generateRandomRGBAArrays(dataP.length, 0.3);
//   console.log(dataP)
  const fiveFirst = dataP.slice(0, 5)
  const arrayLabels = fiveFirst.map(d=>d.name)
  const arrayDatas = fiveFirst.map(d=>d.total_sales)
  const data = {
    labels: arrayLabels,
    datasets: [
      {
        label: "Jumlah Penjualan",
        data: arrayDatas,
        backgroundColor: translucentColors,
        borderColor: opaqueColors,
        borderWidth: 1,
      },
    ],
  };
  return <Pie data={data} />;
}
