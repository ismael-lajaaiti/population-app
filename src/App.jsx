import './App.css'
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts"

// --- Models ---
function exponentialGrowth(r, d, N0, steps) {
  const data = []
  let N = N0
  for (let t = 0; t <= steps; t++) {
    data.push({ t, N: Math.round(N) })
    N = N + (r - d) * N
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

function glvGrowth(r1, r2, K1, K2, a12, a21, N10, N20, steps) {
  const data = []
  let N1 = N10, N2 = N20
  for (let t = 0; t <= steps; t++) {
    data.push({ t, N1: Math.round(N1), N2: Math.round(N2) })
    const newN1 = N1 + r1 * N1 * (1 - N1 / K1 + a12 * N2 / K1)
    const newN2 = N2 + r2 * N2 * (1 - N2 / K2 + a21 * N1 / K2)
    N1 = Math.max(0, newN1)
    N2 = Math.max(0, newN2)
  }
  return data
}

function SliderInput({ label, variable, value, min, max, step, onChange }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "0.8rem 1.2rem",
      margin: "0.8rem auto",
      maxWidth: "400px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
    }}>
      <label>
        <div style={{ marginBottom: "0.4rem", color: "#444" }}>
          {label}
          <span style={{
            float: "right",
            fontWeight: "bold",
            color: "#2d6a4f",
            fontFamily: "monospace"
          }}>
            {variable} = {value.toFixed(1)}
          </span>
        </div>
        <input type="range" min={min} max={max} step={step}
          value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>
    </div>
  )
}

function PopChart({ data, yMax, twoSpecies }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <LineChart width={500} height={300} data={data}
        margin={{ top: 30, right: 50, left: 30, bottom: 30 }}
        style={{ background: "#f4f6f5", borderRadius: "8px" }}>
        <CartesianGrid stroke="#dde4e1" strokeDasharray="3 3" />
        <XAxis dataKey="t" type="number"
          label={{ value: "t", position: "insideRight", offset: -25, dy: -15 }} />
        <YAxis domain={[0, yMax || "auto"]}
          label={{ value: "N", position: "insideTop", offset: -25, dx: 30 }} />
        <Tooltip />
        <ReferenceLine y={0} stroke="#bbb" />
        {twoSpecies ? (
          <>
            <Line type="monotone" dataKey="N1" stroke="#2d6a4f" dot={false} strokeWidth={2} name="Species 1" />
            <Line type="monotone" dataKey="N2" stroke="#a98307" dot={false} strokeWidth={2} name="Species 2" />
          </>
        ) : (
          <Line type="monotone" dataKey="N" stroke="#2d6a4f" dot={false} strokeWidth={2} />
        )}
      </LineChart>
    </div>
  )
}

function Equation({ children }) {
  return (
    <div style={{
      background: "#f4f6f5",
      border: "0px solid #dde4e1",
      borderRadius: "8px",
      padding: "1rem 1.5rem",
      margin: "1rem auto",
      maxWidth: "fit-content",
      fontSize: "1.1rem",
      color: "#2d6a4f",
      textAlign: "center"
    }}>
      {children}
    </div>
  )
}

