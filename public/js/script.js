document.getElementById('verificarFecha').addEventListener('click', function() {
    const fecha = document.getElementById('fecha').value;

    fetch(`/verificar-fecha/${fecha}`)
        .then(response => response.json())
        .then(data => {
            const resultados = document.getElementById('resultado');
            resultados.innerHTML = '<h2>Resultados de Disponibilidad</h2>'; // Título de la sección

            // Mostrar horarios disponibles
            if (data.disponible.length > 0) {
                resultados.innerHTML += '<h3>Horarios Disponibles:</h3>';
                data.disponible.forEach(horario => {
                    resultados.innerHTML += `<div class="horario-disponible">${horario}</div>`;
                });
            } else {
                resultados.innerHTML += '<h3>No hay horarios disponibles.</h3>';
            }

            // Mostrar horarios no disponibles
            if (data.no_disponible.length > 0) {
                resultados.innerHTML += '<h3>Horarios No Disponibles:</h3>';
                data.no_disponible.forEach(horario => {
                    resultados.innerHTML += `<div class="horario-no-disponible">${horario}</div>`;
                });
            } else {
                resultados.innerHTML += '<h3>Todos los horarios están disponibles.</h3>';
            }
        });
});

