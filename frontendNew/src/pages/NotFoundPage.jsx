import { Link } from 'react-router-dom'
import PageContainer from '../components/common/PageContainer'

function NotFoundPage() {
  return (
    <PageContainer>
      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <h2 className="text-2xl font-semibold text-rose-700">404 - Khong tim thay trang</h2>
        <p className="mt-2 text-rose-600">Duong dan ban truy cap khong ton tai.</p>
        <Link
          to="/"
          className="mt-4 inline-flex rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          Ve trang chu
        </Link>
      </section>
    </PageContainer>
  )
}

export default NotFoundPage
