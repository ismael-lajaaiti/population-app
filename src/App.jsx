import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts"

// --- Model ---
function exponentialGrowth(r, d, N0, steps) {
  const data = []
  let N = N0
  for (let t = 0; t <= steps; t++) {
    data.push({ t, N: Math.round(N) })
    N = (r - d) * N
  }
  return data
}
function logisticGrowth(r, K, N0, steps) {
  const data = []
  let N = N0
  for (let t = 0; t <= steps; t++) {
    data.push({ t, N: Math.round(N) })
    N = N + r * N * (1 - N / K)
  }
  return data
}

// --- App ---
export default function App() {
  const [r, setR]   = useState(2)
  const [r2, setR2]   = useState(2)
  const [r3, setR3]   = useState(1)
  const [N0, setN0] = useState(2)
  const [d, setD] = useState(0)
  const [K, setK] = useState(50)
  const duration = 30

  const data = exponentialGrowth(r, 0, N0, duration)
  const data_d = exponentialGrowth(r2, d, N0, duration)
  const data_K = logisticGrowth(r3, K, N0, duration)

  return (
    <div style={{ padding: "2rem"}}>
      <h3>Exponential population growth</h3>
      <br />
      <p>
        N<sub>t+1</sub> = r N<sub>t</sub>
      </p>
      <p>
        N<sub>0</sub> = 2
      </p>
      <br />

      {/* Sliders */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label>
          Growth rate <strong>r = {r.toFixed(2)}</strong>
          <br />
          <input type="range" min={0.1} max={3} step={0.1}
            value={r} onChange={e => setR(Number(e.target.value))}
            style={{ width: "300px" }}
          />
        </label>
      </div>

      {/* Chart */}
      <div style={{ display: "flex", justifyContent: "center" }}>
      <LineChart width={500} height={300} data={data}
        margin={{ top: 30, right: 50, left: 30, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="t" type = "number"
          label={{ value: "t", position: "insideRight", offset: -25, dy: -15 }} />
        <YAxis
          label={{ value: "N", position: "insideTop", offset: -25, dx: 30 }} />
        <Tooltip />
        <ReferenceLine y={0} stroke="#ccc" />
        <Line type="monotone" dataKey="N" stroke="#2a9d8f" dot={false} strokeWidth={2} />
      </LineChart>
      </div>

      <h3>Exponential population growth with mortality</h3>
      <br />
      <p>
        N<sub>t+1</sub> = r N<sub>t</sub> -d N<sub>t</sub>
      </p>
      <br />

      {/* Sliders */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p>
        <label>
          Growth rate <strong>r = {r2.toFixed(1)}</strong>
          <br />
          <input type="range" min={0.1} max={3} step={0.1}
            value={r2} onChange={e => setR2(Number(e.target.value))}
            style={{ width: "300px" }}
          />
        </label>
        </p>
        <label>
          Mortality rate <strong>d = {d.toFixed(1)}</strong>
          <br />
          <input type="range" min={0.1} max={3} step={0.1}
            value={d} onChange={e => setD(Number(e.target.value))}
            style={{ width: "300px" }}
          />
        </label>
      </div>
      
      {/* Chart */}
      <div style={{ display: "flex", justifyContent: "center" }}>
      <LineChart width={500} height={300} data={data_d}
        margin={{ top: 30, right: 50, left: 30, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="t" type = "number"
          label={{ value: "t", position: "insideRight", offset: -25, dy: -15 }} />
        <YAxis
          label={{ value: "N", position: "insideTop", offset: -25, dx: 30 }} />
        <Tooltip />
        <ReferenceLine y={0} stroke="#ccc" />
        <Line type="monotone" dataKey="N" stroke="#2a9d8f" dot={false} strokeWidth={2} />
      </LineChart>
      </div>

      <h3>Logistic population growth</h3>
      <br />
      <p>
        N<sub>t+1</sub> = r N<sub>t</sub>(1 - N<sub>t</sub> / K)
      </p>
      <br />

      {/* Sliders */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p>
        <label>
          Growth rate <strong>r = {r3.toFixed(1)}</strong>
          <br />
          <input type="range" min={0.1} max={3.0} step={0.1}
            value={r3} onChange={e => setR3(Number(e.target.value))}
            style={{ width: "300px" }}
          />
        </label>
        </p>
        <label>
          Carrying capacity <strong>K = {K.toFixed(1)}</strong>
          <br />
          <input type="range" min={100} max={1000} step={1}
            value={K} onChange={e => setK(Number(e.target.value))}
            style={{ width: "300px" }}
          />
        </label>
      </div>

      {/* Chart */}
      <div style={{ display: "flex", justifyContent: "center" }}>
      <LineChart width={500} height={300} data={data_K}
        margin={{ top: 30, right: 50, left: 30, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="t" type = "number"
          label={{ value: "t", position: "insideRight", offset: -25, dy: -15 }} />
        <YAxis
          label={{ value: "N", position: "insideTop", offset: -25, dx: 30 }} />
        <Tooltip />
        <ReferenceLine y={0} stroke="#ccc" />
        <Line type="monotone" dataKey="N" stroke="#2a9d8f" dot={false} strokeWidth={2} />
      </LineChart>
      </div>

    </div>
  )
}