// --- App ---
export default function App() {
  const [N0,   setN0]   = useState(2)
  const [rMort, setRMort] = useState(0.3)
  const [d,    setD]    = useState(0.1)
  const [rExp, setRExp] = useState(0.2)
  const [rLog, setRLog] = useState(1.0)
  const [K,    setK]    = useState(200)

    const [r1,    setR1]    = useState(0.5)
    const [r2,    setR2]    = useState(0.5)
    const [K1,    setK1]    = useState(200)
    const [K2,    setK2]    = useState(200)
    const [a12,   setA12]   = useState(0.3)
    const [a21,   setA21]   = useState(0.3)
    const [N10,   setN10]   = useState(50)
    const [N20,   setN20]   = useState(50)

  const duration = 30

  const dataMort = exponentialGrowth(rMort, d,   N0, duration)
  const dataExp  = exponentialGrowth(rExp,  0,   N0, duration)
  const dataLog  = logisticGrowth(rLog,     K,   N0, duration)
  const dataTwo  = glvGrowth(r1, r2, K1, K2, a12, a21, N10, N20, duration)

  return (
    <div style={{ padding: "10rem", maxWidth: "1100px", textAlign: "left"}}>

      {/* Header */}
      <h1>Introduction to Population Dynamics</h1>
      <p style={{ marginBottom: "2rem" }}>
        Some ecologists explore how population changes over time using models.
        A model is simply a way to tell what can make a population increases or decreases.
        It's like a recipe where we can list all the ingredients we want and how we mix them together.
        Models allow ecologists to explore unseen scenarios, potentially to forecast the future.
        Will this population collapse if its mortality rises?
        Or will it be able to persist?
        Answering these questions is the part where we, ecologists, have to cook.
        Cooking a model often requires some degree of mathematical knowledge, or some programming skills.
        To avoid these complications, we offer this simple application to explore simple models interactively.
      </p>
      <p>
      Throughout this application, you will find sliders that allows 
      you to change the parameters of the model.
      For example, the one below let you change the starting abundance of the population, at the very beginning of the simulation.
      It applies to all the models below.
      </p>

      {/* Shared parameter */}
      <SliderInput label="Initial abundance" variable="N₀"
        value={N0} min={1} max={100} step={1} onChange={setN0} />

      <hr />

      {/* Section 1 — Exponential with mortality */}
      <h2>1. Growth and mortality</h2>
      <p style={{ marginBottom: "1rem" }}>
        We begin with a very simple model, where we say that a population increases through
        reproduction — given by the rate r — and decreases because of mortality — at rate d.
        In mathematical language, this translates as
      </p>
      <Equation>
        N<sub>t+1</sub> = N<sub>t</sub> + r·N<sub>t</sub> − d·N<sub>t</sub>
      </Equation>
      <SliderInput label="Birth rate " variable="r"
        value={rMort} min={0} max={1} step={0.1} onChange={setRMort} />
      <SliderInput label="Mortality rate " variable="d"
        value={d} min={0} max={1} step={0.1} onChange={setD} />
      <PopChart data={dataMort} />

      <hr />

      {/* Section 2 — Pure exponential */}
      <h2>2. Exponential growth</h2>
      <p style={{ marginBottom: "0.5rem" }}>
        N<sub>t+1</sub> = N<sub>t</sub> + r·N<sub>t</sub>
      </p>
      <p style={{ marginBottom: "1rem" }}>
  Notice that this is exactly the same idea as before, just simplified: instead
  of tracking births and deaths separately, we summarise them into a single
  net growth rate r (this is just r − d from before). This is the model
  ecologists usually start with — it's the simplest possible description of
  population growth, and historically the first one ever written down to study
  human and animal populations.
</p>
<p style={{ marginBottom: "1rem" }}>
  But there's a catch: with r &gt; 0, this population grows forever, doubling
  again and again with no limit. Does that match what you'd expect in nature?
</p>
      <SliderInput label="Net growth rate " variable="r"
        value={rExp} min={-0.5} max={0.5} step={0.1} onChange={setRExp} />
      <PopChart data={dataExp} />

      <hr />

      {/* Section 3 — Logistic */}
      <h2>3. Logistic growth</h2>
      <p style={{ marginBottom: "0.5rem" }}>
        N<sub>t+1</sub> = N<sub>t</sub> + r·N<sub>t</sub>·(1 − N<sub>t</sub>/K)
      </p>
<p style={{ marginBottom: "1rem" }}>
  In reality, no population grows forever — space, food, and other resources
  eventually run out. The logistic model fixes this by adding a brake: a
  carrying capacity K, representing the maximum number of individuals the
  environment can sustain. As N approaches K, the term (1 − N/K) approaches
  zero, and growth slows down naturally.
</p>
<p style={{ marginBottom: "1rem" }}>
  This is the same saturation pattern you can see in real-world data —
  human population, bacteria in a flask, or yeast in a fermenter all follow
  this same S-shaped curve before levelling off.
</p>
      <SliderInput label="Growth rate " variable="r"
        value={rLog} min={0} max={3.0} step={0.1} onChange={setRLog} />
      <SliderInput label="Carrying capacity " variable="K"
        value={K} min={50} max={1000} step={10} onChange={setK} />
      <PopChart data={dataLog} yMax={K * 1.3} />
      <ReferenceLine y={K} stroke="#e76f51" strokeDasharray="5 5" />

  <hr />

<h2>4. When two species interact</h2>
<p style={{ marginBottom: "1rem" }}>
  So far, our population lived alone. But in nature, species rarely live in
  isolation — they share space, food, and resources with others. Let's add
  a second population, N₂, and let the two species influence each other.
</p>
<p style={{ marginBottom: "1rem" }}>
  We extend the logistic model so that each species still grows toward its
  own carrying capacity, but its growth is also affected by how many
  individuals of the other species are around.
</p>
<p style={{ marginBottom: "1.5rem" }}>
  The terms α₁₂ and α₂₁ describe how strongly each species affects the other.
  Their sign tells us what kind of relationship we're modelling:
</p>
<p style={{ marginBottom: "1.5rem" }}>
  • If both α are <strong>positive</strong>, the two species help each other —
  this is mutualism, and both populations can grow larger together than alone.
  Think of plants and bees.
  <br />
  • If both α are <strong>negative</strong>, the two species compete — each one
  reduces the other's growth. Push both high enough and only one species survives.
  <br />
  • If one α is positive and the other negative, one species benefits at the
  expense of the other — closer to a predator-prey or parasitic relationship.
</p>
<p style={{ marginBottom: "1.5rem" }}>
  Try setting both interaction strengths to zero first — you'll see the two
  species simply grow independently, exactly like in section 3. Then slowly
  turn the interactions up or down and watch what changes.
</p>

<SliderInput label="Growth rate species 1 " variable="r₁"
  value={r1} min={0.1} max={1.5} step={0.1} onChange={setR1} />
<SliderInput label="Growth rate species 2 " variable="r₂"
  value={r2} min={0.1} max={1.5} step={0.1} onChange={setR2} />
<SliderInput label="Effect of species 2 on 1 " variable="α₁₂"
  value={a12} min={-1} max={2} step={0.1} onChange={setA12} />
<SliderInput label="Effect of species 1 on 2 " variable="α₂₁"
  value={a21} min={-1} max={2} step={0.1} onChange={setA21} />

<PopChart data={dataTwo} twoSpecies />

    </div>
  )
}
