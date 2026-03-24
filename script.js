// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const infoDiv = document.getElementById('info');

    // Verificar si estamos dentro de SmartConsole
    if (typeof smartConsole === 'undefined') {
        infoDiv.innerText = 'Esta extensión solo funciona dentro de SmartConsole.';
        return;
    }

    // Obtener el objeto actual (el que el usuario tiene seleccionado)
    smartConsole.getCurrentObject()
        .then(obj => {
            if (obj) {
                infoDiv.innerHTML = `
                    <p><strong>Nombre:</strong> ${obj.name || 'N/A'}</p>
                    <p><strong>UID:</strong> ${obj.uid || 'N/A'}</p>
                    <p><strong>Tipo:</strong> ${obj.type || 'N/A'}</p>
                `;
            } else {
                infoDiv.innerText = 'No se pudo obtener el objeto actual.';
            }
        })
        .catch(err => {
            console.error('Error al obtener el objeto:', err);
            infoDiv.innerText = 'Error al cargar los datos. Revisa la consola.';
        });
});
