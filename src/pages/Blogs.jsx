export const BlogsPage = () => (
  <main className="container py-5 min-vh-100">
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="card p-4 shadow-sm mb-4">
          <p className="text-muted text-uppercase small mb-1">Novedades</p>
          <h1 className="mb-3">Blogs</h1>
          <p className="mb-0">Lee nuestras guías rápidas, lanzamientos y tips de armado. Publicamos resúmenes cortos y claros para que elijas tu próximo upgrade sin perder tiempo.</p>
        </div>

        <div className="d-grid gap-3">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-1">Top 3 upgrades rápidos para tu setup</h5>
            <p className="text-muted small mb-2">5 min de lectura</p>
            <p className="mb-0">Recomendaciones de SSD, RAM y periféricos plug-and-play que suben tu rendimiento sin cambiar el equipo completo.</p>
          </div>
          <div className="card p-3 shadow-sm">
            <h5 className="mb-1">Cómo elegir tu monitor gamer</h5>
            <p className="text-muted small mb-2">4 min de lectura</p>
            <p className="mb-0">Resolución, Hz y panel: qué importa según si juegas competitivos o single player.</p>
          </div>
          <div className="card p-3 shadow-sm">
            <h5 className="mb-1">Checklist antes de comprar tu primera consola</h5>
            <p className="text-muted small mb-2">3 min de lectura</p>
            <p className="mb-0">Servicios online, almacenamiento y mandos extra para elegir tu consola sin sorpresas.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
);
