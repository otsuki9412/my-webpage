let rowCount = 5;
let colCount = 4;

function createTable(rows, cols) {
  const table = document.getElementById("dynamic-table");
  table.innerHTML = "";
  rowCount = rows;
  colCount = cols;

  // タイトル行
  const header = table.insertRow();
  for (let j = 0; j < cols; j++) {
    const th = document.createElement("th");
    if (j === 0) {
      th.textContent = "名前";
    } else if (j === cols - 2) {
      th.textContent = "結果①";
    } else if (j === cols - 1) {
      th.textContent = "結果②";
    } else {
      th.textContent = `${j}`;
    }
    header.appendChild(th);
  }

  // データ行
  for (let i = 1; i < rows; i++) {
    const row = table.insertRow();
    for (let j = 0; j < cols; j++) {
      const cell = row.insertCell();
      const input = createInputCell(i, j);
cell.appendChild(input);

    }
  }

  updateCalculatedValues();
}




function addRow() {
  const table = document.getElementById("dynamic-table");
  const row = table.insertRow();

  for (let i = 0; i < colCount; i++) {
    const cell = row.insertCell();
    const input = createInputCell(rowCount, i);
cell.appendChild(input);

  }

  rowCount++;
  updateCalculatedValues();
}




function removeRow() {
  const table = document.getElementById("dynamic-table");
  if (rowCount > 1) {
    table.deleteRow(-1);
    rowCount--;
  }
}

function addColumn() {
  const table = document.getElementById("dynamic-table");

  // 結果列の開始位置（常に最後の2列）
  const resultStartIndex = colCount - 2;

  for (let i = 0; i < rowCount; i++) {
    const row = table.rows[i];
    const cell = row.insertCell(resultStartIndex); // 結果列の前に挿入

    if (i === 0) {
      // タイトル行
      const th = document.createElement("th");
      th.textContent = `${resultStartIndex}`;
      row.replaceChild(th, cell);
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `セル ${i + 1}-${resultStartIndex + 1}`;
      input.value = "";
      input.addEventListener("input", updateCalculatedValues);
      cell.appendChild(input);
    }
  }

  colCount++;
  updateCalculatedValues();
}



function removeColumn() {
  const table = document.getElementById("dynamic-table");
  if (colCount > 4) {
    for (let i = 0; i < rowCount; i++) {
      table.rows[i].deleteCell(-1);
    }
    colCount--;
  }
}

function saveTableAsCSV() {
  const table = document.getElementById("dynamic-table");
  let csv = "";

  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cells = [];
    for (let j = 0; j < row.cells.length; j++) {
      const input = row.cells[j].querySelector("input");
      const value = input ? input.value : "";
      // ダブルクオートで囲んで、カンマや改行を安全に処理
      cells.push(`"${value.replace(/"/g, '""')}"`);
    }
    csv += cells.join(",") + "\n";
  }

  // Blobを使ってダウンロード
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "table.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function updateCalculatedValues() {
  const table = document.getElementById("dynamic-table");
  const multiplier = parseFloat(document.getElementById("multiplier")?.value) || 1;

  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    let total = 0;

    // 値列（1列目と最後の2列を除く）を合計
    for (let j = 1; j < colCount - 2; j++) {
      const input = row.cells[j]?.querySelector("input");
      if (input) {
        const value = parseFloat(input.value); 
        if (!isNaN(value)) { total += value; }
      }
    }

    // 結果①に合計、結果②に倍率をかけた値を表示
    const result1 = row.cells[colCount - 2]?.querySelector("input");
    const result2 = row.cells[colCount - 1]?.querySelector("input");

    if (result1) result1.value = total;
    if (result2) result2.value = total * multiplier;
  }

  // 色変更処理（省略せずにここに続けてOK！）


  // 各列の合計をチェックして色変更（1列目と最後の2列以外）
  for (let col = 1; col < colCount - 2; col++) {
    let colSum = 0;
    for (let row = 1; row < rowCount; row++) {
      const input = table.rows[row].cells[col]?.querySelector("input");
      const value = input ? parseFloat(input.value) || 0 : 0;
      colSum += value;
    }
    for (let row = 0; row < rowCount; row++) {
      const cell = table.rows[row].cells[col];
      if (cell) {
        cell.style.backgroundColor = colSum !== 0 ? "#ffcccc" : "";
      }
    }
  }

  // 最後の2列も色変更
  for (let j = colCount - 2; j < colCount; j++) {
    let sum = 0;
    for (let row = 1; row < rowCount; row++) {
      const input = table.rows[row].cells[j]?.querySelector("input");
      const value = input ? parseFloat(input.value) || 0 : 0;
      sum += value;
    }
    for (let row = 0; row < rowCount; row++) {
      const cell = table.rows[row].cells[j];
      if (cell) {
        cell.style.backgroundColor = sum !== 0 ? "#ffcccc" : "";
      }
    }
  }
}






