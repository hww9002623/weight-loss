'use client'

import { useState } from 'react'

export default function BMRCalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'female' | 'male'>('female')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    const h = parseFloat(height)
    const w = parseFloat(weight)
    const a = parseInt(age)

    if (!h || h < 50 || h > 250) {
      setError('请输入有效身高（50-250cm）')
      return
    }
    if (!w || w < 20 || w > 300) {
      setError('请输入有效体重（20-300kg）')
      return
    }
    if (!a || a < 10 || a > 120) {
      setError('请输入有效年龄（10-120岁）')
      return
    }

    let bmr = 0
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
    } else {
      bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a)
    }
    setResult(Math.round(bmr))
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 sm:p-6 ios-card-shadow">
      <h3 className="font-bold text-[var(--color-primary-dark)] text-lg mb-4">BMR 基础代谢计算器</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div>
          <label htmlFor="bmr-height" className="block text-sm text-[var(--color-text-muted)] mb-1.5">身高 (cm)</label>
          <input
            id="bmr-height"
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
          <label htmlFor="bmr-weight" className="block text-sm text-[var(--color-text-muted)] mb-1.5">体重 (kg)</label>
          <input
            id="bmr-weight"
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
        <div>
          <label htmlFor="bmr-age" className="block text-sm text-[var(--color-text-muted)] mb-1.5">年龄</label>
          <input
            id="bmr-age"
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="25"
            min={10}
            max={120}
            className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 text-base transition-all"
          />
        </div>
        <div>
          <span className="block text-sm text-[var(--color-text-muted)] mb-1.5">性别</span>
          <div className="flex gap-2" role="radiogroup" aria-label="性别">
            <button
              onClick={() => setGender('female')}
              role="radio"
              aria-checked={gender === 'female'}
              className={`flex-1 py-3 rounded-lg text-sm transition-colors touch-target ios-btn-press ${
                gender === 'female'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
              }`}
            >
              女
            </button>
            <button
              onClick={() => setGender('male')}
              role="radio"
              aria-checked={gender === 'male'}
              className={`flex-1 py-3 rounded-lg text-sm transition-colors touch-target ios-btn-press ${
                gender === 'male'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
              }`}
            >
              男
            </button>
          </div>
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
          <p className="text-sm text-[var(--color-text-muted)]">你的基础代谢率</p>
          <p className="text-3xl font-bold text-[var(--color-primary-dark)]">{result} <span className="text-sm font-normal">大卡/天</span></p>
        </div>
      )}
    </div>
  )
}
