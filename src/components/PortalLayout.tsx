import { useEffect, useRef, useState } from 'react'
import { Calculator, Gauge, LogOut, Menu, PackageSearch, Plus, X } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BrandMark } from './BrandMark'

const navClass = ({ isActive }: { isActive: boolean }) => `portal-nav-link${isActive ? ' portal-nav-link-active' : ''}`

export function PortalLayout() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        requestAnimationFrame(() => menuRef.current?.focus())
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (!session) return null

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const navigation = (
    <>
      <NavLink to="/app" end className={navClass}><Gauge aria-hidden="true" /> Tổng quan</NavLink>
      <NavLink to="/app/shipments" className={navClass}><PackageSearch aria-hidden="true" /> Vận đơn</NavLink>
      <NavLink to="/app/shipments/new" className={navClass}><Plus aria-hidden="true" /> Tạo vận đơn</NavLink>
      {session.role === 'employee' && <NavLink to="/app/quotes" className={navClass}><Calculator aria-hidden="true" /> Báo giá</NavLink>}
    </>
  )

  return (
    <div className="portal-shell">
      <a href="#portal-content" className="skip-link">Bỏ qua điều hướng</a>
      <aside className="portal-sidebar" aria-label="Điều hướng portal">
        <div className="portal-brand"><BrandMark to="/app" /><span>Vận hành</span></div>
        <nav className="portal-nav">{navigation}</nav>
        <div className="portal-sidebar-foot">
          <span className="demo-flag">Dữ liệu minh họa</span>
          <p>{session.organization}</p>
        </div>
      </aside>

      <div className="portal-workspace">
        <header className="portal-topbar">
          <button ref={menuRef} type="button" className="portal-menu-button" aria-label={open ? 'Đóng menu' : 'Mở menu'} aria-expanded={open} aria-controls="portal-mobile-menu" onClick={() => setOpen((value) => !value)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <div className="portal-mobile-brand"><BrandMark to="/app" /></div>
          <div className="portal-user">
            <div><strong>{session.name}</strong><span>{session.role === 'employee' ? 'Nhân viên vận hành' : 'Đối tác'}</span></div>
            <button type="button" onClick={handleLogout} aria-label="Đăng xuất"><LogOut aria-hidden="true" /></button>
          </div>
        </header>

        {open && <nav id="portal-mobile-menu" className="portal-mobile-menu" aria-label="Điều hướng portal trên điện thoại">{navigation}</nav>}
        <main id="portal-content" className="portal-content"><Outlet /></main>
      </div>
    </div>
  )
}
