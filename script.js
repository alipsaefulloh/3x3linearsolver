function createInputs() {
  const container = document.getElementById("matrix-inputs");
  container.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      const input = document.createElement("input");
      input.type = "number";
      input.id = `a${i}${j}`;
      input.step = "any";
      input.value = "0";
      container.appendChild(input);
    }
  }
}
window.onload = createInputs;

function solve() {
  const A = [], B = [];
  for (let i = 0; i < 3; i++) {
    A[i] = [];
    for (let j = 0; j < 3; j++) {
      A[i][j] = parseFloat(document.getElementById(`a${i}${j}`).value);
    }
    B[i] = parseFloat(document.getElementById(`a${i}3`).value);
  }

  const resultDiv = document.getElementById("result");
  const stepsDiv = document.getElementById("steps-container");
  stepsDiv.innerHTML = "";

  try {
    const Ainv = math.inv(A);
    const Xinv = math.multiply(Ainv, B);

    let inverseSteps = "<h1><strong>METODE MATRIX BALIKAN</strong></h1>";
    inverseSteps += "<p>Kita akan menyelesaikan SPL dengan rumus: <strong>X = A⁻¹ × B</strong></p>";
    inverseSteps += `<p><strong>Langkah 1:</strong> Matriks A:<br>${formatMatrix(A)}</p>`;
    inverseSteps += `<p><strong>Langkah 2:</strong> Invers dari A (A⁻¹):<br>${formatMatrix(Ainv)}</p>`;
    inverseSteps += `<p><strong>Langkah 3:</strong> Vektor B:<br>${formatMatrix(B.map(v => [v]))}</p>`;
    inverseSteps += `<p><strong>Langkah 4:</strong> Kalikan A⁻¹ × B:<br>${formatMatrix(Xinv.map(v => [v]))}</p>`;

    let matrix = A.map((row, i) => [...row, B[i]]);
    let gaussSteps = "<h1><strong>METODE GAUSS-JORDAN</strong></h1>";
    gaussSteps += "<p>Kita akan menyelesaikan SPL dengan operasi baris elementer untuk mengubah bentuk matriks menjadi eselon tereduksi.</p>";
    gaussSteps += `<p><strong>Langkah 1:</strong> Gabungkan matriks A dan B menjadi matriks augmented:<br>${formatMatrix(matrix)}</p>`;

    for (let i = 0; i < 3; i++) {
      let pivot = matrix[i][i];
      gaussSteps += `<p><strong>Langkah ${i + 2}:</strong> Ubah elemen pivot di baris ${i + 1} jadi 1, bagi semua elemen di baris ini dengan ${pivot.toFixed(4)}</p>`;
      for (let j = 0; j < 4; j++) matrix[i][j] /= pivot;
      gaussSteps += formatMatrix(matrix);

      for (let k = 0; k < 3; k++) {
        if (k !== i) {
          let factor = matrix[k][i];
          gaussSteps += `<p>Eliminasi elemen di baris ${k + 1}, kolom ${i + 1} agar menjadi 0. Kurangi dengan ${factor.toFixed(4)} × baris ${i + 1}.</p>`;
          for (let j = 0; j < 4; j++) matrix[k][j] -= factor * matrix[i][j];
          gaussSteps += formatMatrix(matrix);
        }
      }
    }

    const x = matrix.map(row => row[3]);
    resultDiv.innerHTML = `<h2>Hasil Akhir:</h2><p><strong>x = ${x[0].toFixed(4)}, y = ${x[1].toFixed(4)}, z = ${x[2].toFixed(4)}</strong></p>`;
    stepsDiv.innerHTML = inverseSteps + "<hr>" + gaussSteps;

  } catch (err) {
    resultDiv.innerHTML = `<p style='color:red'>Error: ${err.message}</p>`;
  }
}

function formatMatrix(matrix) {
  return `<table class='matrix'>
    ${matrix.map(row => `<tr>${row.map(val => `<td>${Number(val).toFixed(4)}</td>`).join('')}</tr>`).join('')}
  </table>`;
}