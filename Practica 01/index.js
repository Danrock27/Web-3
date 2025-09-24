console.log("========= PRÁCTICA 01 =========");

    // 1. Contar vocales
    function contarVocales(texto) {
      let resultado = { a: 0, e: 0, i: 0, o: 0, u: 0 };
      for (let letra of texto.toLowerCase()) {
        if (resultado.hasOwnProperty(letra)) {
          resultado[letra]++;
        }
      }
      return resultado;
    }
    console.log("1:", contarVocales("euforia"));

    // 2. Invertir palabras
    function invertirCadena(cad) {
      return cad.split("").reverse().join("");
    }
    console.log("2:", invertirCadena("abcd"));

    // 3. Pares e impares
    function separarParesImpares(arr) {
      return {
        pares: arr.filter(n => n % 2 === 0),
        impares: arr.filter(n => n % 2 !== 0)
      };
    }
    console.log("3:", separarParesImpares([1,2,3,4,5]));

    // 4. Mayor y menor
    function mayorMenor(arr) {
      return {
        mayor: Math.max(...arr),
        menor: Math.min(...arr)
      };
    }
    console.log("4:", mayorMenor([3,1,5,4,2]));

    // 5. Palíndromo
    function esPalindromo(cad) {
      let normal = cad.toLowerCase();
      let invertido = normal.split("").reverse().join("");
      return normal === invertido;
    }
    console.log("5 (oruro):", esPalindromo("oruro"));
    console.log("5 (hola):", esPalindromo("hola"));

    // 6. Desestructuración primeros dos elementos
    let arr6 = [10, 20, 30, 40];
    let [a, b] = arr6;
    console.log("6:", a, b);

    // 7. Desestructuración resto
    let [x, y, ...resto] = arr6;
    console.log("7:", resto);

    // 8. Callback después de 2 segundos
    function ejecutarCallback(cb) {
      setTimeout(cb, 2000);
    }
    ejecutarCallback(() => console.log("8: Callback ejecutado tras 2 segundos"));

    // 9. Promesa con éxito después de 3 segundos
    function promesaExito() {
      return new Promise(resolve => {
        setTimeout(() => resolve("9: Éxito después de 3 segundos"), 3000);
      });
    }
    promesaExito().then(msg => console.log(msg));

    // 10. ¿Cuándo usar callback o promesa?
    console.log("10: Callback se usa para tareas simples asíncronas (ej: setTimeout). Promesa para manejar asincronía más compleja, encadenar procesos y evitar callback hell.");

    // 11. Encadenamiento de promesas
    promesaExito()
      .then(msg => {
        console.log("11:", msg);
        return "Otra promesa encadenada";
      })
      .then(msg2 => console.log("11:", msg2));

    // 12. Callback hell -> async/await
    function callbackHell(cb) {
      setTimeout(() => {
        console.log("12: Paso 1");
        setTimeout(() => {
          console.log("12: Paso 2");
          cb();
        }, 1000);
      }, 1000);
    }
    callbackHell(() => console.log("12: Paso 3 con callback hell"));

    async function versionAsyncAwait() {
      function esperar(ms) {
        return new Promise(r => setTimeout(r, ms));
      }
      await esperar(1000);
      console.log("12 Async: Paso 1");
      await esperar(1000);
      console.log("12 Async: Paso 2");
      console.log("12 Async: Paso 3");
    }
    versionAsyncAwait();

    // 13. Promesas anidadas -> async/await
    function promesaPaso(ms, msg) {
      return new Promise(resolve => setTimeout(() => resolve(msg), ms));
    }
    promesaPaso(1000, "13: Paso 1")
      .then(m => {
        console.log(m);
        return promesaPaso(1000, "13: Paso 2");
      })
      .then(m => console.log(m));

    async function versionPromesaAsync() {
      console.log(await promesaPaso(1000, "13 Async: Paso 1"));
      console.log(await promesaPaso(1000, "13 Async: Paso 2"));
    }
    versionPromesaAsync();

    // 14. Promesa -> callback
    function promesaToCallback(promise, cb) {
      promise.then(res => cb(null, res)).catch(err => cb(err));
    }
    promesaToCallback(promesaExito(), (err, res) => {
      if (err) console.error("14:", err);
      else console.log("14:", res);
    });

    // 15. Callback -> promesa
    function callbackEjemplo(cb) {
      setTimeout(() => cb(null, "15: Resultado del callback"), 1000);
    }
    function callbackToPromesa() {
      return new Promise((resolve, reject) => {
        callbackEjemplo((err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
    }
    callbackToPromesa().then(res => console.log(res));

    // 16. Migrar promesas a async/await
    async function migrar() {
      let resultado = await promesaExito();
      console.log("16:", resultado);
    }
    migrar();