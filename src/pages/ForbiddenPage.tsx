import { LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'

export function ForbiddenPage() {
  return <div className="portal-state"><PageMeta title="Không có quyền truy cập | VI LOGIX" description="Khu vực giới hạn quyền truy cập." noIndex /><LockKeyhole aria-hidden="true" /><p className="eyebrow">Quyền truy cập giới hạn</p><h1>Bạn không thể mở nội dung này.</h1><p>Tài khoản hiện tại không có quyền hoặc vận đơn không thuộc phạm vi được phép xem.</p><Link to="/app" className="primary-pill">Về tổng quan</Link></div>
}
