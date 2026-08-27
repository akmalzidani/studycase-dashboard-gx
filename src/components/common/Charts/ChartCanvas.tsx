import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  type ChartData,
  type ChartOptions,
  type ChartType,
} from "chart.js";

interface ChartCanvasProps<TType extends ChartType> {
  type: TType;
  data: ChartData<TType>;
  options: ChartOptions<TType>;
}

export function ChartCanvas<TType extends ChartType>({
  type,
  data,
  options,
}: ChartCanvasProps<TType>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const chart = new ChartJS(canvas, { type, data, options });

    return () => chart.destroy();
  }, [type, data, options]);

  return <canvas ref={canvasRef} />;
}
