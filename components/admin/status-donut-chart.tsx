"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { ApexOptions } from "apexcharts"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

type StatusDonutChartProps = {
  data: {
    labels: string[]
    values: number[]
  }
}

export function StatusDonutChart({ data }: StatusDonutChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 350,
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    labels: data.labels,
    colors: ["#FCD34D", "#6366F1", "#3B82F6", "#10B981", "#EF4444"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      labels: {
        colors: "#6B7280",
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              color: "#111827",
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              color: "#6366F1",
              formatter: (val) => val.toString(),
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              color: "#6B7280",
              formatter: () => {
                const total = data.values.reduce((sum, val) => sum + val, 0)
                return total.toString()
              },
            },
          },
        },
        expandOnClick: true,
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `${value} commandes`,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: false,
      },
    },
  }

  if (!mounted) {
    return (
      <div className="h-[350px] flex items-center justify-center bg-gray-50 rounded-xl">
        <div className="animate-pulse text-gray-400">Chargement du graphique...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Statut des Commandes</h3>
      <Chart options={options} series={data.values} type="donut" height={350} />
    </div>
  )
}
