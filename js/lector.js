// js/lector.js
document.addEventListener('DOMContentLoaded', () => {
  const btnLeer = document.getElementById('btn-leer');
  
  // Si la página no tiene el botón, el script no hace nada y no da error.
  if (!btnLeer) return;

  let leyendo = false;
  let utterance = null;

  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;

    btnLeer.addEventListener('click', () => {
      if (leyendo) {
        synth.cancel(); // Detiene la lectura
        btnLeer.innerHTML = '🔊 Escuchar';
        leyendo = false;
      } else {
        // Selecciona el texto del contenido principal (ignora el menú y el pie de página)
        const contenido = document.querySelector('main').innerText;
        
        // Limpia el texto: quita emojis para que no los lea como "cara sonriente"
        const textoLimpio = contenido.replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

        utterance = new SpeechSynthesisUtterance(textoLimpio);
        utterance.lang = 'es-CO'; // Acento colombiano
        utterance.rate = 1; // Velocidad normal

        utterance.onstart = () => {
          btnLeer.innerHTML = '⏹️ Detener';
          leyendo = true;
        };

        utterance.onend = () => {
          btnLeer.innerHTML = '🔊 Escuchar';
          leyendo = false;
        };

        synth.speak(utterance);
      }
    });
  } else {
    btnLeer.style.display = 'none'; // Si el navegador es viejo, oculta el botón
    console.warn('Tu navegador no soporta la síntesis de voz.');
  }
});