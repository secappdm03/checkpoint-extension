// Obtener el objeto actual (por ejemplo, el firewall seleccionado)
smartConsole.getCurrentObject().then(obj => {
  document.getElementById('content').innerHTML = `
    <p>Nombre: ${obj.name}</p>
    <p>UID: ${obj.uid}</p>
  `;
}).catch(err => {
  console.error(err);
});
