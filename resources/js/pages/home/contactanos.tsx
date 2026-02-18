'use client';

export default function Contactanos() {
    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-12 text-center sm:mb-16">
                <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                    <span className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent">
                        Información
                    </span>
                </h2>
                <p className="mx-auto max-w-3xl text-base text-white/70 sm:text-lg md:text-xl">
                    Estamos listos para ayudarte a llevar tu proyecto al siguiente nivel. Completa el formulario y nos pondremos en contacto contigo a la brevedad.
                </p>
            </div>

            {/* Content Card */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-900/20 to-black/40 p-6 backdrop-blur-sm sm:p-8 md:p-10">
                <h3 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Información de Admus Productions</h3>

                {/* Info Items */}
                <div className="space-y-6">
                    {/* Dirección */}
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start">
                        <div className="flex-shrink-0 rounded-lg bg-red-500/10 p-3 text-red-500 sm:mr-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="mb-1 text-lg font-semibold text-white sm:text-xl">Dirección</h4>
                            <p className="text-sm text-white/80 sm:text-base">
                                Av. 20 de octubre y capitán castrillo Edificio Torre Camila 1 local 110, La Paz, Bolivia
                            </p>
                        </div>
                    </div>

                    {/* Celular */}
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start">
                        <div className="flex-shrink-0 rounded-lg bg-red-500/10 p-3 text-red-500 sm:mr-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="mb-1 text-lg font-semibold text-white sm:text-xl">Celular</h4>
                            <p className="text-sm text-white/80 sm:text-base">+591 79582395</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start">
                        <div className="flex-shrink-0 rounded-lg bg-red-500/10 p-3 text-red-500 sm:mr-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="mb-1 text-lg font-semibold text-white sm:text-xl">Email</h4>
                            <p className="text-sm text-white/80 sm:text-base">admusbolivia@gmail.com</p>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="mt-10 pt-8 sm:mt-12">
                    <h4 className="mb-4 text-lg font-semibold text-white sm:text-xl">Síguenos</h4>
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Facebook */}
                        <a
                            href="https://www.facebook.com/admusproductions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-red-500/10 p-2.5 text-red-500 transition-all duration-300 hover:bg-red-500/20 hover:scale-105"
                            aria-label="Facebook"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                        </a>

                        {/* YouTube */}
                        <a
                            href="https://www.youtube.com/@admusproductions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-red-500/10 p-2.5 text-red-500 transition-all duration-300 hover:bg-red-500/20 hover:scale-105"
                            aria-label="YouTube"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                        </a>

                        {/* TikTok */}
                        <a
                            href="https://www.tiktok.com/@admusbol"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-red-500/10 p-2.5 text-red-500 transition-all duration-300 hover:bg-red-500/20 hover:scale-105"
                            aria-label="TikTok"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12.776 0h3.366a5.266 5.266 0 0 0 5.263 5.263v3.386a8.648 8.648 0 0 1-5.263-1.8v7.975a6.54 6.54 0 1 1-6.533-6.536c.207 0 .409.013.61.035v3.454a3.087 3.087 0 1 0 2.557 3.048V0z" />
                            </svg>
                        </a>

                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/59179582395?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-red-500/10 p-2.5 text-red-500 transition-all duration-300 hover:bg-red-500/20 hover:scale-105"
                            aria-label="WhatsApp"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M20.52 3.48A11.936 11.936 0 0 0 12 0C5.372 0 0 5.373 0 12c0 2.11.551 4.165 1.59 5.98L0 24l6.277-1.636A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.192-1.243-6.192-3.48-8.52zM12 22.154c-1.828 0-3.606-.484-5.162-1.4l-.368-.212-3.726.97.995-3.64-.24-.374A9.945 9.945 0 0 1 2 12c0-5.522 4.478-10 10-10 2.667 0 5.178 1.04 7.07 2.93A9.94 9.94 0 0 1 22 12c0 5.522-4.478 10-10 10zm5.337-7.162c-.234-.117-1.38-.683-1.594-.76-.214-.078-.37-.117-.527.117-.156.234-.605.76-.742.917-.137.156-.273.175-.507.058-.234-.117-.987-.364-1.88-1.158-.695-.618-1.164-1.38-1.3-1.614-.137-.234-.015-.36.103-.477.106-.106.234-.273.352-.41.117-.137.156-.234.234-.39.078-.156.039-.293-.02-.41-.058-.117-.527-1.28-.722-1.753-.195-.468-.394-.405-.527-.41-.137-.007-.293-.009-.449-.009s-.41.058-.625.293c-.214.234-.82.801-.82 1.953s.84 2.267.957 2.426c.117.156 1.654 2.53 4.01 3.544.56.242.996.385 1.336.493.561.18 1.071.155 1.476.094.45-.068 1.38-.562 1.575-1.104.195-.546.195-1.016.137-1.104-.058-.087-.215-.137-.449-.254z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}