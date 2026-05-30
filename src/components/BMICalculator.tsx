'use client'

import { useState } from 'react'

interface BMIResult {
  value: number
  category: string
}

export default function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<BMIResult | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    const h = parseFloat(height)
    const w = parseFloat(weight)

    if (!h || h < 50 || h > 250) {
      setError('请输入有效身高（50-250cm）')
      return
    }
    if (!w || w < 20 || w > 300) {
      setError('请输入有效体重（20-300kg）')
      return
    }

    const heightM = h / 100
    const bmi = w / (heightM * heightM)
    let category = ''
    if (bmi < 18.5) category = '偏瘦'
    else if (bmi < 24) category = '正常'
    else if (bmi < 28) category = '偏胖'
    else category = '肥胖'
    setResult({ value: parseFloat(bmi.toFixed(1)), category })
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 sm:p-6 ios-card-shadow">
      <h3 className="font-bold text-[var(--color-primary-dark)] text-lg mb-4">BMI 体重计算器</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div>
          <label htmlFor="bmi-height" className="block text-sm text-[var(--color-text-muted)] mb-1.5">身高 (cm)</label>
          <input
            id="bmi-height"
            type="number"
            inputMode="decimal"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="160"
            min={50}
            max={250}
            className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 text-base transition-all"
          />
        </div>
        <div>
          <label htmlFor="bmi-weight" className="block text-sm text-[var(--color-text-muted)] mb-1.5">体重 (kg)</label>
          <input
            id="bmi-weight"
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="55"
            min={20}
            max={300}
            className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 text-base transition-all"
          />
        </div>
      </div>
      <button
        onClick={calculate}
        className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg font-semibold hover:bg-[var(--color-primary-light)] transition-colors touch-target ios-btn-press active:bg-[var(--color-primary-dark)]"
      >
        计算
      </button>
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {result && !error && (
        <div className="mt-4 p-4 bg-[var(--color-bg)] rounded-lg" aria-live="polite">
          <p className="text-sm text-[var(--color-text-muted)]">你的 BMI 指数</p>
          <p className="text-3xl font-bold text-[var(--color-primary-dark)]">{result.value}</p>
          <p className={`text-sm mt-1 ${result.category === '正常' ? 'text-[var(--color-primary)]' : 'text-[#b08968]'}`}>
            {result.category}
          </p>
        </div>
      )}
    </div>
  )
}
