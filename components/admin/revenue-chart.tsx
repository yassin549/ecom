"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { ApexOptions } from "apexcharts"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

type RevenueChartProps = {
  data: {
    labels: string[]
    values: number[]
  }
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: data.labels,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
        formatter: (value) => `${value.toFixed(0)} TND`,
      },
    },
    colors: ["#6366F1"],
    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
      y: {
        formatter: (value) => `${value.toFixed(2)} TND`,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
  }

  const series = [
    {
      name: "Revenu",
      data: data.values,
    },
  ]

  if (!mounted) {
    return (
      <div className="h-[350px] flex items-center justify-center bg-gray-50 rounded-xl">
        <div className="animate-pulse text-gray-400">Chargement du graphique...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Revenu Mensuel</h3>
      <Chart options={options} series={series} type="area" height={350} />
    </div>
  )
}
