export default function IdeasFotografia() {
  const ideas = [
    {
      image: "/Gflores/logo1.png",
      title: "Fotografías de productos",
      text: "Haz que tus productos destaquen y resalta sus mejores características para atraer más clientes.",
    },
    {
      image: "/logo.jpeg",
      title: "Eventos Sociales",
      text: "¡Que tus mejores momentos queden retratados por siempre!",
    },
    {
      image: "/Gflores/logo1.png",
      title: "Fotografía corporativa",
      text: "Muestra qué haces y cómo lo haces en una sesión fotográfica con el personal de tu empresa, destacando tus valores corporativos.",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Encabezado */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-black mb-6 text-brand font-orbitron uppercase tracking-tighter" style={{ textShadow: '0 0 15px rgba(217, 26, 26, 0.3)' }}>
          RETRATAMOS LOS MEJORES MOMENTOS
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto uppercase font-medium">
          Contamos con un equipo de fotógrafos talentosos y creativos siempre listos para hacer brillar tu marca o tu evento.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ideas.map((item, idx) => (
          <div
            key={idx}
            className="bg-muted/50 backdrop-blur-xl p-8 rounded-none border border-border hover:border-brand/50 transition-all duration-500 transform hover:scale-105 group"
          >
            <div className="mb-6 rounded-none overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h3 className="text-2xl font-black text-foreground text-center mb-4 font-orbitron uppercase tracking-widest group-hover:text-brand transition-colors">{item.title}</h3>
            <p className="text-muted-foreground text-center uppercase font-medium">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
