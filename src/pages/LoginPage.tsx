import { type FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { PageMeta } from '../components/PageMeta'
import { useAuth } from '../context/AuthContext'
import { DEMO_USERS } from '../lib/auth'

export function LoginPage() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (error) errorRef.current?.focus() }, [error])
  if (session) return <Navigate to="/app" replace />

  const from = (location.state as { from?: string } | null)?.from ?? '/app'
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!login(email, password)) {
      setError('Email hoặc mật khẩu chưa đúng. Hãy dùng một trong hai tài khoản demo bên dưới.')
      return
    }
    navigate(from, { replace: true })
  }

  const fillDemo = (index: number) => {
    setEmail(DEMO_USERS[index].email)
    setPassword(DEMO_USERS[index].password)
    setError('')
  }

  return (
    <div className="login-page">
      <PageMeta title="Đăng nhập portal | VI LOGIX" description="Cổng quản lý vận đơn dành cho nhân viên và đối tác VI LOGIX." noIndex />
      <header className="login-header"><BrandMark /><Link to="/"><ArrowLeft aria-hidden="true" />Về website</Link></header>
      <main className="login-main">
        <section className="login-context" aria-labelledby="login-title">
          <p className="eyebrow"><ShieldCheck aria-hidden="true" /> Cổng vận hành chuyên dụng</p>
          <h1 id="login-title">Đăng nhập để quản lý từng hành trình.</h1>
          <p>Theo dõi vận đơn, chuẩn bị thông tin kiện hàng và phối hợp xử lý trên cùng một không gian làm việc.</p>
          <dl><div><dt>01</dt><dd>Quyền truy cập theo vai trò</dd></div><div><dt>02</dt><dd>Dữ liệu cước được kiểm soát</dd></div><div><dt>03</dt><dd>Lịch sử trạng thái rõ ràng</dd></div></dl>
        </section>

        <section className="login-panel" aria-label="Biểu mẫu đăng nhập">
          <div className="login-panel-head"><LockKeyhole aria-hidden="true" /><div><p className="eyebrow">Đăng nhập bảo mật</p><h2>Chào mừng trở lại</h2></div></div>
          {error && <div ref={errorRef} tabIndex={-1} className="login-error" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="login-email">Email công việc</label>
            <input id="login-email" type="email" autoComplete="username" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} required />
            <label htmlFor="login-password">Mật khẩu</label>
            <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} required />
            <button type="submit" className="primary-pill">Đăng nhập <ArrowRight aria-hidden="true" /></button>
          </form>
          <div className="demo-accounts">
            <div><span>Dữ liệu minh họa</span><p>Chọn tài khoản để điền nhanh thông tin.</p></div>
            <button type="button" onClick={() => fillDemo(0)}><strong>Nhân viên</strong><span>{DEMO_USERS[0].email}</span></button>
            <button type="button" onClick={() => fillDemo(1)}><strong>Đối tác</strong><span>{DEMO_USERS[1].email}</span></button>
            <small>Mật khẩu chung: <strong>demo123</strong>. Không sử dụng thông tin thật.</small>
          </div>
        </section>
      </main>
    </div>
  )
}
