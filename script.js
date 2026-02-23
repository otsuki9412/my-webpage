

function login(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  if (username === "main" && password === "main123") {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("welcome").style.display = "block";

    const headings = document.querySelectorAll("#welcome h2, #welcome p");
    headings.forEach(el => el.remove());

    // 🔽 保存データがあれば行数・列数を取得してテーブルを作成！
    const saved = localStorage.getItem("tableData");
    if (saved) {
      const data = JSON.parse(saved);
      const rows = data.length + 1;
      const cols = data[0]?.length || 4;
      createTable(rows, cols);
    } else {
      createTable(5, 4);
    }

  } else {
    errorMessage.textContent = "ユーザー名またはパスワードが間違っています。";
  }

  return false;
}


function createInputCell(i, j) {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `セル ${i + 1}-${j + 1}`;

  // 初期値の設定（1列目以外）
  //if (j !== 0 && j < colCount - 2) {
    //input.value = "";
  //}

  // 結果列は読み取り専用
  if (j === colCount - 2 || j === colCount - 1) {
    input.readOnly = true;
    input.style.backgroundColor = "#f0f0f0";
    input.value = "0";
  }//else if (j !== 0) { 
    //input.value = ""; // ← 初期値を空にする！ 
    //}



  input.addEventListener("input", updateCalculatedValues);
  return input;
}
function copyTableToClipboard() {
  const table = document.getElementById("dynamic-table");
  let csv = "";

  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cells = [];

    for (let j = 0; j < row.cells.length; j++) {
      if (j === colCount - 2) {
        cells.push("→");
      }

      const input = row.cells[j].querySelector("input");
      const value = input ? input.value : row.cells[j].textContent;
      cells.push(value);
    }

    // 調整メモがあれば追加
    const note = adjustmentNotes.find(n => n.row === i);
    if (note) {
      cells[cells.length - 1] += ` ${note.note}`;
    }

    csv += cells.join(",") + "\n";
  }

  navigator.clipboard.writeText(csv).then(() => {
    alert("調整後の表をコピーしました！📋");
  }).catch(err => {
    alert("コピーに失敗しました…💦");
    console.error(err);
  });
}

function finalizeTable() {
  const table = document.getElementById("dynamic-table");
  adjustmentNotes = [];
  let total = 0;

  // 結果②の合計を計算（すべての行）
  for (let i = 1; i < rowCount; i++) {
    const input = table.rows[i].cells[colCount - 1]?.querySelector("input");
    const value = input ? parseFloat(input.value) || 0 : 0;
    total += value;
  }

  if (total !== 0) {
    const lastRowIndex = rowCount - 1;
    const lastInput = table.rows[lastRowIndex].cells[colCount - 1]?.querySelector("input");
    const original = parseFloat(lastInput.value) || 0;
    const adjusted = original - total;
    lastInput.value = adjusted;
    lastInput.dataset.adjusted = "true";

    // 名前列から名前を取得
    const nameInput = table.rows[lastRowIndex].cells[0]?.querySelector("input");
    const name = nameInput ? nameInput.value || `行${lastRowIndex}` : `行${lastRowIndex}`;

    adjustmentNotes.push({ row: lastRowIndex, note: `(${name} ${-total})` });
  }

  updateCalculatedValues();
  copyTableToClipboard();
  localStorage.removeItem("tableData"); // 終了時に保存データを削除

}
function logout() {

  // 表示をリセット
  document.getElementById("welcome").style.display = "none";
  document.getElementById("login-form").style.display = "block";
}

