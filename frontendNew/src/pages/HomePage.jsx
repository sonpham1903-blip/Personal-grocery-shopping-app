import PageContainer from '../components/common/PageContainer'

function HomePage() {
  return (
    <PageContainer>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Boilerplate san sang</h2>
        <p className="mt-2 text-slate-600">
          Cau truc du an React + Tailwind da duoc khoi tao theo kieu route-based.
        </p>
      </section>
    </PageContainer>
  )
}

export default HomePage
