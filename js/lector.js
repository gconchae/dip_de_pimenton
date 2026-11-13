document.addEventListener('DOMContentLoaded', () => {
  const btnPlay = document.getElementById('btn-leer');
  const btnStop = document.getElementById('btn-detener');
  
  // Si la página no tiene el botón, el script no hace nada y no da error.
  if (!btnPlay) return;

  let estado = 'detenido'; // Estados posibles: 'detenido', 'leyendo', 'pausado'
  let utterance = null;

  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;

    // Lógica del botón Play/Pausa
    btnPlay.addEventListener('click', () => {
      if (estado === 'detenido') {
        iniciarLectura();
      } else if (estado === 'leyendo') {
        pausarLectura();
      } else if (estado === 'pausado') {
        reanudarLectura();
      }
    });

    // Lógica del botón Detener
    if (btnStop) {
      btnStop.addEventListener('click', detenerLectura);
    }

    function iniciarLectura() {
      const contenido = document.querySelector('main').innerText;
      const textoLimpio = contenido.replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
      
      utterance = new SpeechSynthesisUtterance(textoLimpio);
      utterance.lang = 'es-CO'; 
      utterance.rate = 1; 

      // Cuando el texto termina naturalmente
      utterance.onend = () => {
        estado = 'detenido';
        btnPlay.innerHTML = '🔊 Escuchar';
        if (btnStop) btnStop.style.display = 'none';
      };

      synth.speak(utterance);
      estado = 'leyendo';
      btnPlay.innerHTML = '⏸️ Pausar';
      if (btnStop) btnStop.style.display = 'inline-block';
    }

    function pausarLectura() {
      synth.pause();
      estado = 'pausado';
      btnPlay.innerHTML = '▶️ Continuar';
    }

    function reanudarLectura() {
      synth.resume();
      estado = 'leyendo';
      btnPlay.innerHTML = '⏸️ Pausar';
    }

    function detenerLectura() {
      synth.cancel();
      estado = 'detenido';
      btnPlay.innerHTML = '🔊 Escuchar';
      if (btnStop) btnStop.style.display = 'none';
    }

  } else {
    btnPlay.style.display = 'none';
    if (btnStop) btnStop.style.display = 'none';
    console.warn('Tu navegador no soporta la síntesis de voz.');
  }
});