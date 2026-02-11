export default function QuienesSomos() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-black mb-6 text-brand font-orbitron uppercase tracking-tighter" style={{ textShadow: '0 0 15px rgba(217, 26, 26, 0.3)' }}>
          QUIÉNES SOMOS
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto uppercase font-medium">
          Un equipo de profesionales apasionados por la producción audiovisual y la creación de contenido que genera
          impacto.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-muted/50 backdrop-blur-xl p-10 rounded-none border border-border hover:border-brand/50 transition-all duration-500 transform hover:scale-105 group">
          <div className="w-16 h-16 bg-brand rounded-none flex items-center justify-center mb-8 mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-4 text-center text-foreground font-orbitron uppercase tracking-widest group-hover:text-brand transition-colors">EXPERIENCIA</h3>
          <p className="text-muted-foreground text-center uppercase font-medium">
            Más de 10 años de experiencia en la industria audiovisual, trabajando con marcas reconocidas a nivel
            nacional e internacional.
          </p>
        </div>

        <div className="bg-muted/50 backdrop-blur-xl p-10 rounded-none border border-border hover:border-brand/50 transition-all duration-500 transform hover:scale-105 group">
          <div className="w-16 h-16 bg-brand rounded-none flex items-center justify-center mb-8 mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-4 text-center text-foreground font-orbitron uppercase tracking-widest group-hover:text-brand transition-colors">CREATIVIDAD</h3>
          <p className="text-muted-foreground text-center uppercase font-medium">
            Enfoque creativo y estratégico para desarrollar contenido que conecta con tu audiencia y genera resultados
            tangibles.
          </p>
        </div>

        <div className="bg-muted/50 backdrop-blur-xl p-10 rounded-none border border-border hover:border-brand/50 transition-all duration-500 transform hover:scale-105 group">
          <div className="w-16 h-16 bg-brand rounded-none flex items-center justify-center mb-8 mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-4 text-center text-foreground font-orbitron uppercase tracking-widest group-hover:text-brand transition-colors">TECNOLOGÍA</h3>
          <p className="text-muted-foreground text-center uppercase font-medium">
            Utilizamos equipos de última generación y las técnicas más avanzadas para garantizar la máxima calidad en
            cada proyecto.
          </p>
        </div>
      </div>
    </div>
  )
}
